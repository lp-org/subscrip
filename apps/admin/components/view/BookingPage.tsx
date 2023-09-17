"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useAdminRouter } from "../../utils/use-admin-router";
import { DataTable } from "primereact/datatable";
import { useRequest } from "../../utils/adminClient";
import { useQuery } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { formatDate } from "ui";

const BookingPage = () => {
  const { push } = useAdminRouter();
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: () => adminClient.booking.list({}),
    queryKey: ["bookingList"],
  });
  const bookings = data?.data.booking;
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Create Booking"
            icon="pi pi-plus"
            severity="success"
            className=" mr-2"
            onClick={() => push("/bookings/add")}
          />
        </div>
      </React.Fragment>
    );
  };
  return (
    <Card title="Bookings" className="w-full">
      <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>
      <DataTable value={bookings}>
        <Column field="bookingNo" header="Booking No"></Column>
        <Column field="customerEmail" header="Customer"></Column>
        <Column
          header="Check-In & Check-out Date"
          body={(booking) => (
            <>
              {formatDate(booking.checkInDate)} -{" "}
              {formatDate(booking.checkOutDate)}{" "}
            </>
          )}
        ></Column>
      </DataTable>
    </Card>
  );
};

export default BookingPage;
