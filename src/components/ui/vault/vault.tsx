"use client";

import { useVaultModal } from "@/hooks/use-vault-modal";
import { User } from "@prisma/client";
import { useEffect } from "react";

interface VaultPageProps {
  user: User;
}

const VaultPage: React.FC<VaultPageProps> = ({ user }) => {
  console.log(user);

  const vaultModal = useVaultModal();

  useEffect(() => {
    if (!user && !vaultModal.isOpen) {
      vaultModal.onOpen();
    }
  }, [user, vaultModal.isOpen]);

  return (
    <div>
      <h1>Vault Page</h1>
    </div>
  );
};

export default VaultPage;
