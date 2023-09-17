import { useQuery } from "@tanstack/react-query";
import { useRequest } from "../../../../utils/adminClient";

export const useStoreSetting = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: adminClient.store.setting,
    queryKey: ["storeSetting"],
  });
  return data?.data;
};
