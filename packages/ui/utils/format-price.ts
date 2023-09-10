export const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    // TODO assuming region is already defined somewhere
    currency: currency || "USD",
  }).format(convertToDecimal(amount));
};

const convertToDecimal = (amount: number) => {
  return Math.floor(amount) / 100;
};
