"use client";
import { Pricing } from "db";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import FormToolbar from "ui/FormToolbar";
import PricingRule from "./PricingRule";
import StoreCurrencyInput from "../../Input/StoreCurrencyInput";
import PricingCalendar from "./PricingCalendar";

const PricingForm = ({ payload }: { payload: Pricing }) => {
  const form = useForm({
    defaultValues: { ...payload },
  });
  const { register, handleSubmit } = form;
  return (
    <>
      <FormToolbar title={"Create New Pricing"} />
      <Card className="w-full">
        <div className="field flex flex-column mt-4">
          <label>Name</label>
          <InputText {...register("name", { required: true })} />
        </div>

        <div className="field flex flex-column mt-4">
          <label>Base Price</label>
          <Controller
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <StoreCurrencyInput
                onAmountChange={(e) => field.onChange(e)}
                value={field.value}
              />
            )}
          ></Controller>
        </div>
        <PricingCalendar pricing={form.getValues()} />
        <Panel header="Pricing">
          <PricingRule form={form} />
        </Panel>

        <pre>{JSON.stringify(form.watch())}</pre>
      </Card>
    </>
  );
};

export default PricingForm;
