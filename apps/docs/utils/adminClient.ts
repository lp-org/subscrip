import { useParams } from "next/navigation";
import { AxiosRequestConfig } from "sdk";
import AdminApi from "sdk/src/api/admin-api";
import { useMemo } from "react";
import requestClient from "./request-client";

type ClientRequest = {
  storeId?: string;
};

export const clientRequest = ({ storeId }: ClientRequest) => {
  return (method: string, path = "", payload = {}) => {
    const options: AxiosRequestConfig = {
      method,
      withCredentials: true,
      url: path,
      data: payload,
      headers: { storeId },
    };
    options.params = method === "GET" && payload;

    return requestClient(options);
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
