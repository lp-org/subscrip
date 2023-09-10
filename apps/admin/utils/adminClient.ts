import { useParams } from "next/navigation";
import { AxiosRequestConfig, axiosClient } from "sdk";
import AdminApi from "sdk/src/api/admin-api";
import { useMemo } from "react";

const request = axiosClient({
  baseURL: process.env.BACKEND_URL || "http://localhost:5000",
});

type ClientRequest = {
  storeId?: string;
};

const clientRequest = ({ storeId }: ClientRequest | undefined) => {
  return (method: string, path = "", payload = {}) => {
    const options: AxiosRequestConfig = {
      method,
      withCredentials: true,
      url: path,
      data: payload,
      headers: { storeId },
    };
    options.params = method === "GET" && payload;

    return request(options);
  };
};

export const useRequest = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const adminClient = useMemo(() => {
    return AdminApi(clientRequest({ storeId }));
  }, [storeId]);
  return { adminClient };
};
