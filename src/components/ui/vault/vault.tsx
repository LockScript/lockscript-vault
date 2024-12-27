"use client";

import { useSidebar } from "@/hooks/use-sidebar-tab";
import { useVaultModal } from "@/hooks/use-vault-modal";
import { Prisma } from "@prisma/client";
import { useEffect } from "react";
import { Icons } from "../icons";
import PasswordVault from "./password-vault";

interface VaultPageProps {
  user: Prisma.UserGetPayload<{
    include: {
      passwordItems: true;
      cardItems: true;
      pinItems: true;
      noteItems: true;
    };
  }> | null;
}

const VaultPage: React.FC<VaultPageProps> = ({ user }) => {
  const vaultModal = useVaultModal();
  const sidebar = useSidebar();

  useEffect(() => {
    if (!user && !vaultModal.isOpen) {
      vaultModal.onOpen();
    }
  }, [user, vaultModal.isOpen]);

  return (
    <div className="h-screen w-full">
      {sidebar.tab === "Passwords" && user ? (
        <PasswordVault user={user} />
      ) : (
        <div className="h-screen w-screen flex justify-center items-center">
          <Icons.logo className="w-20 h-20" />
          <h1 className="font-bold tracking-tig text-3xl">Not Complete</h1>
        </div>
      )}
    </div>
  );
};

export default VaultPage;
