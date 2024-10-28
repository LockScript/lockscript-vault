"use client";

import { PasswordItem } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Clipboard, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useConfirmationModal } from "@/hooks/use-confirmation-modal";

interface DataTableProps<TData> {
  data: TData[];
  decrypt: (encryptedData: string) => Promise<string>;
}

export function DataTable<
  TData extends {
    id: string;
    website: string;
    username: string;
    password: string;
  }
>({ data, decrypt }: DataTableProps<TData>) {
  const [decryptedData, setDecryptedData] = useState<TData[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const confirmationModal = useConfirmationModal();

  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const decryptData = async () => {
      const decryptedDataPromises = data.map(async (item) => ({
        ...item,
        website: await decrypt(item.website),
        username: await decrypt(item.username),
        password: await decrypt(item.password),
      }));

      const resolvedData = await Promise.all(decryptedDataPromises);
      setDecryptedData(resolvedData);
      setLoading(false);
    };

    decryptData();
  }, [data, decrypt]);

  const columnsWithVisibility: ColumnDef<TData>[] = [
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
      cell: ({ row }) => {
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
        const dateValue = getValue() as string;
        const date = new Date(dateValue);

        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const entry = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.website)}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy website
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.username)}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy username
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.password)}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: decryptedData,
    columns: columnsWithVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border table-fixed w-full">
      <Table className="table-fixed w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsWithVisibility.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
