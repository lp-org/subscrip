import { zodResolver } from "@hookform/resolvers/zod";
import { NewCustomerType } from "db";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputError from "ui/InputError";

import { useRequest } from "../../../utils/adminClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "ui";
import { newCustomerDTOType, newCustomerDTO } from "utils-data";

type CreateCustomerForm = {
  onSave?: (e: any) => void;
};

const CreateCustomerForm = ({ onSave }: CreateCustomerForm) => {
  const form = useForm<newCustomerDTOType>({
    defaultValues: {},
    resolver: zodResolver(newCustomerDTO),
  });
  const { adminClient } = useRequest();
  const { showToast } = useToast();
  const { mutate } = useMutation({
    mutationFn: adminClient.customer.create,
    onSuccess: (res) => {
      onSave && onSave(res);

      showToast({
        severity: "success",
        detail: "Create new customer successfully",
      });
    },
  });
  const onSubmit = (data: newCustomerDTOType) => {
    mutate(data);
  };
  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-6 field flex flex-column ">
          <label>Customer Email</label>
          <InputText type="email" {...form.register("email")} />
          <InputError errors={form.formState.errors} name="email" />
        </div>

        <div className="col-12 md:col-6 field flex flex-column ">
          <label>Customer phone</label>
          <InputText type="tel" {...form.register("phone")} />
        </div>

        <div className="col-6 field flex flex-column ">
          <label>Customer first name</label>
          <InputText {...form.register("firstName")} />
        </div>

        <div className="col-6 field flex flex-column ">
          <label>Customer last name</label>
          <InputText {...form.register("lastName")} />
        </div>
      </div>
      <div className="flex justify-content-end">
        <Button onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
      </div>
    </>
  );
};

export default CreateCustomerForm;
