"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
const FormToolbar = ({ backUrl }) => {
    const router = useRouter();
    return (_jsx(Toolbar, { end: _jsx(Button, Object.assign({ type: "submit" }, { children: " Save" })), start: _jsx(Button, { icon: "pi pi-angle-left", type: "button", link: true, onClick: () => {
                backUrl ? router.push(backUrl) : router.back();
            } }) }));
};
export default FormToolbar;
