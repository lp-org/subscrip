"use client";
import { Pricing, PricingRule } from "db";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  UseFormReturn,
  useFieldArray,
  useForm,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import CrudDialog from "../../CrudDIalog";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import StoreCurrencyInput from "../../Input/StoreCurrencyInput";
import { MultiSelect } from "primereact/multiselect";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPricingRuleDTO } from "utils-data";
import InputError from "ui/InputError";
import { Checkbox } from "primereact/checkbox";
import { formatDateRange, formatPrice } from "ui";
import useAdminUser from "../../../utils/use-admin-user";
type Props = {
  form: UseFormReturn<Pricing, any>;
};
const PricingRuleForm = ({ form }: Props) => {
  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: "pricingRule",
  });

  const [showRule, setShowRule] = useState(false);

  const [index, setIndex] = useState<number>();

  const saveEditRecord = (data: PricingRule) => {
    if (index === null || index === undefined) {
      append(data);
    } else {
      update(index, data);
    }

    setShowRule(false);
  };

  const hidePriceEdit = () => {
    setIndex(undefined);
    setShowRule(false);
  };

  const openEditRule = (i?: number | undefined) => {
    setShowRule(true);
    setIndex(i);
  };

  const selectedPriceRule = useMemo(() => {
    return typeof index === "number" ? fields[index] : undefined;
  }, [fields, index]);
  const { data } = useAdminUser();
  return (
    <div>
      {fields.map((el, i) => (
        <div
          className="flex flex-col border border-1 border-gray-300 mb-4 border-round p-4 gap-4 align-items-center"
          key={el.id}
        >
          <div>{formatDateRange(el.startAt, el.endAt)}</div>
          <div>
            {el.type === "amount"
              ? formatPrice(el.value, data?.data?.store?.currency)
              : el.type === "fixed"
              ? `${
                  (el.value >= 0 ? "+" : "") +
                  formatPrice(el.value, data?.data?.store?.currency)
                }`
              : `${(el.value >= 0 ? "+" : "") + el.value + "%"}`}
          </div>

          <Button
            icon="pi pi-ellipsis-h"
            className="ml-auto"
            onClick={() => {
              openEditRule(i);
            }}
            link
          ></Button>
        </div>
      ))}
      <Button
        className="block w-full"
        severity="secondary"
        outlined
        type="button"
        onClick={() => openEditRule()}
      >
        Add rule
      </Button>
      <PriceRuleDialog
        onSave={(e) => saveEditRecord(e)}
        onHide={hidePriceEdit}
        value={selectedPriceRule}
        visible={showRule}
      />
    </div>
  );
};

export default PricingRuleForm;

interface PricingRuleProps extends PricingRule {
  valueChangeType: "+" | "-";
  hasEndAt: boolean;
}

