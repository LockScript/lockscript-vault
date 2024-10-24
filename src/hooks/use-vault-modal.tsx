import { create } from "zustand";

interface useVaultModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useVaultModal = create<useVaultModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
