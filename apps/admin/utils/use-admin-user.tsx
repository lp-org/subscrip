import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import AdminApi from "sdk/src/api/admin-api";
const useAdminUser = () => {
  const router = useRouter();
  const data = useQuery({
    queryKey: ["me"],
    queryFn: AdminApi.auth.getSession,
    onError() {
      router.push("/login");
    },
    retry: false,
  });

  return data;
};

export default useAdminUser;
