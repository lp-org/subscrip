export const getErrorMessage = (error) => {
    var _a, _b;
    let msg = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message;
    if (msg[0].message) {
        msg = msg[0].message;
    }
    if (!msg) {
        msg = "Something went wrong, Please try again.";
    }
    return msg;
};
