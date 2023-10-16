"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRequest } from "../../utils/adminClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import { useAdminRouter } from "../../utils/use-admin-router";
import { Column, DataTable } from "ui";
import { Image } from "primereact/image";
import { revalidateStorePath } from "../../utils/revalidateStore";

import { Chip } from "primereact/chip";

import { usePageConfig } from "../../utils/use-page-config";
import { DataTablePageEvent } from "primereact/datatable";
import { useAdminPersistStore } from "../../store/use-admin-persist-store";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const RoomPage = () => {
  const { adminClient } = useRequest();
  const [statuses] = useState(["published", "draft"]);
  const [pageConfig, setPageConfig] = useState<DataTablePageEvent>({
    first: 0,
    rows: 10,
    page: 0,
    pageCount: 1,
  });
  const [customFilter, setCustomFilter] = useState({});
  const filter = useAdminPersistStore((state) => state.tableFilter.booking);
  const setFilter = useAdminPersistStore((state) => state.setTableFilter);
  console.log(customFilter);
  const { data, refetch } = useQuery({
    queryFn: () => {
      return adminClient.room.list({ ...filter, ...customFilter });
    },
    queryKey: ["roomList", { ...filter, ...customFilter }],
  });

  const [selectedRooms, setSelectedRooms] = useState([]);
  const rooms = data?.data.room;

  const { push } = useAdminRouter();
  const tableHeader = () => {
    return (
      <React.Fragment>
        <div className="flex">
          <Filters onSave={setCustomFilter} />
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

interface FilterFormType {
  collection_id: string[] | string;
}
interface FiltersType {
  onSave: (e: FilterFormType) => void;
  onClear?: () => void;
}

const Filters = ({ onSave, onClear }: FiltersType) => {
  const { adminClient } = useRequest();
  const { data: collectionData } = useQuery({
    queryFn: () => {
      return adminClient.collection.list({});
    },
    queryKey: ["collectionList"],
  });
  const collectios = collectionData?.data.collection;

  const { register, control, handleSubmit } = useForm<FilterFormType>({});
  const onSubmit: SubmitHandler<FilterFormType> = (data) => {
    onSave({
      collection_id: data.collection_id.join(","),
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4">
        <Controller
          control={control}
          name="collection_id"
          render={({ field }) => (
            <MultiSelect
              options={collectios}
              optionLabel="name"
              optionValue="id"
              placeholder="Collections"
              maxSelectedLabels={2}
              className="w-full md:w-20rem"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        ></Controller>

        <Button>Apply</Button>
      </div>
    </form>
  );
};
