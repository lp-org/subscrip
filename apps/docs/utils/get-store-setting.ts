import { serverApiRequest } from "./server-client-request";
import { cache } from "react";
export const getStoreSetting = cache(async (params: any) => {
  const req = serverApiRequest(params.site);

  const data = await req.store.getSetting(params.site);

  const store = data.data;
  return store;
});
