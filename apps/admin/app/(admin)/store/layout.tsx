"use client";

import useAdminUser from "../../../utils/use-admin-user";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useIsActiveStore } from "../../../utils/use-is-active-store";
import { useAdminRouter } from "../../../utils/use-admin-router";
import { replace } from "lodash";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const { data, isLoading } = useAdminUser();
  const router = useRouter();
  const { push, replace } = useAdminRouter();
  const isActiveStore = useIsActiveStore();
  const pathname = usePathname();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/login");
    } else if (
      isActiveStore === false &&
      !/store\/([^\/]+)\/subscribe\/billing/.test(pathname)
    ) {
      push("/subscribe");
    } else if (
      isActiveStore === true &&
      /store\/([^\/]+)\/subscribe/.test(pathname)
    ) {
      replace("/dashboard");
    }
  }, [data, isLoading, router.push, isActiveStore, replace]);

  if (data && !isLoading) {
    return children;
  }
  return (
    <div className="h-screen flex align-items-center  ">
      <ProgressSpinner className="flex align-items-center" />
    </div>
  );
}
