"use client";
import React, { useEffect, useMemo, useState } from "react";
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

import { Chip } from "primereact/chip";

import { usePageConfig } from "../../utils/use-page-config";
import { DataTablePageEvent } from "primereact/datatable";
import { useRouter } from "next/navigation";

const RoomPage = () => {
  const { adminClient } = useRequest();
  const [pageConfig, setPageConfig] = useState<DataTablePageEvent>({
    first: 0,
    rows: 10,
    page: 0,
    pageCount: 1,
  });
  // const [pageConfig, setPageConfig] = usePageConfig();
  const router = useRouter();
  // console.log(pageConfig);
  const [p] = usePageConfig();

  const pageOptions = useMemo(() => {
    const page = p?.page;
    const offset = page * p?.rows;
    const limit = p?.rows || 10;
    return { offset, limit };
  }, [p]);

  const { data, refetch } = useQuery({
    queryFn: () => {
      return adminClient.room.list(pageOptions);
    },
    queryKey: ["roomList", pageOptions],
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

  useEffect(() => {
    refetch();
  }, [pageConfig]);
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
        rowsPerPageOptions={[2, 10, 25, 50]}
        rows={p.rows}
        value={rooms}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="checkbox"
        selection={selectedRooms}
        totalRecords={data?.data.count}
        // onPage={setPageConfig}
        onPage={(e) => {
          const { first, rows, page, pageCount, filters } = e;
          router.replace(
            `?${new URLSearchParams({
              ...e,
            })}`
          );
        }}
        first={p.first}
        onFilter={(e) =>
          router.replace(
            `?${new URLSearchParams({
              ...e,
            })}`
          )
        }
        lazy
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

        <Column
          field="name"
          header="Name"
          body={roomNameBodyTemplate}
          filter
        ></Column>
        <Column
          field="published"
          header="Published"
          filter
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
