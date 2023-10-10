import { NextRequest, NextResponse } from "next/server";
import { getHostnameDataOrDefault } from "./lib/db";
import { serverApiRequest } from "./utils/server-client-request";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_assets|favicon.ico).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get("host");

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "subdomain-3.localhost:3000", "localhost:3000" is the root URL)
  // process.env.NODE_ENV === "production" indicates that the app is deployed to a production environment
  // process.env.VERCEL === "1" indicates that the app is deployed on Vercel
  // const currentHost =
  //   process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
  //     ? hostname.replace(`.subscrip.store`, "")
  //     : hostname.replace(`.localhost`, "");

  const currentHost = hostname?.replace(
    process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN,
    ""
  );
  // console.log('URL 2', req.nextUrl.href)
  // rewrite to the current subdomain under the pages/sites folder

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/store/${currentHost}`
  );

  // const data = await api.store.get(currentHost);
  if (response.ok) {
    const storeJson = await response.json();
    const store = storeJson.store;
    if (url.pathname.startsWith(`/sites`) || !store) {
      url.pathname = `/404`;
    } else {
      // rewrite to the current subdomain under the pages/sites folder
      url.pathname = `/sites/${store.id}${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }
}
