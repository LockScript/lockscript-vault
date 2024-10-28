"use client";

import { useSidebar } from "@/hooks/use-sidebar-tab";
import { useVaultModal } from "@/hooks/use-vault-modal";
import { Prisma } from "@prisma/client";
import { useEffect } from "react";
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
    <div className="h-screen">
      {sidebar.tab === "Passwords" && user ? (
        <PasswordVault user={user} />
      ) : (
        <div>Please log in to access your vault.</div>
      )}
    </div>
  );
};

export default VaultPage;
