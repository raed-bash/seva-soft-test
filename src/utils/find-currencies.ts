import currencies from "@/data/physical_currency_list.json";
import { Currency } from "@/pages/types";

export default function findCurrencies(
  fromCurrencyCode: string | null,
  toCurrencyCode: string | null
) {
  let fromCurrency: Currency | null = null,
    toCurrency: Currency | null = null;

  for (const currency of currencies) {
    if (currency.currencyCode === fromCurrencyCode) {
      fromCurrency = currency;
    }
    if (currency.currencyCode === toCurrencyCode) {
      toCurrency = currency;
    }
    if (fromCurrency && toCurrency) {
      return { fromCurrency, toCurrency };
    }
  }

  return { fromCurrency, toCurrency };
}
