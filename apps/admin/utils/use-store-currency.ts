import useAdminUser from "./use-admin-user";

export const useStoreCurrency = () => {
  const { data } = useAdminUser();
  const currency = data?.data?.store.currency;
  return currency;
};
