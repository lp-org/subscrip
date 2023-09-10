import { create } from "zustand";
export const useUiStore = create()((set) => ({
    toast: undefined,
    setToast: (toast) => set((state) => {
        return { toast };
    }),
}));
