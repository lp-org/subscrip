import { useUiStore } from "../store";
export function useToast() {
    const toast = useUiStore((state) => state.toast);
    const showToast = useUiStore((state) => state.setToast);
    return { toast, showToast };
}
