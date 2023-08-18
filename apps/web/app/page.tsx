"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import AdminApi from "sdk/src/api/admin-api";

const Page = () => {
  useQuery({
    queryFn: AdminApi.user.get,
  });

  return <div>Page</div>;
};

export default Page;
