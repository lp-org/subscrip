import { StoreIcon, PhoneIcon, MailIcon } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useRequest } from "../../../../utils/adminClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoreSetting } from "./useStoreSetting";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "ui";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const storeSetting = useStoreSetting();
  const { register, reset, handleSubmit } = useForm<typeof storeSetting>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
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
        summary: "Update Profile Successfully",
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
        name: storeSetting.name,
        phone: storeSetting.phone,
        email: storeSetting.email,
      });
  }, [reset, storeSetting]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div className="flex w-full">
        <div className="font-bold">Profile</div>
        {isEdit ? (
          <Button
            type="button"
            className="ml-auto"
            link
            size="small"
            onClick={() => setIsEdit(false)}
          >
            Save
          </Button>
        ) : (
          <Button
            type="submit"
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
            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <div className="flex flex-column field w-full">
                <label>Store name</label>
                <InputText {...register("name")} />
              </div>
            </div>

            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <div className="flex flex-column field w-full">
                <label>Store phone</label>
                <InputText type="tel" {...register("phone")} />
              </div>
            </div>

            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <div className="flex flex-column field w-full">
                <label>Store email</label>
                <InputText type="email" {...register("email")} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <StoreIcon />
              <div className="flex flex-column">
                <label>Store name</label>
                <div className="font-bold">{storeSetting?.name}</div>
              </div>
            </div>

            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <PhoneIcon />
              <div className="flex flex-column">
                <label>Store phone</label>
                <div className="font-bold">{storeSetting?.phone}</div>
              </div>
            </div>

            <div className="col-12 md:col-6 flex flex-row align-items-center gap-4">
              <MailIcon />
              <div className="flex flex-column">
                <label>Store email</label>
                <div className="font-bold line-height-4">
                  {storeSetting?.email}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Profile;
