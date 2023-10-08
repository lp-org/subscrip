import { useMemo } from "react";
import useAdminUser from "./use-admin-user";

export const useIsActiveStore = () => {
  const me = useAdminUser();

  return useMemo(() => {
    const store = me.data?.data?.store;
    if (store) {
      if (
        store?.planStatus === "active" ||
        store?.planStatus === "trialing" ||
        store?.planStatus === "past_due"
      ) {
        return true;
      } else {
        return false;
      }
    }

    return undefined;
  }, [me.data?.data?.store]);
};
