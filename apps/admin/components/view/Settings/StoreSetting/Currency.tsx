import { CircleDollarSign } from "lucide-react";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useStoreSetting } from "./useStoreSetting";
import { Dropdown } from "primereact/dropdown";
import { currencies } from "utils-data";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "ui";
import { useRequest } from "../../../../utils/adminClient";

const StoreCurrency = () => {
  const [isEdit, setIsEdit] = useState(false);
  const storeSetting = useStoreSetting();
  const currencyOptions = Object.entries(currencies).map(([key, value]) => ({
    value: value.code,
    label: `${value.code} - ${value.name}`,
  }));

  const { control, reset, handleSubmit } = useForm<typeof storeSetting>({
    defaultValues: {
      currency: "",
    },
  });
  const { showToast } = useToast();
  const { adminClient } = useRequest();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: adminClient.store.updateSetting,
    onSuccess: () => {
      showToast({
        severity: "success",
        detail: "Update Currency Successfully",
      });
      queryClient.invalidateQueries(["storeSetting"]);
    },
  });
  const onSubmit: SubmitHandler<typeof storeSetting> = (data) => {
    mutate(data);
  };
  useEffect(() => {
    if (storeSetting)
      reset({
        currency: storeSetting.currency,
      });
  }, [reset, storeSetting]);
  return (
    <div className="mb-4">
      <div className="flex w-full">
        <div className="font-bold">Currency</div>
        {isEdit ? (
          <Button
            className="ml-auto"
            link
            size="small"
            onClick={() => {
              handleSubmit(onSubmit)();
              setIsEdit(false);
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            className="ml-auto"
            link
            size="small"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="grid">
        {isEdit ? (
          <>
            <div className="col-6 flex flex-row align-items-center gap-4">
              <div className="flex flex-column field w-full">
                <label>Store currency</label>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => field.onChange(e.value)}
                      filter
                      value={field.value}
                    />
                  )}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-6 flex flex-row align-items-center gap-4">
              <CircleDollarSign />
              <div className="flex flex-column">
                <label>Store currency</label>
                <div className="font-bold">{storeSetting?.currency}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreCurrency;
