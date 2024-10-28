"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  decrypt: (encryptedData: string) => Promise<string>; // Keep as Promise<string>
}

export function DataTable<
  TData extends { website: string; username: string; password: string }
>({ columns, data, decrypt }: DataTableProps<TData>) {
  const [decryptedData, setDecryptedData] = useState<TData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const table = useReactTable({
    data: decryptedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <div className="rounded-md border">
      <Table>
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
