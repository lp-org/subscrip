"use client";
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, isLoading, router.push]);

  return (
    <div className="h-screen flex align-items-center  ">
      <ProgressSpinner className="flex align-items-center" />
    </div>
  );
}
