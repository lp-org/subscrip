import { useParams } from "next/navigation";
import { axiosClient } from "sdk";
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
    const options = {
      method,
      withCredentials: true,
      url: path,
      data: payload,
      headers: { storeId },
    };
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

export default AdminApi(clientRequest({}));
