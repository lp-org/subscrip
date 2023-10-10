// import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "@radix-ui/themes/styles.css";

// import "nprogress/nprogress.css";
import { Inter } from "next/font/google";

import { Suspense } from "react";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          {children}
          {/* <Toaster /> */}
        </Theme>
      </body>
    </html>
  );
}
