import { AxiosRequestConfig } from "sdk";
import { cookies } from "next/headers";
import AdminApi from "sdk/src/api/admin-api";
import { client } from "sdk/src/client";
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
      headers: {
        storeId,
        Cookie: cookies().toString(),
      },
    };

    // return fetch(`${process.env.BACKEND_URL}/${path}`, {
    //   cache: "no-store",
    //   method,
    //   body: method !== "GET" ? JSON.stringify(payload) : undefined,
    //   headers: {
    //     storeId,
    //     Cookie: cookies().toString(),
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // });
    return client(options);
  };
};

export const serverApiRequest = (storeId?: string) => {
  return AdminApi(clientRequest({ storeId }));
};
