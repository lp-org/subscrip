"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { LayoutProvider } from "admin-layout/context/layoutcontext";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <LayoutProvider>{children}</LayoutProvider>
    </QueryClientProvider>
  );
}

export default Providers;
