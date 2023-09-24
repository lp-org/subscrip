"use client";
import { useMutation } from "@tanstack/react-query";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useMemo, useState } from "react";
import { useRequest } from "../../../utils/adminClient";
import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import FormToolbar from "ui/FormToolbar";
import dayjs from "dayjs";
import CurrencyInput from "ui/Input/CurrencyInput";
import { formatPrice, useToast } from "ui";
import { Panel } from "primereact/panel";

import { zodResolver } from "@hookform/resolvers/zod";

import InputError from "ui/InputError";
import { PlusIcon } from "lucide-react";
import { Dialog } from "primereact/dialog";
import CreateCustomerForm from "./CreateCustomerForm";
import { createBookingDTO } from "utils-data";

const CreateBookingForm = () => {
  const [dates, setDates] = useState(null);
  const { adminClient } = useRequest();
  const [roomOptions, setRoomOptions] = useState<any>();
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<any>();
  const [room, setRoom] = useState();
  const [customer, setCustomer] = useState();
  const [viewDate, setViewDate] = useState<any>();
  const [bookingPrice, setBookingPrice] = useState<any>();
  const [disabledDate, setDisabledDate] = useState<Date[]>([]);
  const [customerDialogVisible, setCustomerDialogVisible] = useState(false);
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
  const { showToast } = useToast();
  type BookingCreateType = Parameters<typeof adminClient.booking.create>;
  const form = useForm<BookingCreateType[0]>({
    defaultValues: {
      checkInDate: "",
      checkOutDate: "",
      roomId: "",
      paymentStatus: "",
      totalAmount: null,
      customerId: "",
    },
    resolver: zodResolver(createBookingDTO),
  });
  const { mutate: mutateBooking } = useMutation({
    mutationFn: adminClient.booking.create,
    onSuccess: () => {
      showToast({ severity: "success", detail: "Create Booking Successful" });
    },
  });
  const { mutate: mutateDisabledBookingDate } = useMutation({
    mutationFn: adminClient.booking.getDisabledBookingDate,
    onSuccess: (res) =>
      setDisabledDate(res.data.map((el) => dayjs(el).toDate())),
  });

  const { mutate: mutateBookingPrice } = useMutation({
    mutationFn: adminClient.booking.getRoomBookingPrice,
    onSuccess: (res) => {
      form.setValue("totalAmount", res.data.totalPrice);
      setBookingPrice(res.data);
    },
  });

  const { mutate: customerListMutate } = useMutation({
    mutationFn: adminClient.customer.list,
    onSuccess: (res) => {
      const list = res.data?.customer.map((el) => ({
        label: el.email,
        value: el.id,
      }));
      setCustomerOptions([
        ...list,
        {
          label: (
            <div className="flex align-items-center gap-2">
              <PlusIcon size={18} />
              Add Customer
            </div>
          ),
          value: "",
        },
      ]);
    },
  });

  const onSubmit: SubmitHandler<BookingCreateType[0]> = (data) => {
    mutateBooking(data);
  };
  console.log(form.formState.errors);
  const formData = useWatch({ control: form.control });
  const days = useMemo(() => {
    if (formData.checkOutDate && formData.checkInDate)
      return dayjs(formData.checkOutDate).diff(formData.checkInDate, "days");
    return null;
  }, [formData.checkOutDate, formData.checkInDate]);

  useEffect(() => {
    const startDate = dayjs(viewDate || dayjs()).format("YYYY-MM-DD");
    const endDate = dayjs(viewDate || dayjs())
      .add(1, "month")
      .format("YYYY-MM-DD");
    if (formData.roomId) {
      mutateDisabledBookingDate({
        roomId: formData.roomId,
        startDate,
        endDate,
      });

      if (formData.checkInDate && formData.checkOutDate) {
        mutateBookingPrice({
          roomId: formData.roomId,
          startDate: formData.checkInDate,
          endDate: formData.checkOutDate,
        });
      }
    }
  }, [
    mutateDisabledBookingDate,
    viewDate,
    formData.roomId,
    formData.checkInDate,
    formData.checkOutDate,
  ]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormToolbar />
      <div className="grid gridform mt-4">
        <div className="col-12 md:col-8">
          <Card className="w-full">
            <Panel className="formgrid  w-full" header="Booking Information">
              <div className="grid">
                <div className="col-12 field flex flex-column ">
                  <label>Room</label>
                  <Controller
                    name="roomId"
                    control={form.control}
                    render={({ field, formState }) => (
                      <>
                        <AutoComplete
                          forceSelection
                          dropdown
                          suggestions={roomOptions}
                          field="label"
                          completeMethod={(e) => {
                            mutate(e.query && { q: e.query });
                          }}
                          value={room}
                          onChange={(e) => {
                            setRoom(e.value);
                            field.onChange(e.value?.value);
                          }}
                          showEmptyMessage
                        />
                        <InputError errors={formState.errors} name="roomId" />
                      </>
                    )}
                  />
                </div>
                <div className="col-12  field flex flex-column gap-x-4">
                  <label>Check-In & Check-Out Date</label>
                  <Calendar
                    disabled={!formData.roomId}
                    selectionMode="range"
                    value={dates}
                    dateFormat={"dd/mm/yy"}
                    viewDate={viewDate}
                    monthNavigator
                    disabledDates={disabledDate}
                    onViewDateChange={(e) => setViewDate(e?.value)}
                    onChange={(e) => {
                      setDates(e.value);
                      if (Array.isArray(e.value) && e.value.length == 2) {
                        form.setValue(
                          "checkInDate",
                          dayjs(e.value[0]).format("YYYY-MM-DD")
                        );

                        form.setValue(
                          "checkOutDate",
                          e.value[1]
                            ? dayjs(e.value[1]).format("YYYY-MM-DD")
                            : ""
                        );
                      }
                    }}
                    readOnlyInput
                  />
                  <InputError
                    errors={form.formState.errors}
                    name="checkInDate"
                  />
                  <InputError
                    errors={form.formState.errors}
                    name="checkOutDate"
                  />
                </div>
                <div className="col-12 field flex flex-row align-items-center gap-4">
                  <div className="flex field flex-column lg:w-6">
                    <label>Price</label>
                    <Controller
                      name="totalAmount"
                      control={form.control}
                      render={({ field }) => (
                        <CurrencyInput
                          currency="USD"
                          mode="currency"
                          handleamountchange={(e) => field.onChange(e)}
                          value={field.value}
                          disabled={!isCustomPrice}
                        />
                      )}
                    />
                  </div>
                  <div className="flex field mt-4">
                    <Checkbox
                      checked={isCustomPrice}
                      onChange={(e) => setIsCustomPrice(e.checked)}
                    />
                    <label className="ml-2">Custom price</label>
                  </div>
                </div>
                <div className="col-12 field flex flex-column ">
                  <label>Payment Status</label>
                  <Controller
                    name="paymentStatus"
                    control={form.control}
                    render={({ field }) => (
                      <Dropdown
                        onChange={(e) => field.onChange(e.value)}
                        value={field.value}
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
                    )}
                  />
                </div>
              </div>
            </Panel>

            <Panel className=" w-full  mt-4" header="Customer Information">
              <div className="grid">
                <div className="col-12 field flex flex-column ">
                  <label>Customer Email</label>
                  <Controller
                    name="customerId"
                    control={form.control}
                    render={({ field, formState }) => (
                      <>
                        <AutoComplete
                          inputStyle={{ width: "100%" }}
                          field="label"
                          suggestions={customerOptions}
                          completeMethod={(e) => {
                            customerListMutate(e.query && { q: e.query });
                          }}
                          value={customer}
                          onChange={(e) => {
                            if (e.value?.value === "") {
                              setCustomerDialogVisible(true);
                            } else {
                              setCustomer(e.value);
                              field.onChange(e.value?.value);
                            }
                          }}
                          forceSelection
                          showEmptyMessage
                        />
                        <InputError
                          errors={formState.errors}
                          name="customerId"
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </Panel>
          </Card>
        </div>

        <div className="col-12 md:col-4">
          {" "}
          <Card className="w-full " title="Summary">
            <div className="flex mt-2">
              <div>Selected Room: </div>
              <div className="ml-auto font-bold">{room?.label}</div>
            </div>
            <div className="flex mt-2">
              <div>Price per Night: </div>
              <div className="ml-auto font-bold"> MYR 20</div>
            </div>
            <div className="flex flex-wrap mt-2">
              <div>Check-in & Check-out Dates: </div>
              <div className="ml-auto font-bold">
                {" "}
                {formData.checkInDate
                  ? dayjs(formData.checkInDate).format("D/M/YY")
                  : ""}{" "}
                -
                {formData.checkOutDate
                  ? dayjs(formData.checkOutDate).format("D/M/YY")
                  : ""}{" "}
              </div>
            </div>
            <div className="flex mt-2">
              <div>Total Price: </div>
              <div className="ml-auto font-bold">
                {formatPrice(bookingPrice?.totalPrice)}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        header="Create New Customer"
        visible={customerDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setCustomerDialogVisible(false)}
      >
        <CreateCustomerForm onSave={() => setCustomerDialogVisible(false)} />
      </Dialog>
    </form>
  );
};

export default CreateBookingForm;
