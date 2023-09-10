import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";
const InputError = ({ errors, name, className }) => {
    if (!errors || !name) {
        return null;
    }
    return (_jsx(ErrorMessage, { name: name, errors: errors, render: ({ message, messages }) => {
            return (_jsx("div", Object.assign({ className: clsx("inter-small-regular mt-2 text-red-500", className) }, { children: _jsx("p", { children: message }) })));
        } }));
};
export default InputError;
