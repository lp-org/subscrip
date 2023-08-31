import React from "react";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";

interface CurrencyInputProps extends InputNumberProps {
  onAmountChange: (e: number) => void;
}
const CurrencyInput = ({ ...rest }: CurrencyInputProps) => {
  return (
    <InputNumber
      {...rest}
      currency="USD"
      mode="currency"
      {...{
        value: rest.value ? rest.value / 100 : 0,
        onChange: (e) => {
          rest.onChange && rest.onChange(e);
          rest.onAmountChange &&
            rest.onAmountChange(e.value ? e.value * 100 : 0);
        },
      }}
    />
  );
};

export default CurrencyInput;
