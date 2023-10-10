// import { getCacheSetting } from "@/server/cache.ts";

import { Metadata } from "next";

import React from "react";
import Footer from "../../../components/frontstore/Footer";
import Navbar from "../../../components/frontstore/Navbar";
import { serverApiRequest } from "../../../utils/server-client-request";

async function getData(params: any) {
  const req = serverApiRequest(params.site);

  const data = await req.store.getSetting(params.site);

  const store = data.data;
  return store;
}

const FrontStoreLayout = async ({ children, params }) => {
  const data = await getData(params);

  return (
    <div className="h-screen font-serif">
      <div className="flex h-full flex-col">
        <div className="flex-none">
          <Navbar data={data} />
        </div>

        <div className="grow"> {children}</div>

        <div className="flex-none">
          <Footer data={data} />
        </div>
      </div>
    </div>
  );
};
export async function generateMetadata({ params }): Promise<Metadata> {
  const store = await getData(params);
  return {
    title: { template: `%s | ${store.name}`, default: store?.name },
    description: `Description`,
    openGraph: {
      images: store.ogimage || "/",
    },
    icons: { icon: store.favicon || "/favicon.ico" },
  };
}
export default FrontStoreLayout;