const PriceRuleDialog = ({
  value,
  onSave,
  visible,
  onHide,
}: {
  value: PricingRule | undefined;
  onSave: (e: PricingRule) => void;
  visible: boolean;
  onHide: () => void;
}) => {
  const { control, handleSubmit, formState, reset, watch, setValue } =
    useForm<PricingRuleProps>({
      defaultValues: getDefaultValues(),
      resolver: zodResolver(createPricingRuleDTO),
    });
  const type = useWatch({ control, name: "type" });
  const valueChangeType = useWatch({ control, name: "valueChangeType" });
  const amountValue = useWatch({ control, name: "value" });
  const hasEndAt = useWatch({ control, name: "hasEndAt" });
  const onSubmit: SubmitHandler<PricingRule> = (data) => {
    console.log(data);
    onSave(data);

    resetData();
  };

  const hideDialog = () => {
    onHide();
  };

  const resetData = () => {
    reset(getDefaultValues());
  };

  useEffect(() => {
    console.log(getDefaultValues(value));
    reset(getDefaultValues(value));
  }, [value]);

  return (
    <form>
      <CrudDialog
        hideDialog={hideDialog}
        visible={visible}
        saveAction={handleSubmit(onSubmit)}
      >
        <div className="field">
          <label>Pricing Type</label>
          <Controller
            control={control}
            name="type"
            render={({ field, formState }) => (
              <div className="flex align-items-top flex-column lg:flex-row gap-4">
                <div className="flex flex-row">
                  <RadioButton
                    {...field}
                    inputRef={field.ref}
                    value="amount"
                    checked={field.value === "amount"}
                  />
                  <label className="ml-1 mr-3">
                    <div className="font-bold">Amount</div>
                    <span className="text-sm">
                      override the amount of base rate
                    </span>
                  </label>
                </div>
                <div className="flex flex-row">
                  <RadioButton
                    {...field}
                    value="fixed"
                    checked={field.value === "fixed"}
                  />
                  <label className="ml-1 mr-3">
                    <div className="font-bold">Fixed</div>
                    <span className="text-sm">
                      Add a fixed amount on top of base rate
                    </span>
                  </label>
                </div>
                <div className="flex flex-row">
                  <RadioButton
                    {...field}
                    value="percentage"
                    checked={field.value === "percentage"}
                  />
                  <label className="ml-1 mr-3">
                    <div className="font-bold">Percentage</div>
                    <span className="text-sm">Add a % on top of base rate</span>
                  </label>
                </div>
                <InputError errors={formState.errors} name="type" />
              </div>
            )}
          ></Controller>
        </div>
        <div className="field">
          <Controller
            control={control}
            name="value"
            render={({ field: fieldParent, fieldState, formState }) =>
              type === "amount" ? (
                <>
                  <label>Amount</label>

                  <StoreCurrencyInput
                    onAmountChange={(e) => fieldParent.onChange(e)}
                    value={fieldParent.value}
                  />
                </>
              ) : type === "fixed" ? (
                <>
                  <label>Amount</label>
                  <div className="p-inputgroup w-full ">
                    <Controller
                      control={control}
                      name="valueChangeType"
                      render={({ field }) => (
                        <>
                          <span className="p-inputgroup-addon">
                            <RadioButton
                              {...field}
                              value="+"
                              checked={field.value === "+"}
                              onClick={() => {
                                fieldParent.onChange(
                                  Math.abs(fieldParent.value)
                                );
                              }}
                            />
                            <label className="ml-1 mr-3">+</label>
                          </span>
                          <span className="p-inputgroup-addon">
                            <RadioButton
                              {...field}
                              value="-"
                              checked={field.value === "-"}
                              onClick={() => {
                                fieldParent.onChange(-fieldParent.value);
                              }}
                            />
                            <label className="ml-1 mr-3">-</label>
                          </span>
                        </>
                      )}
                    ></Controller>

                    <StoreCurrencyInput
                      onAmountChange={(e) => fieldParent.onChange(e)}
                      value={fieldParent.value}
                    />
                  </div>
                </>
              ) : type === "percentage" ? (
                <>
                  <label>Percentage</label>
                  <div className="p-inputgroup w-full ">
                    <Controller
                      control={control}
                      name="valueChangeType"
                      render={({ field }) => (
                        <>
                          <span className="p-inputgroup-addon">
                            <RadioButton
                              {...field}
                              value="+"
                              checked={field.value === "+"}
                            />
                            <label className="ml-1 mr-3">+</label>
                          </span>
                          <span className="p-inputgroup-addon">
                            <RadioButton
                              {...field}
                              value="-"
                              checked={field.value === "-"}
                            />
                            <label className="ml-1 mr-3">-</label>
                          </span>
                        </>
                      )}
                    ></Controller>

                    <InputNumber
                      mode="decimal"
                      onChange={(e) => fieldParent.onChange(e.value)}
                      value={fieldParent.value}
                    />
                    <span className="p-inputgroup-addon">%</span>
                  </div>
                </>
              ) : (
                <></>
              )
            }
          />
        </div>
        <div className="field">
          <label>Start time</label>
          <Controller
            control={control}
            name="startAt"
            render={({ field, formState }) => (
              <>
                <Calendar
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  dateFormat={"dd/mm/yy"}
                />
                <InputError errors={formState.errors} name="startAt" />
              </>
            )}
          ></Controller>
        </div>

        {hasEndAt && (
          <div className="field">
            <label>End time</label>
            <Controller
              control={control}
              name="endAt"
              render={({ field }) => (
                <>
                  <Calendar
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    dateFormat={"dd/mm/yy"}
                  />
                </>
              )}
            ></Controller>
          </div>
        )}

        <Controller
          control={control}
          name="hasEndAt"
          render={({ field }) => (
            <div className="field flex align-content-center gap-2">
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.checked || false)}
              />
              <label>Set a period?</label>
            </div>
          )}
        ></Controller>

        <div className="field">
          <label>Day of week</label>
          <Controller
            control={control}
            name="dayOfWeek"
            render={({ field }) => (
              <>
                <MultiSelect
                  placeholder="saturday,sunday,... (Optional)"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ]}
                />
              </>
            )}
          ></Controller>
        </div>
      </CrudDialog>
    </form>
  );
};

const getDefaultValues = (d?: PricingRule | undefined): PricingRuleProps => {
  return {
    endAt: d?.endAt || null,
    value: d?.value || 0,
    dayOfWeek: d?.dayOfWeek || [],
    pricingId: d?.pricingId || "",
    startAt: d?.startAt || null,
    type: d?.type || "amount",
    valueChangeType: !!d?.value ? (d?.value >= 0 ? "+" : "-") : "+",
    hasEndAt: d?.endAt ? true : false,
  };
};
