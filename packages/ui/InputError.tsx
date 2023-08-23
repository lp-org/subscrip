import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";
import React from "react";

type InputErrorProps = {
  errors?: { [x: string]: unknown };
  name?: string;
  className?: string;
};

const InputError = ({ errors, name, className }: InputErrorProps) => {
  if (!errors || !name) {
    return null;
  }

  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ message, messages }) => {
        return (
          <div
            className={clsx("inter-small-regular mt-2 text-red-500", className)}
          >
            <p>{message}</p>
          </div>
        );
      }}
    />
  );
};

export default InputError;
