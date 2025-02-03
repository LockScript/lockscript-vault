"use client";

import { cn } from "@/lib/utils";
import {
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  Menu,
  MoreVertical,
  Pin,
  Plus,
  Search,
  Settings,
  StickyNote,
  Trash,
  X,
} from "lucide-react";
import * as React from "react";

import { deletePasswordItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPasswordDialog } from "@/components/ui/edit-password-dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UserButton, useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { CreatePasswordDialog } from "./create-password-dialog";

interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  website: string;
  password: string;
  lastModified: string;
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

const generateEncryptionPassword = (clerkUser: any) => {
  if (!clerkUser) return "";

  return `${clerkUser.id}-${
    clerkUser.createdAt
  }-${clerkUser.createdAt?.getTime()}-${clerkUser.id.charCodeAt(
    clerkUser.id.length - 1
  )}-${clerkUser.createdAt?.getDate()}-${clerkUser.id.charCodeAt(
    0
  )}-${clerkUser.createdAt?.getUTCFullYear()}-${clerkUser.id.charCodeAt(
    1
  )}-${clerkUser.createdAt?.getUTCHours()}-${
    clerkUser.id.length
  }-${clerkUser.createdAt?.getUTCMinutes()}`;
};

export const encrypt = (data: string, clerkUser: any) => {
  const encryptionPassword = generateEncryptionPassword(clerkUser);
  return CryptoJS.AES.encrypt(data, encryptionPassword).toString();
};

export const decrypt = (encryptedData: string, clerkUser: any) => {
  const encryptionPassword = generateEncryptionPassword(clerkUser);
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const VaultPage: React.FC<VaultPageProps> = ({ user }) => {
  const [selectedEntry, setSelectedEntry] =
    React.useState<PasswordEntry | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("passwords");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [passwords, setPasswords] = React.useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPasswords = passwords.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!clerkUser) return;

    if (!user?.passwordItems) return;

    const decryptedPasswords = user.passwordItems
      .map((item) => ({
        id: item.id,
        name: decrypt(item.username, clerkUser),
        username: decrypt(item.username, clerkUser),
        website: decrypt(item.website, clerkUser),
        password: decrypt(item.password, clerkUser),
        lastModified: item.updatedAt.toISOString(),
        lastAccess: item.updatedAt.toISOString(),
        created: item.createdAt.toISOString(),
      }))
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );

    setPasswords(decryptedPasswords);
  }, [user?.passwordItems, clerkUser]);

  const handleEditEntry = () => {
    setIsEditDialogOpen(true);
  };

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserButton />
          <span className="text-lg font-semibold text-gray-900">
            LockScript Vault
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700", activeTab === "passwords" && "bg-rose-50 text-rose-700")}
          onClick={() => {
            setActiveTab("passwords");
            setIsSidebarOpen(false);
          }}
        >
          <Key className="h-5 w-5" />
          Passwords
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700", activeTab === "notes" && "bg-rose-50 text-rose-700")}
          onClick={() => {
            setActiveTab("notes");
            setIsSidebarOpen(false);
          }}
        >
          <StickyNote className="h-5 w-5" />
          Notes
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700", activeTab === "pins" && "bg-rose-50 text-rose-700")}
          onClick={() => {
            setActiveTab("pins");
            setIsSidebarOpen(false);
          }}
        >
          <Pin className="h-5 w-5" />
          Pins
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700", activeTab === "cards" && "bg-rose-50 text-rose-700")}
          onClick={() => {
            setActiveTab("cards");
            setIsSidebarOpen(false);
          }}
        >
          <CreditCard className="h-5 w-5" />
          Cards
        </Button>
      </nav>
      <div className="mt-auto pt-6">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700", activeTab === "settings" && "bg-rose-50 text-rose-700")}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-white">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:block lg:w-64 border-r border-gray-100">
        <Sidebar />
      </div>

      {/* Sidebar for mobile */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* List Panel */}
          <div className="w-full lg:w-[350px] border-r border-gray-100">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white p-4">
              <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="border-none bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)]">
              <div className="space-y-2 p-4">
                {activeTab === "passwords" &&
                  filteredPasswords.map((password) => (
                    <Button
                      key={password.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start rounded-xl p-6 text-left transition-all hover:bg-rose-50/50",
                        selectedEntry?.id === password.id && "bg-rose-50"
                      )}
                      onClick={() => setSelectedEntry(password)}
                    >
                      <div className="flex w-full items-start gap-3">
                        <div className="rounded-xl bg-rose-100 p-2 mt-1">
                          <Globe className="h-4 w-4 text-rose-500" />
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
                  ))}
                {activeTab !== "passwords" && (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No {activeTab} available
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Details Panel */}
          <div className="flex-1 bg-white p-4 lg:p-6">
            {selectedEntry && activeTab === "passwords" ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-rose-100 p-2">
                      <Globe className="h-5 w-5 text-rose-500" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedEntry.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedEntry.username}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-gray-200 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem
                        className="py-2"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedEntry.password);
                          toast.success("Password copied to clipboard");
                        }}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Copy Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="py-2"
                        onSelect={handleEditEntry}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="py-2 text-rose-600"
                        onClick={() => {
                          deletePasswordItem(selectedEntry.id);
                          router.refresh();
                          setSelectedEntry(null);
                          toast.success("Password deleted successfully");
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Website
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-rose-200 hover:shadow-md">
                      <span className="text-sm text-gray-900">
                        {selectedEntry.website}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Password
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-rose-200 hover:shadow-md">
                      <span className="font-mono text-sm text-gray-900">
                        {isPasswordVisible
                          ? selectedEntry.password
                          : "••••••••••••"}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          {isPasswordVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">History</h3>
                  <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Created</span>
                      <span className="font-medium text-gray-900">
                        {selectedEntry.created}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last modified</span>
                      <span className="font-medium text-gray-900">
                        {selectedEntry.lastModified}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last access</span>
                      <span className="font-medium text-gray-900">
                        {selectedEntry.lastAccess}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-xl bg-gray-100 p-4">
                  {activeTab === "passwords" && (
                    <Lock className="h-8 w-8 text-gray-400" />
                  )}
                  {activeTab === "notes" && (
                    <StickyNote className="h-8 w-8 text-gray-400" />
                  )}
                  {activeTab === "pins" && (
                    <Pin className="h-8 w-8 text-gray-400" />
                  )}
                  {activeTab === "cards" && (
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No {activeTab} Selected
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select an entry to view its details
                  </p>
                </div>
              </div>
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
        onClose={() => {
          setIsCreateDialogOpen(false);
          router.refresh();
          setSelectedEntry(null);
        }}
      />
    </div>
  );
};
