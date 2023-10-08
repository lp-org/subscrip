import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRequest } from "./adminClient";
const useAdminUser = () => {
  const router = useRouter();
  const { adminClient } = useRequest();
  const data = useQuery({
    queryKey: ["me"],
    queryFn: adminClient.auth.getSession,
    onError: (err: any) => {
      if (err?.response?.status === 401) router.push("/login");
    },

    retry: false,
  });

  return data;
};

export default useAdminUser;
