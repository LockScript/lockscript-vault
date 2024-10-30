"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { PasswordItem } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert-modal";
import { DataTableTable } from "./data-table-table";

interface DataTableProps<TData> {
  data: TData[];
  decrypt: (encryptedData: string) => Promise<string>;
}

export function DataTable<TData extends PasswordItem>({
  data,
  decrypt,
}: DataTableProps<TData>) {
  const router = useRouter();
  const [decryptedData, setDecryptedData] = useState<TData[]>([]);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const decrypted = await Promise.all(
        data.map(async (item) => ({
          ...item,
          website: await decrypt(item.website),
          username: await decrypt(item.username),
          password: await decrypt(item.password),
        }))
      );
      setDecryptedData(decrypted);
      setLoading(false);
    })();
  }, [data, decrypt]);

  const onDelete = async () => {
    if (!currentId) return;
    try {
      setModalLoading(true);
      await axios.delete(`/api/passwords/${currentId}`);
      router.refresh();
      toast.success("Password deleted.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setModalLoading(false);
      setOpen(false);
      setCurrentId(null);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
        loading={modalLoading}
      />
      <DataTableTable
        decryptedData={decryptedData}
        loading={loading}
        setCurrentId={setCurrentId}
        setOpen={setOpen}
      />
    </>
  );
}
