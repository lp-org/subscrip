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
        gallery: {
            upload: function (files) {
                var data = new FormData();
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file = files_1[_i];
                    data.append("files", file);
                }
                return request("POST", "admin/gallery/upload", data);
            },
            list: function () {
                return request("GET", "admin/gallery");
            },
            "delete": function (payload) {
                return request("DELETE", "admin/gallery", payload);
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
            update: function (_a) {
                var id = _a.id, payload = _a.payload;
                return request("PUT", "admin/rooms/".concat(id), payload);
            },
            upsertImage: function (_a) {
                var id = _a.id, payload = _a.payload;
                return request("PUT", "admin/rooms/images/".concat(id), payload);
            },
            deleteImage: function (_a) {
                var id = _a.id, payload = _a.payload;
                return request("DELETE", "admin/rooms/images/".concat(id), payload);
            },
            reorderImage: function (_a) {
                var id = _a.id, payload = _a.payload;
                return request("PUT", "admin/rooms/reorderImages/".concat(id), payload);
            },
            list: function (params) {
                return request("GET", "admin/rooms", params);
            },
            get: function (id) {
                return request("GET", "admin/rooms/".concat(id));
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
            },
            getStoreSubscriptionPlan: function (storeSubscriptionPlanid) {
                return request("GET", "admin/billing/subscribe/".concat(storeSubscriptionPlanid));
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
        },
        paymentMethod: {
            list: function () {
                return request("GET", "admin/payment-method");
            },
            getStorePaymentMethod: function (paymentMethodId) {
                return request("GET", "admin/payment-method/".concat(paymentMethodId));
            },
            getStorePaymentMethod: function (id) {
                return request("GET", "admin/payment-method/".concat(id));
            },
            stripeConnectAccount: function (payload) {
                return request("POST", "admin/payment-method/stripe-connect-account", payload);
            }
        }
    };
};
exports["default"] = AdminApi;
