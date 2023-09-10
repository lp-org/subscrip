import { Metadata } from "next";

import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./../components/admin-layout/styles/layout.scss";

import Providers from "../utils/provider";
import Toast from "ui/Toast";
import "./../styles/index.scss";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href={`/themes/lara-light-purple/theme.css`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
export const metadata: Metadata = {
  title: {
    template: "%s | Subscrip",
    default: "Subscrip", // a default is required when creating a template
  },
};
