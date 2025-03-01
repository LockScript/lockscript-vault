"use client";

import { deletePasswordItem, getPasswords } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreatePasswordDialog } from "@/components/vault/dialogs/create-password-dialog";
import { EditPasswordDialog } from "@/components/vault/dialogs/edit-password-dialog";
import { Settings } from "@/components/vault/settings";
import { cn } from "@/lib/utils";
import { decrypt, generateAndStoreKey, retrieveKey } from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";
import type { Prisma } from "@prisma/client";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  Clock,
  Plus,
  SquareArrowOutUpRight,
  Trash,
  User,
  X,
} from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ConfirmationDialog } from "./dialogs/confirm-dialog";
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
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [passwordItems, setPasswordItems] = useState(user?.passwordItems);
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated">(
    "created"
  );
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [passwordToDelete, setPasswordToDelete] =
    useState<PasswordEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        decryptedPasswords
          .filter((item): item is PasswordEntry => item !== null)
          .sort(
            (a, b) =>
              new Date(b.created).getTime() - new Date(a.created).getTime()
          )
      );
    };

    decryptPasswords();
  }, [user?.passwordItems, clerkUser, passwordItems]);

  useEffect(() => {
    const sortPasswords = () => {
      const sorted = [...passwords].sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "updated":
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          default: // 'created'
            return (
              new Date(b.created).getTime() - new Date(a.created).getTime()
            );
        }
      });
      setPasswords(sorted);
    };
    sortPasswords();
  }, [sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditEntry = () => {
    setIsEditDialogOpen(true);
  };

  const filteredAndSortedPasswords = passwords
    .filter((password) => {
      if (!searchQuery) return true;

      const search = searchQuery.toLowerCase();
      return (
        password.name.toLowerCase().includes(search) ||
        password.username.toLowerCase().includes(search) ||
        password.website.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default: // 'created'
          return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <div className="hidden lg:block lg:w-64 border-r border-gray-100 dark:border-gray-800">
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

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between p-4 lg:px-6">
          <h1 className="text-2xl font-bold dark:text-white">My Vault</h1>
          <div className="flex items-center space-x-4">
            {activeTab !== "settings" && (
              <>
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-48 focus:ring-0 ring-0 focus-visible:ring-0 dark:bg-gray-800 dark:text-white"
                />
                <div className="w-1/3 overflow-y-auto">
                  <div className="flex items-center gap-2 p-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            sortBy === "name" &&
                              "bg-rose-50 dark:bg-rose-900 text-rose-900 dark:text-rose-50"
                          )}
                          onClick={() => setSortBy("name")}
                        >
                          <ArrowDownAZ className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sort alphabetically</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            sortBy === "created" &&
                              "bg-rose-50 dark:bg-rose-900 text-rose-900 dark:text-rose-50"
                          )}
                          onClick={() => setSortBy("created")}
                        >
                          <ArrowDownWideNarrow className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sort by created</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            sortBy === "updated" &&
                              "bg-rose-50 dark:bg-rose-900 text-rose-900 dark:text-rose-50"
                          )}
                          onClick={() => setSortBy("updated")}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sort by updated</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="bg-rose-50 hover:hover:bg-rose-100 dark:bg-rose-900 dark:hover:bg-rose-800"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {activeTab === "settings" ? (
            <div className="flex-1 overflow-y-auto">
              <Settings />
            </div>
          ) : (
            <>
              <div className="w-1/3 overflow-y-auto border-r dark:border-gray-800">
                <ScrollArea className="h-full">
                  <div className="space-y-2 p-4">
                    {activeTab === "passwords" &&
                      filteredAndSortedPasswords.map((password) => (
                        <ContextMenu key={password.id}>
                          <ContextMenuTrigger>
                            <div
                              className={cn(
                                "flex w-full justify-between rounded-xl p-2 text-left transition-all hover:bg-rose-50/50 dark:hover:bg-rose-900/50 hover:cursor-pointer",
                                selectedEntry?.id === password.id &&
                                  "bg-rose-50 dark:bg-rose-900"
                              )}
                              onClick={() => setSelectedEntry(password)}
                            >
                              <div className="flex w-full items-center gap-3">
                                <div className="flex-shrink-0 rounded-xl bg-rose-100 dark:bg-rose-800 p-2">
                                  <Image
                                    height={40}
                                    width={40}
                                    alt="Site"
                                    src={`https://s2.googleusercontent.com/s2/favicons?domain=${password.website}&sz=128`}
                                    className="h-4 w-4 rounded-full bg-primary/10 object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-white truncate">
                                    {password.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {password.username}
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPasswordToDelete(password);
                                  setIsConfirmationDialogOpen(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
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
                                  navigator.clipboard.writeText(
                                    password.username
                                  );
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

                                  toast.success(
                                    "Password deleted successfully"
                                  );

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
                    {activeTab === "notes" && (
                      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                        No {activeTab} available
                      </div>
                    )}
                    {activeTab === "pins" && (
                      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                        No {activeTab} available
                      </div>
                    )}
                    {activeTab === "cards" && (
                      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                        No {activeTab} available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 lg:p-6">
                {selectedEntry && activeTab === "passwords" ? (
                  <PasswordDetails
                    onEdit={handleEditEntry}
                    onDelete={async () => {
                      try {
                        await deletePasswordItem(selectedEntry.id);
                        router.refresh();
                        setSelectedEntry(null);
                        toast.success("Password deleted successfully");

                        const updatedItems = await getPasswords(
                          user?.id as string
                        );
                        setPasswordItems(updatedItems?.passwordItems);
                      } catch (error) {
                        toast.error("Failed to delete password");
                      }
                    }}
                    entry={selectedEntry}
                  />
                ) : (
                  <EmptyState activeTab={activeTab} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isEditDialogOpen && (
        <EditPasswordDialog
          isOpen={isEditDialogOpen}
          onClose={async () => {
            setIsEditDialogOpen(false);
            router.refresh();
            setSelectedEntry(null);

            const updatedItems = await getPasswords(user?.id as string);
            setPasswordItems(updatedItems?.passwordItems);
          }}
          entry={selectedEntry}
        />
      )}
      
      <CreatePasswordDialog
        open={isCreateDialogOpen}
        onClose={async () => {
          setIsCreateDialogOpen(false);

          const updatedItems = await getPasswords(user?.id as string);
          setPasswordItems(updatedItems?.passwordItems);
        }}
        setSelectedEntry={setSelectedEntry}
      />

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        title="Delete Password"
        message="Are you sure you want to delete this password? This action cannot be undone."
        onConfirm={async () => {
          if (passwordToDelete) {
            setIsDeleting(true);
            try {
              await deletePasswordItem(passwordToDelete.id);
              const updatedItems = await getPasswords(user?.id as string);
              setPasswordItems(updatedItems?.passwordItems);
              if (selectedEntry?.id === passwordToDelete.id) {
                setSelectedEntry(null);
              }
              toast.success("Password deleted successfully");
            } catch {
              toast.error("Failed to delete password");
            } finally {
              setIsDeleting(false);
              setIsConfirmationDialogOpen(false);
              setPasswordToDelete(null);
            }
          }
        }}
        loading={isDeleting}
      />
    </div>
  );
};
