export const formatPrice = (
  price: number | string | null | undefined,
  currency: "TRY" | "USD" | "EUR" = "USD",
  locale?: string
): string => {
  if (price === null || price === undefined || price === "") {
    return getCurrencySymbol(currency) + "0.00";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return getCurrencySymbol(currency) + "0.00";
  }

  const defaultLocale = getDefaultLocale(currency);
  const formatLocale = locale || defaultLocale;

  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const getCurrencySymbol = (currency: "TRY" | "USD" | "EUR"): string => {
  switch (currency) {
    case "TRY":
      return "₺";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "₺";
  }
};

const getDefaultLocale = (currency: "TRY" | "USD" | "EUR"): string => {
  switch (currency) {
    case "TRY":
      return "tr-TR";
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    default:
      return "en-US";
  }
};

export const formatPriceCompact = (
  price: number,
  currency: "TRY" | "USD" | "EUR" = "USD"
): string => {
  const symbol = getCurrencySymbol(currency);

  if (price >= 1000000) {
    return `${symbol}${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `${symbol}${(price / 1000).toFixed(1)}K`;
  }
  return formatPrice(price, currency);
};

export const formatDiscount = (
  originalPrice: number,
  discountedPrice: number,
  currency: "TRY" | "USD" | "EUR" = "USD"
): string => {
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}% Off`;
};
