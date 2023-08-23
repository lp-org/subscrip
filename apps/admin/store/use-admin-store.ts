import { ToastMessage } from "primereact/toast";
import { create } from "zustand";

interface AdminStoreState {
  selectedStore: string;
  setSelectedStore: (data: string) => void;
}

export const useAdminStore = create<AdminStoreState>()((set) => ({
  selectedStore: "",
  setSelectedStore: (selectedStore) =>
    set((state) => {
      return { selectedStore };
    }),
}));
