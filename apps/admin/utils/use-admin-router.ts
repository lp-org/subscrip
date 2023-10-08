import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

export const useAdminRouter = () => {
  const params = useParams();

  const router = useRouter();

  const push = useCallback(
    (url: string) => {
      router.push(`/store/${params.storeId}/${url}`);
    },
    [params.storeId]
  );
  const replace = useCallback(
    (url: string) => {
      router.replace(`/store/${params.storeId}/${url}`);
    },
    [params.storeId]
  );
  return { push, replace };
};
