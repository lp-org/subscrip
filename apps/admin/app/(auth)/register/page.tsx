"use client";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";
import { getErrorMessage, useToast } from "ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import adminClient from "../../../utils/adminClient";
type RegisterFormProps = {
  email: string;
  password: string;
  confirmPassword: string;
};
const Login = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, watch, formState } =
    useForm<RegisterFormProps>({
      defaultValues: { email: "", password: "", confirmPassword: "" },
    });

  const { mutate } = useMutation({
    mutationFn: adminClient.auth.register,
    onSuccess: () => {
      router.push("/");
      showToast({ severity: "success", detail: "Register successful" });
    },
    onError: (e) => {
      showToast({ severity: "error", detail: getErrorMessage(e) });
    },
  });

  const onSubmit: SubmitHandler<RegisterFormProps> = (data) => mutate(data);

  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img
            src="/demo/images/blocks/logos/hyper.svg"
            alt="hyper"
            height={50}
            className="mb-3"
          />
          <div className="text-900 text-3xl font-medium mb-3">Register</div>

          <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
            Go to Login
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Email
          </label>
          <InputText
            id="email"
            type="text"
            placeholder="Email address"
            className="w-full mb-3"
            {...register("email", { required: true })}
          />
          <label htmlFor="password" className="block text-900 font-medium mb-2">
            Password
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mb-3"
            {...register("password", { required: true })}
          />
          <label htmlFor="password" className="block text-900 font-medium mb-2">
            Confrim Password
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-3"
            {...register("confirmPassword", {
              required: true,
              validate: (val: string) => {
                if (watch("password") != val) {
                  return "Your passwords do no match";
                }
              },
            })}
          />{" "}
          <ErrorMessage errors={formState.errors} name="confirmPassword" />
          <Button label="Sign up" icon="pi pi-user" className="w-full" />
        </form>
      </div>
    </div>
  );
};

export default Login;
