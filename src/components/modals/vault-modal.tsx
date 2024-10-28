"use client";

import {useVaultModal} from "@/hooks/use-vault-modal";
import {useUser} from "@clerk/nextjs";
import axios from "axios";
import {useState} from "react";
import {toast} from "react-hot-toast";
import {Button} from "../ui/button";
import {Modal} from "../ui/modal";

export const VaultModal = () => {
  const vaultModal = useVaultModal();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);

      if (!user) {
        toast.error("User is not authenticated.");
        return;
      }

      await axios.post("/api/vaults", {});
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Vault"
      description="Are you sure you want to create a new vault?"
      isOpen={vaultModal.isOpen}
      onClose={vaultModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            onClick={vaultModal.onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
