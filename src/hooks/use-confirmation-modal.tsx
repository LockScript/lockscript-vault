import { create } from "zustand";

interface useConfirmationModalStore {
  isOpen: boolean;
  onOpen: (onConfirm?: () => void, onCancel?: () => void) => void;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useConfirmationModal = create<useConfirmationModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: (onConfirm, onCancel) => set({ isOpen: true, onConfirm, onCancel }),
    onClose: () => set({ isOpen: false }),
  })
);
