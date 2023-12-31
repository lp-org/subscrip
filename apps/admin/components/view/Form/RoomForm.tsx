"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Room } from "db";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputError from "ui/InputError";

import CurrencyInput from "ui/Input/CurrencyInput";
import FormToolbar from "ui/FormToolbar";
import { getErrorMessage, useToast } from "ui";
import { useRequest } from "../../../utils/adminClient";
import UploadArea from "../../UploadArea";
import { useParams } from "next/navigation";
import { InputNumber } from "primereact/inputnumber";
import { createRoomType, updateRoomType } from "utils-data";
import { useAdminRouter } from "../../../utils/use-admin-router";

import StoreCurrencyInput from "../../Input/StoreCurrencyInput";
import { Editor } from "primereact/editor";
import { forEach } from "lodash";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";

const RoomForm = ({ payload }: { payload?: Room }) => {
  const params = useParams();
  const id = params.id as string;
  const { adminClient } = useRequest();
  const { showToast } = useToast();
  const invalidateQuries = () => {
    queryClient.invalidateQueries(["getRoom", id]);
    queryClient.invalidateQueries(["roomList"]);
  };
  const { replace } = useAdminRouter();
  const { mutate } = useMutation({
    mutationFn: adminClient.room.create,
    onSuccess: (res) => {
      showToast({ severity: "success", detail: "Create Room Successfully" });
      replace(`/rooms/${res.data.id}`);
    },
  });
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: adminClient.room.update,
    onSuccess: (res) => {
      showToast({ severity: "success", detail: "Update Room Successfully" });
      invalidateQuries();
    },
  });

  const { mutate: mutateUpsertImage } = useMutation({
    mutationFn: adminClient.room.upsertImage,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Update Room Images Successfully",
      });
      invalidateQuries();
    },
    onError: (err) => {
      showToast({
        severity: "error",
        detail: getErrorMessage(err),
      });
    },
  });

  const { mutate: mutateReorderImage } = useMutation({
    mutationFn: adminClient.room.reorderImage,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Updated Images Position Successfully",
      });
      invalidateQuries();
    },
    onError: (err) => {
      showToast({
        severity: "error",
        detail: getErrorMessage(err),
      });
    },
  });

  const { mutate: mutateDeleteImage } = useMutation({
    mutationFn: adminClient.room.deleteImage,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Deleted Images Successfully",
      });
      invalidateQuries();
    },
    onError: (err) => {
      showToast({
        severity: "error",
        detail: getErrorMessage(err),
      });
    },
  });
  const form = useForm<createRoomType | updateRoomType>({
    defaultValues: { ...payload },
  });
  const { register, handleSubmit } = form;

  const onSubmit: SubmitHandler<createRoomType | updateRoomType> = (data) => {
    if (payload) {
      mutateUpdate({ id, payload: data });
    } else {
      mutate(data);
    }
  };

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
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <label>Description</label>
                      <Editor
                        value={field.value || ""}
                        onTextChange={(e) => field.onChange(e.htmlValue)}
                        style={{ height: "220px" }}
                      />
                      {InputError({ name: field.name })}{" "}
                    </>
                  )}
                />
              </div>

              <div className="field flex flex-column mt-4">
                <Controller
                  name="basePrice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Base price</label>
                      <StoreCurrencyInput
                        value={field.value}
                        onAmountChange={field.onChange}
                      />
                      {InputError({ name: field.name })}
                    </>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="images"
                render={({ field }) => (
                  <>
                    <UploadArea
                      title="Media"
                      onImagesChange={(e) => {
                        if (payload) {
                          mutateReorderImage({
                            id,
                            payload: { g_ids: e.map((el) => el.id) },
                          });
                        } else {
                          field.onChange(e.map((el) => el.id));
                        }
                      }}
                      onNewImagesChange={(e) => {
                        if (payload) {
                          mutateUpsertImage({
                            id,
                            payload: { g_ids: e.map((el) => el.id) },
                          });
                        } else {
                          field.onChange(e.map((el) => el.id));
                        }
                      }}
                      images={field.value}
                      onDeleteImage={(e) => {
                        if (payload) {
                          mutateDeleteImage({
                            id,
                            payload: { g_ids: e.map((el) => el.id) },
                          });
                        } else {
                          field.onChange(e.map((el) => el.id));
                        }
                      }}
                    />
                  </>
                )}
              />
              <div className="field flex flex-column mt-4">
                <label>Quantity</label>
                <Controller
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <InputNumber
                      onChange={(e) => field.onChange(e.value)}
                      value={field.value || 0}
                    />
                  )}
                />
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-4">
            <Card title="Publishing">
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <div className="field flex flex-column mt-4">
                    <label>Status</label>
                    <Dropdown
                      options={["published", "draft"]}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                        if (payload) {
                          mutateUpdate({ id, payload: { status: e.value } });
                        }
                      }}
                    />
                  </div>
                )}
              />
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
