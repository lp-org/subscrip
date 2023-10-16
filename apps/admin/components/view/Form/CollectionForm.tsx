"use client";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Collection, Room } from "db";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { useEffect, useMemo, useState } from "react";
import FormToolbar from "ui/FormToolbar";
import { useRequest } from "../../../utils/adminClient";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";

import Image from "next/image";
import { createCollectionDTO, createCollectionType } from "utils-data";
import { zodResolver } from "@hookform/resolvers/zod";
import InputError from "ui/InputError";
import { useAdminRouter } from "../../../utils/use-admin-router";
import { useToast } from "ui";
import { Button } from "primereact/button";
import { Trash } from "lucide-react";
import { Checkbox } from "primereact/checkbox";
import OrderList from "ui/OrderList";

const CollectionForm = ({ payload }: { payload?: Collection }) => {
  const queryClient = new QueryClient();
  const [selectAll, setSelectAll] = useState(false);
  const { showToast } = useToast();
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: () => adminClient.room.list({}),
    queryKey: ["roomList"],
  });
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const { data: dataRoom } = useQuery({
    queryFn: () => adminClient.room.list({ collection_id: payload?.id }),
    queryKey: ["roomList", payload?.id],
    enabled: !!payload,
  });
  const { replace } = useAdminRouter();

  const { mutate } = useMutation({
    mutationFn: adminClient.collection.create,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Create Collection Successfully",
      });
      replace(`/collections/${res.data}`);
    },
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: adminClient.collection.update,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Update Collection Successfully",
      });
    },
  });
  const rooms = data?.data?.room || [];
  const itemTemplate = (id: string) => {
    const mergedList = rooms.concat(dataRoom?.data?.room || []);

    const room = mergedList.find((el) => el.id === id);
    if (room)
      return (
        <>
          <Image
            width={100}
            height={40}
            className="w-4rem shadow-2 flex-shrink-0 border-round"
            src={`${room.images?.[0]?.url}` || `/_assets/placeholder.png`}
            alt={room.name}
          />
          <div className="flex-1 flex flex-column gap-2 xl:mr-8">
            <span className="font-bold">{room.name}</span>
          </div>
        </>
      );
  };
  const form = useForm<createCollectionType>({
    defaultValues: {
      name: "",
      room_id: [],
      status: "published",
    },
    resolver: zodResolver(createCollectionDTO),
  });

  const onSubmit: SubmitHandler<createCollectionType> = (data) => {
    if (payload) {
      mutateUpdate({ id: payload?.id, payload: data });
    } else {
      mutate(data);
    }
  };
  useEffect(() => {
    if (payload && dataRoom?.data) {
      form.reset({
        name: payload.name,
        status: payload.status,
        room_id: dataRoom.data.room.map((el) => el.id),
      });
    }
  }, [payload, dataRoom]);

  const { mutate: mutateDeleteRoom } = useMutation({
    mutationFn: adminClient.collection.deleteCollectionRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(["roomList", payload?.id]);
      showToast({ severity: "success", detail: "Delete room successfully" });
    },
  });
  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormToolbar
          title={payload ? "Update Collection" : "Create Collection"}
        />
        <div className="grid mt-4">
          <div className="col-12 md:col-8">
            <Card>
              <div className="field flex flex-column mt-4 ">
                <label>Collection Name</label>
                <InputText {...form.register("name")} />
                <InputError errors={form.formState.errors} name="name" />
              </div>

              <Controller
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <>
                    <div className="field flex flex-column mt-4">
                      <label>Rooms</label>
                      <MultiSelect
                        filter
                        value={field.value}
                        options={rooms}
                        onChange={(e) => {
                          field.onChange(e.value);
                          setSelectAll(e.value.length === rooms.length);
                          if (payload) {
                            mutateUpdate({
                              id: payload?.id,
                              payload: { room_id: e.value },
                            });
                          }
                        }}
                        optionLabel="name"
                        optionValue="id"
                        selectAll={selectAll}
                        onSelectAll={(e) => {
                          field.onChange(
                            e.checked ? [] : rooms.map((item) => item.id)
                          );
                          setSelectAll(!e.checked);
                        }}
                        virtualScrollerOptions={{ itemSize: 43 }}
                        maxSelectedLabels={3}
                        placeholder="Select Items"
                      />
                    </div>
                    <OrderList
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                        if (payload) {
                          mutateUpdate({
                            id: payload?.id,
                            payload: { room_id: e.value },
                          });
                        }
                      }}
                      itemTemplate={itemTemplate}
                      checkbox
                      selectedValue={selectedRoom}
                      setSelectedValue={setSelectedRoom}
                      header={
                        <div className="flex flex-row">
                          <div>Rooms</div>
                          {!!selectedRoom.length && (
                            <Button
                              className="ml-auto"
                              type="button"
                              size="small"
                              outlined
                              onClick={() => {
                                if (payload) {
                                  mutateDeleteRoom({
                                    id: payload.id,
                                    payload: { room_id: selectedRoom },
                                  });
                                }
                                field.onChange(
                                  field.value.filter(
                                    (item) => !selectedRoom.includes(item)
                                  )
                                );
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      }
                      dragdrop
                    ></OrderList>
                  </>
                )}
              ></Controller>
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

                        //   if (payload) {
                        //     mutateUpdate({ id, payload: { status: e.value } });
                        //   }
                      }}
                    />
                  </div>
                )}
              />
            </Card>
          </div>
        </div>
      </form>
    </>
  );
};

export default CollectionForm;
