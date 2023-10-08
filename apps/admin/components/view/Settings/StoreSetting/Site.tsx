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
import { InputText } from "primereact/inputtext";

interface SiteType {
  url: string;
}

const Site = () => {
  const [isEdit, setIsEdit] = useState(false);
  const storeSetting = useStoreSetting();

  const { control, reset, handleSubmit } = useForm<SiteType>({
    defaultValues: {
      url: "",
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
  const onSubmit: SubmitHandler<SiteType> = (data) => {
    mutate(data);
  };
  useEffect(() => {
    if (storeSetting)
      reset({
        url: storeSetting.url,
      });
  }, [reset, storeSetting]);
  return (
    <div className="mb-4">
      <div className="flex w-full">
        <div className="font-bold">Site</div>
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
                <label>URL</label>
                <Controller
                  control={control}
                  name="url"
                  render={({ field }) => (
                    <div className="p-inputgroup flex-1">
                      {" "}
                      <InputText
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <span className="p-inputgroup-addon">
                        .subscrip.store
                      </span>
                    </div>
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
                <label>URL</label>
                <div className="font-bold">
                  {storeSetting?.url}
                  <span className="text-base font-normal">.subscrip.store</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Site;
