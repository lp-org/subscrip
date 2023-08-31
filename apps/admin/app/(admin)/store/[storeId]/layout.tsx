"use client";

import useAdminUser from "../../../../utils/use-admin-user";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import Layout from "../../../../components/admin-layout";
import { useAdminStore } from "../../../../store/use-admin-store";
import Error from "next/error";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const { data, isLoading } = useAdminUser();
  const params = useParams();
  const storeId = params.storeId;
  const setSelectedStore = useAdminStore((state) => state.setSelectedStore);
  const router = useRouter();

  setSelectedStore(storeId as string);
  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/login");
    }
  }, [data?.data, isLoading, router.push]);

  if (!data.data?.store?.id && !isLoading) {
    return <Error statusCode={404} title="Store not found" />;
  }
  if (data && !isLoading) {
    return <Layout>{children}</Layout>;
  }
  return (
    <div className="h-screen flex align-items-center  ">
      <ProgressSpinner className="flex align-items-center" />
    </div>
  );
}
