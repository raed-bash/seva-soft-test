export type Currency = (typeof currencies)[number];

export type ExchangeRate = [
  string,
  { "1. open": string; "2. high": string; "3. low": string; "4. close": string }
];

export type ChangeEvent = { target: { name: string; value: any } };

export type Filters = {
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  startDate: string;
  endDate: string;
};
