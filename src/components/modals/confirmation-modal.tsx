"use client";

import { useConfirmationModal } from "@/hooks/use-confirmation-modal";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { useState } from "react";
import toast from "react-hot-toast";

export const ConfirmationModal = () => {
  const { isOpen, onClose, onConfirm, onCancel } = useConfirmationModal();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
        toast("An error occurred. Please try again.")
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal
      title="Confirm Action"
      description="Are you sure you want to proceed with this action?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
