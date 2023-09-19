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
                return request("POST", "admin/users/logout");
            },
            register: function (payload) {
                return request("POST", "admin/auth/register", payload);
            },
            getSession: function () {
                return request("GET", "admin/users/me");
            }
        },
        store: {
            list: function () {
                return request("GET", "admin/stores");
            },
            create: function (_a) {
                var name = _a.name;
                return request("POST", "admin/stores", { name: name });
            },
            setting: function () {
                return request("GET", "admin/stores/settings");
            },
            updateSetting: function (payload) {
                return request("PUT", "admin/stores/settings", payload);
            }
        },
        room: {
            create: function (payload) {
                return request("POST", "admin/rooms", payload);
            },
            list: function (params) {
                return request("GET", "admin/rooms", params);
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
        },
        booking: {
            list: function (params) {
                return request("GET", "admin/booking", params);
            },
            create: function (payload) {
                return request("POST", "admin/booking", payload);
            },
            getDisabledBookingDate: function (payload) {
                return request("POST", "admin/booking/disabledDates", payload);
            },
            getRoomBookingPrice: function (payload) {
                return request("POST", "admin/booking/bookingPrice", payload);
            },
            getBookingCalendar: function (payload) {
                return request("POST", "admin/booking/calendar", payload);
            }
        },
        customer: {
            list: function (params) {
                return request("GET", "admin/customer", params);
            },
            create: function (payload) {
                return request("POST", "admin/customer", payload);
            }
        }
    };
};
exports["default"] = AdminApi;
