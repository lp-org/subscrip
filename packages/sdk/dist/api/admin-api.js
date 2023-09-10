"use strict";
exports.__esModule = true;
var AdminApi = function (request) {
    return {
        user: {
            get: function () {
                return request("GET", "admin/users");
            }
        },
        auth: {
            login: function (payload) {
                return request("POST", "admin/auth/login", payload);
            },
            logout: function () {
                return request("POST", "admin/auth/logout");
            },
            register: function (payload) {
                return request("POST", "admin/auth/register", payload);
            },
            getSession: function () {
                return request("GET", "admin/auth/me");
            }
        },
        store: {
            list: function () {
                return request("GET", "admin/stores");
            },
            create: function (_a) {
                var name = _a.name;
                return request("POST", "admin/stores", { name: name });
            }
        },
        room: {
            create: function (payload) {
                return request("POST", "admin/rooms", payload);
            },
            list: function () {
                return request("GET", "admin/rooms");
            }
        },
        plan: {
            list: function () {
                return request("GET", "admin/plans");
            }
        },
        billing: {
            session: function () {
                return request("POST", "admin/billing/session");
            },
            getPaymentMethod: function (id) {
                return request("GET", "admin/billing/paymentMethod/".concat(id));
            },
            mySubscription: function (filter) {
                return request("GET", "admin/billing/store-subscription", filter);
            },
            subscribe: function (planId) {
                return request("POST", "admin/billing/subscribe", { planId: planId });
            }
        }
    };
};
exports["default"] = AdminApi;
