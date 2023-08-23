import { ToastMessage } from "primereact/toast";
import { create } from "zustand";

interface BearState {
  toast: ToastMessage | undefined;
  setToast: (data: ToastMessage) => void;
}

export const useUiStore = create<BearState>()((set) => ({
  toast: undefined,
  setToast: (toast) =>
    set((state) => {
      return { toast };
    }),
}));
