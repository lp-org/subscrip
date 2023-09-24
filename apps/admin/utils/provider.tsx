"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { LayoutProvider } from "../components/admin-layout/context/layoutcontext";
import { PrimeReactProvider } from "primereact/api";
import { DropzoneProvider } from "ui";
import { ConfirmDialog } from "primereact/confirmdialog";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <PrimeReactProvider>
        <LayoutProvider>
          {/* <DropzoneProvider> */}
          {children}
          {/* </DropzoneProvider> */}
          <ConfirmDialog />
        </LayoutProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default Providers;
