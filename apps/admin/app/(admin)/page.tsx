"use client";
import Layout from "admin-layout";
import useAdminUser from "../../utils/use-admin-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function MainPage({ children }: RootLayoutProps) {
  const { data, isLoading } = useAdminUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/login");
    } else if (pathname === "/") {
      router.push("/store");
    }
  }, [data?.data, isLoading, router.push]);

  return (
    <div className="h-screen flex align-items-center  ">
      <ProgressSpinner className="flex align-items-center" />
    </div>
  );
}
