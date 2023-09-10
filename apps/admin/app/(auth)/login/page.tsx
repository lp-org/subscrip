/* eslint-disable @next/next/no-img-element */
"use client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "ui";
import InputError from "ui/InputError";
import { useRequest } from "../../../utils/adminClient";

type LoginFormProps = {
  email: string;
  password: string;
};
const Login = () => {
  const { showToast } = useToast();
  const { register, handleSubmit, formState, setError } =
    useForm<LoginFormProps>({
      defaultValues: { email: "", password: "" },
    });
  const { push } = useRouter();
  const { adminClient } = useRequest();
  const { mutate } = useMutation({
    mutationFn: adminClient.auth.login,
    onSuccess: () => {
      push("/");
    },
    onError: (e) => {
      setError("password", { message: "Email or password incorrect" });
    },
  });

  const onSubmit: SubmitHandler<LoginFormProps> = (data) => {
    mutate(data);
  };
  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img
            src="/images/logo.png"
            alt="hyper"
            height={50}
            className="mb-3"
          />
          <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span className="text-600 font-medium line-height-3">
            Don&apos;t have an account?
          </span>
          <Link
            href={"/register"}
            className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
          >
            Create today!
          </Link>
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
            className="w-full"
            {...register("password", { required: true })}
          />

          <InputError errors={formState.errors} name="password" />

          <div className="flex align-items-center justify-content-between mb-6">
            <a className="font-medium no-underline ml-auto mt-4 text-blue-500 text-right cursor-pointer">
              Forgot your password?
            </a>
          </div>

          <Button label="Sign In" icon="pi pi-user" className="w-full" />
        </form>
      </div>
    </div>
  );
};

export default Login;
