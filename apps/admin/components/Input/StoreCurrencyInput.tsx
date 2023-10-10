import React from "react";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import useAdminUser from "../../utils/use-admin-user";
import CurrencyInput from "ui/Input/CurrencyInput";

interface StoreCurrencyInputProps extends InputNumberProps {
  onAmountChange: (e: number) => void;
}
const StoreCurrencyInput = ({ ...rest }: StoreCurrencyInputProps) => {
  const { data } = useAdminUser();

  return (
    <CurrencyInput {...rest} currency={data?.data?.store?.currency || "USD"} />
  );
};

export default StoreCurrencyInput;
