"use client";
import React, { useState } from "react";
import { useRequest } from "../../utils/adminClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";

import { Toolbar } from "primereact/toolbar";
import { useAdminRouter } from "../../utils/use-admin-router";
import { DataTable } from "ui";
import { Image } from "primereact/image";
import { revalidateStorePath } from "../../utils/revalidateStore";
import { Badge } from "primereact/badge";
import { Chip } from "primereact/chip";

const RoomPage = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: () => adminClient.room.list({}),
    queryKey: ["roomList"],
  });
  const [selectedRooms, setSelectedRooms] = useState([]);
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
  const roomNameBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        {!!rowData.images.length && (
          <Image
            alt={"room image"}
            src={rowData.images[0]?.gallery?.url}
            width="32"
            height="28"
            imageClassName="border-round"
          />
        )}
        <span>{rowData.name}</span>
      </div>
    );
  };
  return (
    <Card title="Rooms" className="w-full">
      <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>
      <DataTable
        paginator
        rows={10}
        value={rooms}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="checkbox"
        selection={selectedRooms}
        onSelectionChange={(e) => {
          setSelectedRooms(e.value);
        }}
        onRowClick={(e) => {
          revalidateStorePath("/rooms/[id]");
          push(`/rooms/${e.data.id}`);
        }}
        rowClassName={"cursor-pointer"}
        rowHover
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>

        <Column field="name" header="Name" body={roomNameBodyTemplate}></Column>
        <Column
          field="published"
          header="Published"
          body={(rowData) => (
            <>
              {rowData.published ? (
                <>
                  <Chip label="Active" />
                </>
              ) : (
                <>
                  <Chip label="Draft" />
                </>
              )}
            </>
          )}
        ></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </Card>
  );
};

export default RoomPage;
