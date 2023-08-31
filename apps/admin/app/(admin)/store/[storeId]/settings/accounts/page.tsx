"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { SplitButton } from "primereact/splitbutton";
import React from "react";
import PageHeader from "ui/PageHeader";
import adminClient, { useRequest } from "../../../../../../utils/adminClient";

const UserAndPermission = () => {
  const { adminClient } = useRequest();

  const { data } = useQuery({
    queryFn: adminClient.user.get,
  });
  const users = data?.data;
  return (
    <div>
      <div className="flex align-items-center">
        <PageHeader
          title="Users & Permissions"
          subTitle="Manage what users can see or do in your store."
        />
      </div>
      <div className="flex align-items-center mb-4">
        <p className="font-bold">Staff</p>
        <div className="ml-auto">
          <Button>Add </Button>
        </div>
      </div>
      <DataTable value={users} tableStyle={{ minWidth: "50rem" }}>
        <Column field="email" header="Email"></Column>
        <Column field="name" header="Name"></Column>
        <Column
          align="right"
          body={
            <SplitButton
              label="View"
              onClick={console.log}
              model={[
                {
                  label: "Delete",
                  icon: "pi pi-trash",
                },
              ]}
            />
          }
          headerStyle={{ minWidth: "10rem" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default UserAndPermission;
