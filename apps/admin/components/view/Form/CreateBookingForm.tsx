"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { useRequest } from "../../../utils/adminClient";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";
import FormToolbar from "ui/FormToolbar";

const CreateBookingForm = () => {
  const [dates, setDates] = useState(null);
  const { adminClient } = useRequest();
  const [roomOptions, setRoomOptions] = useState<any>();
  const [value, setValue] = useState();
  const { mutate } = useMutation({
    mutationFn: adminClient.room.list,
    onSuccess: (res) => {
      const list = res.data?.room.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      setRoomOptions(list);
    },
  });
  const { mutate: mutateBooking } = useMutation({
    mutationFn: adminClient.booking.create,
  });
  type BookingCreateType = Parameters<typeof adminClient.booking.create>;
  const form = useForm<BookingCreateType[0]>({
    defaultValues: {
      checkInDate: "",
      checkOutDate: "",
      roomId: "",
    },
  });
  return (
    <form>
      <FormToolbar />
      <Card className="w-full">
        <div className="formgrid grid ">
          <div className="col-12 md:col-6 field flex flex-column ">
            <label>Room</label>
            <Controller
              name="roomId"
              control={form.control}
              render={({ field }) => (
                <AutoComplete
                  forceSelection
                  dropdown
                  suggestions={roomOptions}
                  field="label"
                  completeMethod={(e) => {
                    mutate(e.query && { q: e.query });
                  }}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
          </div>
          <div className="col-12 md:col-6  field flex flex-column ">
            <label>Check-In & Check-Out Date</label>
            <Calendar
              selectionMode="range"
              value={dates}
              onChange={(e) => setDates(e.value)}
              readOnlyInput
            />
          </div>
          <div className="col-12 md:col-6 field flex flex-row align-items-center gap-4">
            <div className="flex field flex-column lg:w-6">
              <label>Price</label>
              <InputNumber currency="USD" mode="currency" />
            </div>
            <div className="flex field mt-4">
              <Checkbox checked />
              <label className="ml-2">Custom price</label>
            </div>
          </div>

          <div className="col-12 md:col-6 field flex flex-column ">
            <label>Payment Status</label>
            <Dropdown
              options={[
                {
                  value: "not_paid",
                  label: "Not paid",
                },
                {
                  value: "paid",
                  label: "Paid",
                },
              ]}
            />
          </div>
        </div>
      </Card>
    </form>
  );
};

export default CreateBookingForm;
