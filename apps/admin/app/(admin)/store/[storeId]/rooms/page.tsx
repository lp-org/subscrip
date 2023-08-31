"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useAdminRouter } from "../../../../../utils/use-admin-router";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "../../../../../utils/adminClient";

const Rooms = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: adminClient.room.list,
    queryKey: ["room"],
  });
  const rooms = data?.data.room;
  const { push } = useAdminRouter();
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className=" mr-2"
            onClick={() => push("/rooms/add")}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <Card title="Rooms">
          <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>
          <DataTable value={rooms} tableStyle={{ minWidth: "50rem" }}>
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default Rooms;
