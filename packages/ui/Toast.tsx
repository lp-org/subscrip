"use client";
import { useEffect, useRef } from "react";
import { Toast as PrimeToast } from "primereact/toast";
import { useToast } from "./utils";

const Toast = () => {
  const toasts = useRef<PrimeToast>(null);
  const { toast } = useToast();
  console.log(toast);
  useEffect(() => {
    if (toasts.current && toast)
      toasts.current.show({
        ...toast,
        summary: toast.severity === "success" ? "Success" : "Something wrong",
        life: 3000,
      });
  }, [toast]);

  return (
    <>
      <PrimeToast ref={toasts} position="bottom-right" />
    </>
  );
};

export default Toast;
