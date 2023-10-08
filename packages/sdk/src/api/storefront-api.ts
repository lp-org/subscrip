import { AxiosResponse } from "axios";
import { User } from "db";
import clientRequest from "../client";
import StoreService from "server/src/services/StoreService";

// @ts-ignore
type AxiosReturn<T> = Promise<AxiosResponse<Awaited<ReturnType<T>>>>;

const StoreFrontApi = (request: typeof clientRequest) => {
  return {
    store: {
      get(site: string): Promise<AxiosResponse<any>> {
        return request("GET", `store/store/${site}`);
      },
      getSetting(id: string): AxiosReturn<StoreService["getStoreSetting"]> {
        return request("GET", `store/store/setting/${id}`);
      },
    },
  };
};

export default StoreFrontApi;
