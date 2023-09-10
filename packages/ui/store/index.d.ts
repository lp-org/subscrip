import { ToastMessage } from "primereact/toast";
interface BearState {
    toast: ToastMessage | undefined;
    setToast: (data: ToastMessage) => void;
}
export declare const useUiStore: import("zustand").UseBoundStore<import("zustand").StoreApi<BearState>>;
export {};
//# sourceMappingURL=index.d.ts.map