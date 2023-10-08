import { AxiosRequestConfig } from "sdk";
import { cookies } from "next/headers";

import { client } from "sdk/src/client";
import StoreFrontApi from "sdk/src/api/storefront-api";
type ClientRequest = {
  site?: string;
};

export const clientRequest = ({ site }: ClientRequest) => {
  return (method: string, path = "", payload = {}) => {
    const options: AxiosRequestConfig = {
      method,
      withCredentials: true,

      url: path,
      data: payload,
      headers: {
        site,
        Cookie: cookies().toString(),
      },
    };

    // return fetch(`${process.env.BACKEND_URL}/${path}`, {
    //   cache: "no-store",
    //   method,
    //   body: method !== "GET" ? JSON.stringify(payload) : undefined,
    //   headers: {
    //     site,
    //     Cookie: cookies().toString(),
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // });
    return client(options);
  };
};

export const serverApiRequest = (site?: string) => {
  return StoreFrontApi(clientRequest({ site }));
};
