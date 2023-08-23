"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var client_1 = __importDefault(require("../client"));
var AdminApi = {
    user: {
        get: function () {
            return (0, client_1["default"])("GET", "admin/users");
        }
    },
    auth: {
        login: function (payload) {
            return (0, client_1["default"])("POST", "admin/auth/login", payload);
        },
        logout: function () {
            return (0, client_1["default"])("POST", "admin/auth/logout");
        },
        register: function (payload) {
            return (0, client_1["default"])("POST", "admin/auth/register", payload);
        },
        getSession: function () {
            return (0, client_1["default"])("GET", "admin/auth/me");
        }
    },
    store: {
        list: function () {
            return (0, client_1["default"])("GET", "admin/stores");
        }
    }
};
exports["default"] = AdminApi;
