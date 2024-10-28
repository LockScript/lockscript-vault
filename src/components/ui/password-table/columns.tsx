"use client";

import { PasswordItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PasswordItem>[] = [
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
];
