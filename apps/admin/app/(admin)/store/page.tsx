"use client";
import { useQuery } from "@tanstack/react-query";

import { Card } from "primereact/card";
import React, { useEffect } from "react";
import AdminApi from "sdk/src/api/admin-api";

const Store = () => {
  const { data } = useQuery({
    queryFn: AdminApi.store.list,
  });
  const stores = data?.data;

  return (
    <div className="main-layout">
      <div className="main-container">
        <Card title="Create store" className="w-full">
          <p className=""></p>
        </Card>
      </div>
    </div>
  );
};

export default Store;
