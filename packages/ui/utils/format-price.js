export const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        // TODO assuming region is already defined somewhere
        currency: currency || "USD",
    }).format(convertToDecimal(amount));
};
const convertToDecimal = (amount) => {
    return Math.floor(amount) / 100;
};
