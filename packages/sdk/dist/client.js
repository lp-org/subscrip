"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.axiosClient = exports.client = void 0;
var axios_1 = __importDefault(require("axios"));
exports.client = axios_1["default"].create({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    baseURL: process.env.BACKEND_URL || "http://localhost:5000"
});
var axiosClient = function (option) {
    return axios_1["default"].create(option);
};
exports.axiosClient = axiosClient;
function clientRequest(method, path, payload) {
    if (path === void 0) { path = ""; }
    if (payload === void 0) { payload = {}; }
    var options = {
        method: method,
        withCredentials: true,
        url: path,
        data: payload
    };
    return (0, exports.client)(options);
}
exports["default"] = clientRequest;
