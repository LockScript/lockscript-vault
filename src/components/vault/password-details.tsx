"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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
    <div className="space-y-6 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 truncate flex-1 mr-2">
          {entry.name}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-rose-50 hover:hover:bg-rose-100 dark:bg-rose-900 dark:hover:bg-rose-800"
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
        <DetailItem
          icon={<Globe className="h-4 w-4 flex-shrink-0" />}
          value={entry.website}
          onCopy={() => {
            navigator.clipboard.writeText(entry.website);
            toast.success("Copied website successfully");
          }}
          className="rounded-tl-xl rounded-tr-xl"
        >
          <a href={entry.website} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="p-0">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </a>
        </DetailItem>

        <DetailItem
          icon={<User className="h-4 w-4 flex-shrink-0" />}
          value={entry.username}
          onCopy={() => {
            navigator.clipboard.writeText(entry.username);
            toast.success("Copied username successfully");
          }}
          className="py-6"
        />

        <DetailItem
          icon={<Lock className="h-4 w-4 flex-shrink-0" />}
          value={
            isPasswordVisible
              ? entry.password
              : "•".repeat(entry.password.length)
          }
          onCopy={() => {
            navigator.clipboard.writeText(entry.password);
            toast.success("Copied password successfully");
          }}
          className="rounded-br-xl rounded-bl-xl"
        >
          <Button
            variant="ghost"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-0"
            size="icon"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </DetailItem>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
          History
        </h3>
        <div className="space-y-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4">
          {["Created", "Last modified", "Last access"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
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

interface DetailItemProps {
  icon: React.ReactNode;
  value: string;
  onCopy: () => void;
  children?: React.ReactNode;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  value,
  onCopy,
  children,
  className,
}) => (
  <div
    className={cn(
      "flex items-center justify-between border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4",
      className
    )}
  >
    <Tooltip>
      <TooltipContent>Copy</TooltipContent>
      <TooltipTrigger
        onClick={onCopy}
        className="flex items-center space-x-2 max-w-[calc(100%-2rem)] overflow-hidden"
      >
        {icon}
        <span className="text-gray-900 dark:text-gray-100 truncate">
          {value}
        </span>
      </TooltipTrigger>
    </Tooltip>
    {children}
  </div>
);
