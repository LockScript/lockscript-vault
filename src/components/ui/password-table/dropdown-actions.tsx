import { Clipboard, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import toast from "react-hot-toast";
import { Button } from "../button";
import { PasswordItem } from "@prisma/client";

export function DropdownActions({
  entry,
  setOpen,
  setCurrentId,
}: {
  entry: PasswordItem;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentId: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(entry.website);
            toast.success("Website copied.");
          }}
        >
          <Clipboard className="mr-2 h-4 w-4" /> Copy website
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(entry.username);
            toast.success("Username copied.");
          }}
        >
          <Clipboard className="mr-2 h-4 w-4" /> Copy username
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(entry.password);
            toast.success("Password copied.");
          }}
        >
          <Clipboard className="mr-2 h-4 w-4" /> Copy password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {setOpen(true); setCurrentId(entry.id)}}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
