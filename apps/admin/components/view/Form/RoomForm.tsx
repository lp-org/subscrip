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

import CurrencyInput from "ui/Input/CurrencyInput";
import FormToolbar from "ui/FormToolbar";
import { useToast } from "ui";
import { useRequest } from "../../../utils/adminClient";
import { Panel } from "primereact/panel";
import { FileUpload } from "primereact/fileupload";
import useDropzone from "ui/utils/use-dropzone";

const RoomForm = () => {
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
  const isDragging = useDropzone();

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormToolbar title={"Create New Room"} />
        <div className="grid mt-4">
          <div className="col-12 md:col-8">
            <Card className="w-full">
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

              <Panel header="Media" className="mt-4">
                <FileUpload
                  name="demo[]"
                  url={"/api/upload"}
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  progressBarTemplate={<>asdas</>}
                  onBeforeDrop={() => console.log("befored")}
                  onUpload={console.log}
                  onBeforeUpload={console.log}
                />
              </Panel>
            </Card>
          </div>
          <div className="col-12 md:col-4">
            <Card title="Publishing"></Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
