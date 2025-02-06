import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Globe,
  Lock,
  MoreVertical,
  Settings,
  SquareArrowOutUpRight,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  website: string;
  password: string;
  updatedAt: string;
  lastAccess: string;
  created: string;
}

interface PasswordDetailsProps {
  entry: PasswordEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export const PasswordDetails: React.FC<PasswordDetailsProps> = ({
  entry,
  onEdit,
  onDelete,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{entry.name}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-rose-50 hover:hover:bg-rose-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl">
            <DropdownMenuItem onClick={onEdit}>
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div className="flex items-center justify-between rounded-t-xl border border-gray-200 bg-gray-50/50 p-4">
          <Tooltip>
            <TooltipContent>Copy</TooltipContent>
            <TooltipTrigger
              onClick={() => {
                navigator.clipboard.writeText(entry.website);
                toast.success("Copied website succesfully");
              }}
            >
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-gray-900">{entry.website}</span>
              </div>
            </TooltipTrigger>
          </Tooltip>

          <a href={entry.website} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="p-0">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-between border border-gray-200 bg-gray-50/50 px-4 py-6">
          <Tooltip>
            <TooltipContent>Copy</TooltipContent>
            <TooltipTrigger
              onClick={() => {
                navigator.clipboard.writeText(entry.username);
                toast.success("Copied username succesfully");
              }}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-gray-900">{entry.username}</span>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center justify-between rounded-b-xl border border-gray-200 bg-gray-50/50 p-4">
          <Tooltip>
            <TooltipContent>Copy</TooltipContent>
            <TooltipTrigger
              onClick={() => {
                navigator.clipboard.writeText(entry.password);
                toast.success("Copied password succesfully");
              }}
            >
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>
                  {isPasswordVisible
                    ? entry.password
                    : "•".repeat(entry.password.length)}
                </span>
              </div>
            </TooltipTrigger>
          </Tooltip>

          <Button
            variant="ghost"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-0"
            size={"icon"}
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-500">History</h3>{" "}
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          {["Created", "Last modified", "Last access"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">
                {label === "Last access"
                  ? new Date(entry.lastAccess).toLocaleString()
                  : label === "Last modified"
                  ? new Date(entry.updatedAt).toLocaleString()
                  : label === "Created"
                  ? new Date(entry.created).toLocaleString()
                  : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
