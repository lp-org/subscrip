"use client";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@tanstack/react-query";
import { NewRoom } from "db";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputError from "ui/InputError";
import { useRequest } from "../../../../../../utils/adminClient";
import CurrencyInput from "ui/Input/CurrencyInput";
import FormToolbar from "ui/FormToolbar";
import { useToast } from "ui";

const AddRoomPage = () => {
  const { adminClient } = useRequest();
  const { showToast } = useToast();
  const { mutate } = useMutation({
    mutationFn: adminClient.room.create,
    onSuccess: (res) => {
      showToast({ severity: "success", detail: res.data.id });
    },
  });
  const form = useForm<NewRoom>({
    defaultValues: {},
  });
  const { register, handleSubmit } = form;
  const onSubmit: SubmitHandler<NewRoom> = (data) => {
    mutate(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormToolbar />
        <Card title="Add Room" className="w-full">
          <div className="field flex flex-column mt-4">
            <label>Room Name</label>
            <InputText {...register("name", { required: true })} />
          </div>

          <div className="field flex flex-column mt-4">
            <Controller
              name="basePrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>Base price</label>
                  <CurrencyInput
                    value={field.value}
                    onAmountChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {InputError({ name: field.name })}
                </>
              )}
            />
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddRoomPage;
