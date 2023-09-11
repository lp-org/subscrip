"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useAdminRouter } from "../../utils/use-admin-router";

const BookingPage = () => {
  const { push } = useAdminRouter();
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
    </Card>
  );
};

export default BookingPage;
