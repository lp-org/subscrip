export const formatPrice = (amount: number, currency?: string | null) => {
  if (currency)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      // TODO assuming region is already defined somewhere
      currency: currency || "USD",
    }).format(convertToDecimal(amount));
  else {
    if (!currency) return convertToDecimal(amount).toFixed(2);
  }
};

const convertToDecimal = (amount: number) => {
  return Math.floor(amount) / 100;
};
