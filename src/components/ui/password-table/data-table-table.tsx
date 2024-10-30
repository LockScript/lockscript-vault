import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  Row,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { DataTableColumns } from "./data-table-columns";
import { useState } from "react";
import {PasswordItem} from "@prisma/client";

type DataTableTableProps<TData> = {
  decryptedData: TData[];
  loading: boolean;
  setCurrentId: (id: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DataTableTable<TData>({
  decryptedData,
  loading,
  setCurrentId,
  setOpen,
}: DataTableTableProps<PasswordItem>) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
    setCurrentId(id);
  };

  const columns: ColumnDef<PasswordItem>[] = DataTableColumns({
    toggleVisibility,
    visibility,
    setOpen,
    setCurrentId,
  });

  const table = useReactTable({
    data: decryptedData,
    columns,
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
            table.getRowModel().rows.map((row: Row<PasswordItem>) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
