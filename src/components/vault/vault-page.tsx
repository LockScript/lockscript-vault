"use client";

import {
  deleteNoteItem,
  deletePasswordItem,
  getItems,
  updateNoteItem,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreatePasswordDialog } from "@/components/vault/dialogs/create-password-dialog";
import { EditPasswordDialog } from "@/components/vault/dialogs/edit-password-dialog";
import { Settings } from "@/components/vault/settings";
import { cn } from "@/lib/utils";
import {
  decrypt,
  encrypt,
  generateAndStoreKey,
  retrieveKey,
} from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";
import type { NoteItem, Prisma } from "@prisma/client";
import { ArrowDownAZ, ArrowDownWideNarrow, Clock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ConfirmationDialog } from "./dialogs/confirm-dialog";
import { EmptyState } from "./empty-state";
import { PasswordDetails } from "./password/password-details";
import PaswordTab from "./password/password-tab";
import { Sidebar } from "./sidebar";
import { NoteDetails } from "./notes/note-details";
import { NotesTab } from "./notes/notes-tab";
import { CreateNoteDialog } from "./dialogs/create-note-dialog";

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

interface NoteEntry {
  id: string;
  title: string;
  content: string;
  titleIV: string;
  contentIV: string;
  createdAt: string;
  updatedAt: string;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateNoteDialogOpen, setIsCreateNoteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("passwords");
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated">(
    "updated"
  );

  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(
    null
  );
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [passwordItems, setPasswordItems] = useState(user?.passwordItems);
  const [searchQuery, setSearchQuery] = useState("");

  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [noteItems, setNoteItems] = useState(user?.noteItems);
  const [selectedNote, setSelectedNote] = useState<NoteEntry | null>(null);

  const [passwordToDelete, setPasswordToDelete] =
    useState<PasswordEntry | null>(null);

  useEffect(() => {
    const ensureEncryptionKey = async () => {
      if (!clerkUser) return;

      try {
        await retrieveKey(clerkUser.id);
        toast.success("Encryption key found");
      } catch {
        toast.success("Generating encryption key...");
        await generateAndStoreKey(clerkUser.id);
      }
    };

    ensureEncryptionKey();
  }, [clerkUser]);

  useEffect(() => {
    if (
      !clerkUser ||
      !user?.passwordItems ||
      !user?.noteItems ||
      !passwordItems ||
      !noteItems
    )
      return;

    const decryptNotes = async () => {
      const decryptedNotes = await Promise.all(
        noteItems.map(async (note) => {
          try {
            const decryptedNote: NoteEntry = {
              id: note.id,
              title: await decrypt(note.title, note.titleIV, clerkUser.id),
              content: await decrypt(
                note.content,
                note.contentIV,
                clerkUser.id
              ),
              titleIV: note.titleIV,
              contentIV: note.contentIV,
              createdAt: note.createdAt.toISOString(),
              updatedAt: note.updatedAt.toISOString(),
            };
            return decryptedNote;
          } catch (error) {
            console.error(`Error decrypting note ID: ${note.id}`, error);
            return null;
          }
        })
      );

      setNotes(
        decryptedNotes.filter((note): note is NoteEntry => note !== null)
      );
    };

    decryptNotes();

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
  }, [
    user?.passwordItems,
    user?.noteItems,
    clerkUser,
    passwordItems,
    noteItems,
  ]);

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
          default:
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
        default:
          return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

  const handleNoteDelete = async () => {
    if (!selectedNote) return;

    try {
      await deleteNoteItem(selectedNote.id);
      router.refresh();
      setSelectedNote(null);
      toast.success("Note deleted successfully");

      const updatedItems = await getItems();

      setNoteItems(updatedItems?.noteItems);
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const filteredAndSortedNotes = notes
    .filter((note) => {
      if (!searchQuery) return true;

      const search = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
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
                  onClick={() => {
                    if (activeTab === "notes") {
                      setIsCreateNoteDialogOpen(true);
                    } else {
                      setIsCreateDialogOpen(true);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {(() => {
            switch (activeTab) {
              case "settings":
                return (
                  <div className="flex-1 overflow-y-auto">
                    <Settings />
                  </div>
                );

              case "passwords":
                return (
                  <>
                    <div className="w-1/3 overflow-y-auto border-r border-t dark:border-gray-800">
                      <ScrollArea className="h-full">
                        <div className="space-y-2 p-4">
                          <PaswordTab
                            activeTab={activeTab}
                            selectedEntry={selectedEntry}
                            setSelectedEntry={setSelectedEntry}
                            setPasswordToDelete={setPasswordToDelete}
                            setIsConfirmationDialogOpen={
                              setIsConfirmationDialogOpen
                            }
                            setPasswordItems={setPasswordItems}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            filteredAndSortedPasswords={
                              filteredAndSortedPasswords
                            }
                          />
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 lg:p-6 border-t">
                      {selectedEntry && (
                        <PasswordDetails
                          onEdit={() => setIsEditDialogOpen(true)}
                          onDelete={async () => {
                            try {
                              await deletePasswordItem(selectedEntry.id);
                              router.refresh();
                              setSelectedEntry(null);
                              toast.success("Password deleted successfully");

                              const updatedItems = await getItems();
                              setPasswordItems(updatedItems?.passwordItems);
                            } catch (error) {
                              toast.error("Failed to delete password");
                            }
                          }}
                          entry={selectedEntry}
                        />
                      )}
                    </div>
                  </>
                );

              case "notes":
                return (
                  <>
                    <div className="w-1/3 overflow-y-auto border-r border-t dark:border-gray-800">
                      <ScrollArea className="h-full">
                        <div className="space-y-2 p-4">
                          <NotesTab
                            activeTab={activeTab}
                            selectedNote={selectedNote}
                            setSelectedNote={setSelectedNote}
                            notes={filteredAndSortedNotes}
                            onDelete={handleNoteDelete}
                          />
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 lg:p-6 border-t">
                      {selectedNote ? (
                        <NoteDetails
                          note={selectedNote}
                          onEdit={async ({ title, content }) => {
                            if (!clerkUser) return;

                            try {
                              const {
                                encryptedData: encryptedTitle,
                                iv: titleIV,
                              } = await encrypt(title, clerkUser.id);
                              const {
                                encryptedData: encryptedContent,
                                iv: contentIV,
                              } = await encrypt(content, clerkUser.id);

                              await updateNoteItem(
                                selectedNote.id,
                                encryptedTitle,
                                encryptedContent,
                                titleIV,
                                contentIV
                              );

                              const updatedItems = await getItems();

                              setNoteItems(updatedItems?.noteItems);
                              toast.success("Note updated successfully");
                            } catch (error) {
                              toast.error("Failed to update note");
                            }
                          }}
                          onDelete={handleNoteDelete}
                        />
                      ) : (
                        <EmptyState activeTab={activeTab} />
                      )}
                    </div>
                  </>
                );

              default:
                return <EmptyState activeTab={activeTab} />;
            }
          })()}
        </div>
      </div>

      {isEditDialogOpen && (
        <EditPasswordDialog
          isOpen={isEditDialogOpen}
          onClose={async () => {
            setIsEditDialogOpen(false);
            router.refresh();
            setSelectedEntry(null);

            const updatedItems = await getItems();
            setPasswordItems(updatedItems?.passwordItems);
          }}
          entry={selectedEntry}
        />
      )}

      <CreatePasswordDialog
        open={isCreateDialogOpen}
        onClose={async () => {
          setIsCreateDialogOpen(false);

          const updatedItems = await getItems();
          setPasswordItems(updatedItems?.passwordItems);
        }}
        setSelectedEntry={setSelectedEntry}
      />

      <CreateNoteDialog
        open={isCreateNoteDialogOpen}
        onClose={async () => {
          setIsCreateNoteDialogOpen(false);
          const updatedItems = await getItems();

          if (!updatedItems?.noteItems || !clerkUser) return;

          setNoteItems(updatedItems?.noteItems);
        }}
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
              const updatedItems = await getItems();
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
