var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { InputNumber } from "primereact/inputnumber";
const CurrencyInput = (_a) => {
    var rest = __rest(_a, []);
    return (_jsx(InputNumber, Object.assign({}, rest, { currency: "USD", mode: "currency" }, {
        value: rest.value ? rest.value / 100 : 0,
        onChange: (e) => {
            rest.onChange && rest.onChange(e);
            rest.onAmountChange &&
                rest.onAmountChange(e.value ? e.value * 100 : 0);
        },
    })));
};
export default CurrencyInput;
