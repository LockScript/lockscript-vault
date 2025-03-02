import {deletePasswordItem,getPasswords} from "@/app/actions";
import {Button} from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {cn} from "@/lib/utils";
import {$Enums} from "@prisma/client";
import {SquareArrowOutUpRight,Trash,User,X} from "lucide-react";
import Image from "next/image";
import {SetStateAction} from "react";
import toast from "react-hot-toast";

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

const PasswordItem = ({
  selectedEntry,
  password,
  setSelectedEntry,
  setPasswordToDelete,
  setIsConfirmationDialogOpen,
  setPasswordItems,
}: {
  selectedEntry: PasswordEntry | null;
  password: PasswordEntry;
  setSelectedEntry: React.Dispatch<React.SetStateAction<PasswordEntry | null>>;
  setPasswordToDelete: React.Dispatch<
    React.SetStateAction<PasswordEntry | null>
  >;
  setIsConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordItems: React.Dispatch<
    SetStateAction<
      | {
          id: string;
          type: $Enums.VaultItemType;
          username: string;
          createdAt: Date;
          updatedAt: Date;
          website: string;
          password: string;
          usernameIV: string;
          websiteIV: string;
          passwordIV: string;
          userId: string;
        }[]
      | undefined
    >
  >;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "flex w-full justify-between rounded-xl p-2 text-left transition-all hover:bg-rose-50/50 dark:hover:bg-rose-900/50 hover:cursor-pointer",
            selectedEntry?.id === password.id && "bg-rose-50 dark:bg-rose-900"
          )}
          onClick={() => setSelectedEntry(password)}
        >
          <div className="flex w-full items-center gap-3">
            <div className="shrink-0 rounded-xl bg-rose-100 dark:bg-rose-800 p-1">
              <Image
                height={80}
                width={80}
                alt="Site"
                src={`https://s2.googleusercontent.com/s2/favicons?domain=${password.website}&sz=128`}
                className="h-8 w-8 rounded-full bg-primary/10 object-cover"
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
            className={cn(
              "text-muted-foreground hover:text-foreground hover:bg-rose-50",
              selectedEntry?.id === password.id && "bg-rose-100"
            )}
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
          <div className="font-medium text-gray-900">{password.name}</div>
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
              const updatedItems = await getPasswords();
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
  );
};

export default PasswordItem;
