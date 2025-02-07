"use client";

import { deletePasswordItem, getPasswords } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreatePasswordDialog } from "@/components/vault/dialogs/create-password-dialog";
import { EditPasswordDialog } from "@/components/vault/dialogs/edit-password-dialog";
import { cn } from "@/lib/utils";
import { decrypt, generateAndStoreKey, retrieveKey } from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { Plus, SquareArrowOutUpRight, Trash, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { EmptyState } from "./empty-state";
import { PasswordDetails } from "./password-details";
import { Sidebar } from "./sidebar";

interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  website: string;
  password: string;
  usernameIV: string;
  websiteIV: string;
  passwordIV: string;
  updatedAt: string;
  lastAccess: string;
  created: string;
}

interface VaultPageProps {
  user: Prisma.UserGetPayload<{
    include: {
      passwordItems: true;
      cardItems: true;
      pinItems: true;
      noteItems: true;
    };
  }> | null;
}

export const VaultPage: React.FC<VaultPageProps> = ({ user }) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("passwords");
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntries, setFilteredEntries] = useState<PasswordEntry[]>([]);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [passwordItems, setPasswordItems] = useState(user?.passwordItems);

  useEffect(() => {
    const ensureEncryptionKey = async () => {
      if (!clerkUser) return;

      const userId = clerkUser.id;

      try {
        await retrieveKey(userId);
        toast.success("Encryption key found");
      } catch {
        toast.success("Generating encryption key...");
        await generateAndStoreKey(userId);
      }
    };

    ensureEncryptionKey();
  }, [clerkUser]);

  useEffect(() => {
    if (!clerkUser) return;

    if (!user?.passwordItems || !passwordItems) return;

    const decryptPasswords = async () => {
      const decryptedPasswords = await Promise.all(
        passwordItems.map(async (item) => {
          try {
            const decryptedItem = {
              id: item.id,
              name: await decrypt(item.username, item.usernameIV, clerkUser.id),
              username: await decrypt(
                item.username,
                item.usernameIV,
                clerkUser.id
              ),
              website: await decrypt(
                item.website,
                item.websiteIV,
                clerkUser.id
              ),
              password: await decrypt(
                item.password,
                item.passwordIV,
                clerkUser.id
              ),
              updatedAt: item.updatedAt.toISOString(),
              lastAccess: item.updatedAt.toISOString(),
              created: item.createdAt.toISOString(),
            };
            return decryptedItem;
          } catch (error) {
            console.error(`Error decrypting item ID: ${item.id}`, error);
            return null;
          }
        })
      );

      setPasswords(
        decryptedPasswords.filter(
          (item): item is PasswordEntry => item !== null
        )
      );
    };

    decryptPasswords();
  }, [user?.passwordItems, clerkUser, passwordItems]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Filter entries based on search query
    // ... (filter entries logic)
  };

  const handleEditEntry = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-white">
      <div className="hidden lg:block lg:w-64 border-r border-gray-100">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-4 lg:px-6">
          <h1 className="text-2xl font-bold">My Vault</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 focus:ring-0 ring-0 focus-visible:ring-0"
            />
            <Button
              size="icon"
              className="bg-rose-50 hover:hover:bg-rose-100"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="flex-1 border-r">
              <div className="space-y-2 p-4">
                {activeTab === "passwords" &&
                  passwords.map((password) => (
                    <ContextMenu key={password.id}>
                      <ContextMenuTrigger>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start rounded-xl p-6 text-left transition-all hover:bg-rose-50/50",
                            selectedEntry?.id === password.id && "bg-rose-50"
                          )}
                          onClick={() => setSelectedEntry(password)}
                        >
                          <div className="flex w-full items-start gap-3">
                            <div className="rounded-xl bg-rose-100 p-2 mt-1">
                              <Image
                                height={40}
                                width={40}
                                alt="Site"
                                src={`https://s2.googleusercontent.com/s2/favicons?domain=${password.website}&sz=128`}
                                className="h-4 w-4 rounded-full bg-primary/10 object-cover flex items-center justify-center"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-gray-900">
                                {password.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {password.username}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="rounded-xl">
                        <ContextMenuLabel>
                          <div className="font-medium text-gray-900">
                            {password.name}
                          </div>
                        </ContextMenuLabel>
                        <ContextMenuItem
                          onClick={() => {
                            try {
                              window.open(password.website, "_blank");
                              toast.success("Website opened successfully");
                            } catch (error) {
                              toast.error("Failed to open website");
                            }
                          }}
                        >
                          <SquareArrowOutUpRight className="h-4 w-4 mr-2" />
                          Open Website
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(password.username);
                              toast.success("Username copied successfully");
                            } catch (error) {
                              toast.error("Failed to copy username");
                            }
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Copy Username
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={async () => {
                            try {
                              await deletePasswordItem(password.id);
                              const updatedItems = await getPasswords(
                                user?.id as string
                              );
                              setPasswordItems(updatedItems?.passwordItems);
                              if (selectedEntry?.id === password.id) {
                                setSelectedEntry(null);
                              }

                              toast.success("Password deleted successfully");

                              return;
                            } catch (error) {
                              toast.error("Failed to delete password");

                              return;
                            }
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                {activeTab !== "passwords" && (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No {activeTab} available
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 bg-white p-4 lg:p-6">
            {selectedEntry && activeTab === "passwords" ? (
              <PasswordDetails
                onEdit={handleEditEntry}
                onDelete={async () => {
                  try {
                    await deletePasswordItem(selectedEntry.id);
                    router.refresh();
                    setSelectedEntry(null);
                    toast.success("Password deleted successfully");

                    return;
                  } catch (error) {
                    toast.error("Failed to delete password");

                    return;
                  }
                }}
                entry={selectedEntry}
              />
            ) : (
              <EmptyState activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
      {isEditDialogOpen && (
        <EditPasswordDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            router.refresh();
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
        />
      )}
      <CreatePasswordDialog
        open={isCreateDialogOpen}
        onClose={async () => {
          setIsCreateDialogOpen(false);
          setSelectedEntry(null);
          const userWithPasswords = await getPasswords(user?.id as string);
          setPasswordItems(userWithPasswords?.passwordItems);
        }}
      />
    </div>
  );
};
