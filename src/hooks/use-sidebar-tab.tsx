import { create } from "zustand";

interface useSidebarStore {
  tab: string;
  setTab: (newTab: string) => void;
}

export const useSidebar = create<useSidebarStore>((set) => ({
  tab: "Passwords",
  setTab: (newTab) => set({ tab: newTab }),
}));
