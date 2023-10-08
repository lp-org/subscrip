import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const usePageConfig = () => {
  const params = useSearchParams();
  const first = parseInt(params.get("first") || "0");
  const rows = parseInt(params.get("rows") || "10");
  const page = parseInt(params.get("page") || "0");
  const pageCount = parseInt(params.get("pageCount") || "1");

  // const router = useRouter();

  return [{ first, rows, page, pageCount }];
};
