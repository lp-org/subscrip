"use client";
import { Card } from "primereact/card";
import React, { useState } from "react";
import { Column, DataTable } from "ui";
import { useAdminRouter } from "../../utils/use-admin-router";
import { filter } from "lodash";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { revalidateStorePath } from "../../utils/revalidateStore";
import { useAdminPersistStore } from "../../store/use-admin-persist-store";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "../../utils/adminClient";

const CollectionPage = () => {
  const { push } = useAdminRouter();
  const { adminClient } = useRequest();

  const filter = useAdminPersistStore((state) => state.tableFilter.collection);
  const setFilter = useAdminPersistStore((state) => state.setTableFilter);
  const { data } = useQuery({
    queryFn: () => adminClient.collection.list(filter),
    queryKey: ["collectionList", filter],
  });
  const [selectedCollection, setSelectedCollection] = useState([]);
  const collections = data?.data?.collection;
  const tableHeader = () => {
    return (
      <React.Fragment>
        <div className="flex">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className="ml-auto"
            onClick={() => push("/collections/add")}
          />
        </div>
      </React.Fragment>
    );
  };
  return (
    <Card title="CollectionPage">
      <DataTable
        header={tableHeader}
        paginator
        rows={filter?.rows || 10}
        value={collections}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="checkbox"
        selection={selectedCollection}
        totalRecords={data?.data.count}
        // onPage={setPageConfig}

        onPage={(e) => {
          setFilter("collection", e);
        }}
        filters={filter?.filters}
        first={filter?.first || 0}
        onFilter={(e) => {
          setFilter("collection", e);
        }}
        lazy
        onSelectionChange={(e) => {
          setSelectedCollection(e.value);
        }}
        onRowClick={(e) => {
          revalidateStorePath("/collections/[id]");
          push(`/collections/${e.data.id}`);
        }}
        rowClassName={"cursor-pointer"}
        rowHover
      >
        <Column
          field=""
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>

        <Column field="name" header="Name" filter></Column>

        <Column
          field="room_count"
          header="Room count"
          body={(row) => <>{row.rooms.length}</>}
        ></Column>

        <Column
          field="status"
          header="Status"
          filter
          filterField="status"
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={["published", "draft"]}
              onChange={(e) => {
                options.filterCallback(e.value, options.index);
              }}
              placeholder="Select One"
              className="p-column-filter"
              showClear
            />
          )}
        ></Column>
      </DataTable>
    </Card>
  );
};

export default CollectionPage;
