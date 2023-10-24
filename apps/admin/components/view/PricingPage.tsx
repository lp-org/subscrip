"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { DataTable } from "ui";
import { useAdminRouter } from "../../utils/use-admin-router";

const PricingPage = () => {
  const { push } = useAdminRouter();
  const tableHeader = () => {
    return (
      <React.Fragment>
        <div className="flex">
          {/* <Filters onSave={setCustomFilter} /> */}
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className="ml-auto"
            onClick={() => push("/pricings/add")}
          />
        </div>
      </React.Fragment>
    );
  };
  return (
    <Card title="Pricings" className="w-full">
      <DataTable
        header={tableHeader}
        paginator
        // rows={filter?.rows || 10}
        // value={rooms}
        // tableStyle={{ minWidth: "50rem" }}
        // selectionMode="checkbox"
        // selection={selectedRooms}
        // totalRecords={data?.data.count}
      ></DataTable>
    </Card>
  );
};

export default PricingPage;
