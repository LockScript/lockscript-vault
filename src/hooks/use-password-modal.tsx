import { create } from "zustand";

interface usePasswordModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePasswordModal = create<usePasswordModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
