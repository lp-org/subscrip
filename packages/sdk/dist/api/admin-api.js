"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var client_1 = __importDefault(require("../client"));
var AdminApi = {
    user: {
        get: function () {
            return (0, client_1["default"])("GET", "/users/1");
        }
    }
};
exports["default"] = AdminApi;
