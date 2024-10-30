import { Eye } from "lucide-react";
import { Button } from "../button";
import { DropdownActions } from "./dropdown-actions";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PasswordItem } from "@prisma/client";

type DataTableColumnsProps<TData extends PasswordItem> = {
  toggleVisibility: (id: string) => void;
  visibility: Record<string, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentId: (id: string) => void;
};

export function DataTableColumns<TData extends PasswordItem>({
  toggleVisibility,
  visibility,
  setOpen,
  setCurrentId,
}: DataTableColumnsProps<TData>): ColumnDef<TData>[] {
  return [
    {
      accessorKey: "website",
      header: "Website",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }: { row: Row<TData> }) => {
        const entry = row.original;
        const isVisible = visibility[entry.id] || false;

        return (
          <div className="flex items-center">
            <span>{isVisible ? entry.password : "••••••••"}</span>
            <Button
              variant="ghost"
              className="ml-2 h-8 w-8 p-0"
              onClick={() => toggleVisibility(entry.id)}
            >
              <Eye />
            </Button>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<TData> }) => {
        return <DropdownActions entry={row.original} setOpen={setOpen} setCurrentId={setCurrentId} />;
      },
    },
  ];
}
