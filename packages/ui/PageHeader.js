import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PageHeader = ({ title, subTitle }) => {
    return (_jsxs("div", Object.assign({ className: "mb-4" }, { children: [_jsx("h1", Object.assign({ className: "text-2xl font-bold" }, { children: title })), subTitle && _jsx("div", Object.assign({ className: "text-gray-700" }, { children: subTitle }))] })));
};
export default PageHeader;
