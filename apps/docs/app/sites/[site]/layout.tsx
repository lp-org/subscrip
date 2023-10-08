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
  // const data = {
  //   id: 1,
  //   name: "a",
  //   email: "mmmz",
  //   logo: null,
  //   favicon: null,
  //   ogimage: null,
  //   phone: "012312312",
  //   address: "12, Old Town, East Side of Koh Lanta. Krabi Province, Thailand",
  //   facebook: "https://facebook.com/facebook",
  //   instagram: "https://facebook.com/facebook",
  //   currency: null,
  //   slider: [
  //     {
  //       url: "jhgkgk",
  //       image: "/uploads/borabora2.jpg-pQUTA.jpeg",
  //       is_active: true,
  //       open_new: true,
  //     },
  //     {
  //       url: "",
  //       image: "/uploads/borabora1.jpg-BwCoU.jpeg",
  //       is_active: true,
  //       open_new: true,
  //     },
  //   ],
  //   createdAt: "2023-06-12T16:45:26.709Z",
  //   updatedAt: "2023-06-12T16:45:26.709Z",
  // };
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
    title: { template: `%s | ${params.site}`, default: store?.name },
    description: `Description`,
    openGraph: {
      images: store.ogimage || "/",
    },
    icons: { icon: store.favicon || "/favicon.ico" },
  };
}
export default FrontStoreLayout;
