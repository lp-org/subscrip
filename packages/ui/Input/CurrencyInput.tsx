import React from "react";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";

interface CurrencyInputProps extends InputNumberProps {
  onAmountChange: (e: number) => void;
}
const CurrencyInput = ({ onAmountChange, ...rest }: CurrencyInputProps) => {
  return (
    <InputNumber
      {...rest}
      currency="USD"
      mode="currency"
      {...{
        value: rest.value ? rest.value / 100 : 0,
        onValueChange: (e) => {
          onAmountChange(e.value ? e.value * 100 : 0);
        },
      }}
    />
  );
};

export default CurrencyInput;
