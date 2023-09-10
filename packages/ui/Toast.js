"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Toast as PrimeToast } from "primereact/toast";
import { useToast } from "./utils";
const Toast = () => {
    const toasts = useRef(null);
    const { toast } = useToast();
    useEffect(() => {
        if (toasts.current && toast)
            toasts.current.show(Object.assign(Object.assign({}, toast), { summary: toast.severity === "success" ? "Success" : "Something wrong", life: 3000 }));
    }, [toast]);
    return _jsx(PrimeToast, { ref: toasts, position: "bottom-right" });
};
export default Toast;
