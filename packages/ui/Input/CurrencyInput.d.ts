import { InputNumberProps } from "primereact/inputnumber";
interface CurrencyInputProps extends InputNumberProps {
    onAmountChange: (e: number) => void;
}
declare const CurrencyInput: ({ ...rest }: CurrencyInputProps) => JSX.Element;
export default CurrencyInput;
//# sourceMappingURL=CurrencyInput.d.ts.map