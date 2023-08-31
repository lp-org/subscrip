import { ToastMessage } from "primereact/toast";
import { create } from "zustand";

interface AdminStoreState {
  selectedStore: string | null;
  setSelectedStore: (data: string) => void;
}

export const useAdminStore = create<AdminStoreState>()((set) => ({
  selectedStore: null,
  setSelectedStore: (selectedStore) =>
    set((state) => {
      return { selectedStore };
    }),
}));
