"use client";

import { usePasswordModal } from "@/hooks/use-password-modal";
import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import CryptoJS from "crypto-js";
import { CirclePlus, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { DataTable } from "../password-table/data-table";

interface PasswordVaultProps {
  user: Prisma.UserGetPayload<{
    include: {
      passwordItems: true;
      cardItems: true;
      pinItems: true;
      noteItems: true;
    };
  }>;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ user }) => {
  const passwordModal = usePasswordModal();
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!clerkUser) {
      return;
    }

    const decryptedItems = user.passwordItems.map((item) => ({
      ...item,
    }));

    setData(decryptedItems);
    setLoading(false);
  }, [clerkUser, user.passwordItems]);

  const generateEncryptionPassword = () => {
    return `${clerkUser!.id}-${
      clerkUser!.createdAt
    }-${clerkUser!.createdAt?.getTime()}-${clerkUser!.id.charCodeAt(
      clerkUser!.id.length - 1
    )}-${clerkUser!.createdAt?.getDate()}-${clerkUser!.id.charCodeAt(
      0
    )}-${clerkUser!.createdAt?.getUTCFullYear()}-${clerkUser!.id.charCodeAt(
      1
    )}-${clerkUser!.createdAt?.getUTCHours()}-${
      clerkUser!.id.length
    }-${clerkUser!.createdAt?.getUTCMinutes()}`;
  };

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const decrypt = async (encryptedData: string) => {
    const encryptionPassword = generateEncryptionPassword();
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="text-black animate-spin" />
        <h1 className="text-black font-semibold">Decrypting your data..</h1>
      </div>
    );
  }

  return (
    <div className="ml-10 mr-10">
      <div className="relative w-full h-full">
        <div className="fixed top-2 right-2 h-16 w-16 flex items-center justify-center">
          <Button size="icon" onClick={passwordModal.onOpen}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <h1 className="flex justify-center ml-auto text-5xl mb-10">Passwords</h1>
      <DataTable data={data} decrypt={decrypt} />
    </div>
  );
};

export default PasswordVault;
