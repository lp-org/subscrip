"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRequest } from "../../utils/adminClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import { Toolbar } from "primereact/toolbar";
import { useAdminRouter } from "../../utils/use-admin-router";
import { Column, DataTable } from "ui";
import { Image } from "primereact/image";
import { revalidateStorePath } from "../../utils/revalidateStore";

import { Chip } from "primereact/chip";

import { usePageConfig } from "../../utils/use-page-config";
import { DataTablePageEvent } from "primereact/datatable";
import { useRouter } from "next/navigation";
import { useAdminPersistStore } from "../../store/use-admin-persist-store";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";

const RoomPage = () => {
  const { adminClient } = useRequest();
  const [statuses] = useState(["published", "draft"]);
  const [pageConfig, setPageConfig] = useState<DataTablePageEvent>({
    first: 0,
    rows: 10,
    page: 0,
    pageCount: 1,
  });

  const [p] = usePageConfig();
  const filter = useAdminPersistStore((state) => state.tableFilter.booking);

  const setFilter = useAdminPersistStore((state) => state.setTableFilter);
  const pageOptions = useMemo(() => {
    const page = filter?.page || 0;
    const offset = page * (filter?.rows || 10);
    const limit = filter?.rows || 10;
    return { offset, limit };
  }, [filter]);

  const { data, refetch } = useQuery({
    queryFn: () => {
      return adminClient.room.list({ pageOptions, ...filter });
    },
    queryKey: ["roomList", { ...pageOptions, filter }],
  });
  const [selectedRooms, setSelectedRooms] = useState([]);
  const rooms = data?.data.room;

  const { push } = useAdminRouter();
  const tableHeader = () => {
    return (
      <React.Fragment>
        <div className="flex">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className="ml-auto"
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
            src={rowData.images[0]?.url}
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
      <DataTable
        header={tableHeader}
        paginator
        rows={filter?.rows || 10}
        value={rooms}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="checkbox"
        selection={selectedRooms}
        totalRecords={data?.data.count}
        // onPage={setPageConfig}

        onPage={(e) => {
          setFilter("booking", e);
        }}
        filters={filter?.filters}
        first={filter?.first || 0}
        onFilter={(e) => {
          setFilter("booking", e);
        }}
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
          field=""
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
          field="status"
          header="Status"
          filter
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={statuses}
              onChange={(e) => {
                options.filterCallback(e.value, options.index);
              }}
              placeholder="Select One"
              className="p-column-filter"
              showClear
            />
          )}
          body={(rowData) => <Chip label={rowData.status} />}
        ></Column>
        <Column
          field="quantity"
          header="Quantity"
          dataType="numeric"
          filter
          filterElement={(options) => (
            <InputNumber
              value={options.value}
              onChange={(e) => options.filterCallback(e.value, options.index)}
            />
          )}
        ></Column>
      </DataTable>
    </Card>
  );
};

export default RoomPage;
