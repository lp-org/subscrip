"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Store } from "db";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Metadata } from "next/types";
import { useRequest } from "../../utils/adminClient";
import { useToast } from "ui";
import { Chip } from "primereact/chip";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";

const StorePage = () => {
  const { adminClient } = useRequest();
  const { data, isLoading } = useQuery({
    queryFn: adminClient.store.list,
    queryKey: ["storeList"],
  });
  const stores = data?.data;
  const router = useSearchParams();
  const action = router.get("action");

  if (isLoading)
    return (
      <div className="w-full md:w-6 p-3">
        <Skeleton className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="5rem" className="mb-2"></Skeleton>
        <Skeleton height="2rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" height="4rem"></Skeleton>
      </div>
    );
  return (
    <div className="main-layout">
      {stores && (
        <div className="main-container">
          {stores?.length === 0 || action === "create" ? (
            <CreateStoreForm />
          ) : (
            <SelectStoreForm stores={stores} />
          )}
        </div>
      )}
    </div>
  );
};

interface CreateStoreFormProps {
  name: string;
}

const CreateStoreForm = () => {
  const { adminClient } = useRequest();
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<CreateStoreFormProps>({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit: SubmitHandler<CreateStoreFormProps> = (data) => {
    mutate(data);
  };
  const { showToast } = useToast();
  const { mutate, isLoading } = useMutation({
    mutationFn: adminClient.store.create,
    onSuccess: (res) => {
      showToast({
        severity: "success",
        detail: "Store Successfully Created, Redirecting to Dashboard",
      });
      setTimeout(() => {
        router.push(`/store/${res.data.id}/dashboard`);
      }, 2000);
    },
  });
  return (
    <Card
      title={
        <div className="flex flex-row align-items-center ">
          <div>Create store</div>
          <Button
            onClick={() => router.back()}
            link
            label="Back"
            className="ml-auto"
          />
        </div>
      }
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field flex flex-column gap-2">
          <label>Store name</label>
          <InputText {...register("name")} placeholder="My Store" />
          <small>You can change store name after created</small>
        </div>
        <Button
          className="w-full block mt-4"
          loading={isLoading}
          disabled={!watch("name")}
        >
          Create
        </Button>
      </form>
    </Card>
  );
};

const SelectStoreForm = ({ stores }: { stores: Store[] }) => {
  const { register, handleSubmit, watch } = useForm<CreateStoreFormProps>({
    defaultValues: {
      name: "",
    },
  });

  return (
    <Card title="Select store" className="w-full">
      <div className="flex flex-column gap-4">
        {stores?.map((el) => (
          <Link href={`/store/${el.id}/dashboard`} key={el.id}>
            <div className="hover:bg-gray-300 border-round border-1 border-gray-500 p-4 flex flex-row cursor-pointer">
              <div className=" w-full  font-bold ">{el.name}</div>

              <Tag
                value={el.active ? "Active" : "Inactive"}
                className={el.active ? "" : "bg-gray-500"}
              ></Tag>
            </div>
          </Link>
        ))}
      </div>
      <Link href={"/store?action=create"}>
        <Button className="mt-4 w-full block">Create New Store</Button>
      </Link>
    </Card>
  );
};
export default StorePage;
