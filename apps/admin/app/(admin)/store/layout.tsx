"use client";

import useAdminUser from "../../../utils/use-admin-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const { data, isLoading } = useAdminUser();
  const router = useRouter();
  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, isLoading, router.push]);

  if (data && !isLoading) {
    return children;
  }
  return (
    <div className="h-screen flex align-items-center  ">
      <ProgressSpinner className="flex align-items-center" />
    </div>
  );
}
