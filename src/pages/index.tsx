"use client";
import { memo, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import currencies from "@/data/physical_currency_list.json";
import { useQuery, useDebounce, useUpdateEffect } from "@/hooks";
import { DateNow } from "@/utils";
import { URL_API } from "@/constants/url-apis";
import { Layout, CircleLoading } from "@/components";

type Curreny = (typeof currencies)[number];
type ExchangeRate = [
  string,
  { "1. open": string; "2. high": string; "3. low": string; "4. close": string }
];
const findCurrencyByCurrencyCode = (currencyCode: string) =>
  currencies.find((currency) => currency.currencyCode === currencyCode) || null;
const defaultCurrency = {
  from: currencies.find((currency) => currency.currencyCode === "USD") || null,
  to: currencies.find((currency) => currency.currencyCode === "EUR") || null,
};
//
function Home() {
  const searchParams = useSearchParams();
  const { createNewQueries } = useQuery();
  const [dateNow] = useState(() => DateNow());
  const [fromCurrency, setFromCurrency] = useState<Curreny | null>(
    defaultCurrency.from
  );
  const [toCurrency, setToCurrency] = useState<Curreny | null>(
    defaultCurrency.to
  );
  const [startDate, setStartDate] = useState(dateNow);
  const [endDate, setEndDate] = useState(dateNow);
  const [oneRender, setOneRender] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [cashingExchangeRates, setCashingExchangeRates] = useState<
    Record<string, Record<string, ExchangeRate[]> | any>
  >({});
  const [loading, setLoading] = useState(exchangeRates.length ? false : true);
  const [error, setError] = useState<any>(null);

  const setAndFilterData = useCallback((data: ExchangeRate[]) => {
    const filteredData =
      !startDate && !endDate
        ? data
        : data.filter(([date]) => {
            if (startDate && endDate) {
              return date >= startDate && date <= endDate;
            } else if (startDate) {
              return date >= startDate;
            }
            return date >= startDate && date <= endDate;
          });

    setExchangeRates(filteredData);
  }, []);

  const fetchExchangeRates = useCallback(() => {
    if (!fromCurrency || !toCurrency) return;

    const fromCurrencyCode = fromCurrency.currencyCode;
    const toCurrencyCode = toCurrency.currencyCode;

    const cashingExchangeRate =
      cashingExchangeRates[fromCurrencyCode]?.[toCurrencyCode];

    if (cashingExchangeRate) {
      setAndFilterData(cashingExchangeRate);
      return;
    }
    const fetchExchangeRate = async function () {
      setLoading(true);
      try {
        const res = await fetch(
          URL_API +
            `/query?function=FX_DAILY&from_symbol=${fromCurrencyCode}&to_symbol=${toCurrencyCode}&outputsize=full&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`,
          { method: "get" }
        );
        const results = await res.json();
        const newData = Object.entries(
          results["Time Series FX (Daily)"]
        ) as ExchangeRate[];

        setLoading(false);

        setCashingExchangeRates((cashingExchangeRates) => ({
          ...cashingExchangeRates,
          [fromCurrencyCode]: {
            ...(cashingExchangeRates?.[fromCurrencyCode] || {}),
            [toCurrencyCode]: newData,
          },
        }));
        setAndFilterData(newData);
      } catch (err) {
        setLoading(false);
        setError(JSON.stringify(err));
      }
    };
    fetchExchangeRate();
  }, [startDate, endDate, setCashingExchangeRates]);

  const fetchExchangeRatesDebounce = useDebounce(fetchExchangeRates);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    fetchExchangeRatesDebounce();
  }, [fromCurrency, toCurrency, startDate, endDate]);

  useUpdateEffect(() => {
    createNewQueries([
      ["fromCurrency", fromCurrency?.currencyCode],
      ["toCurrency", toCurrency?.currencyCode],
      ["startDate", startDate],
      ["endDate", endDate],
    ]);
  }, [fromCurrency, toCurrency, startDate, endDate]);

  let fromCurrencyCodeParams = searchParams.get("fromCurrency");
  let toCurrencyCodeParams = searchParams.get("toCurrency");
  let startDateParams = searchParams.get("startDate");
  let endDateParams = searchParams.get("endDate");

  useEffect(() => {
    if (
      oneRender &&
      (fromCurrencyCodeParams ||
        toCurrencyCodeParams ||
        startDateParams ||
        endDateParams)
    ) {
      startDateParams =
        startDateParams && startDateParams < dateNow
          ? startDateParams
          : dateNow;

      endDateParams =
        endDateParams && endDateParams < dateNow ? endDateParams : dateNow;

      setFromCurrency(
        currencies.find(
          (currency) => currency.currencyCode === fromCurrencyCodeParams
        ) || defaultCurrency.from
      );
      setToCurrency(
        currencies.find(
          (currency) => currency.currencyCode === toCurrencyCodeParams
        ) || defaultCurrency.to
      );
      setStartDate(startDateParams);
      setEndDate(endDateParams);
      setOneRender(false);
    }
  }, [
    fromCurrencyCodeParams,
    toCurrencyCodeParams,
    startDateParams,
    endDateParams,
  ]);
  return (
    <Layout title="Exchange Rate">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg mt-10">
          <h1 className="text-2xl font-bold text-center mb-6">
            Currency Exchange Rates
          </h1>

          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                From Currency
              </label>
              <Select<Curreny>
                className="mt-1"
                options={currencies}
                value={fromCurrency}
                getOptionLabel={(currency) =>
                  `${currency.currencyCode} (${currency.currencyName})`
                }
                getOptionValue={(currency) => currency.currencyCode}
                onChange={(currency) => setFromCurrency(currency)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                To Currency
              </label>
              <Select<Curreny>
                className="mt-1"
                options={currencies}
                value={toCurrency}
                getOptionLabel={(currency) =>
                  `${currency.currencyCode} (${currency.currencyName})`
                }
                getOptionValue={(currency) => currency.currencyCode}
                onChange={(option) => setToCurrency(option)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={dateNow}
              />
            </div>
          </div>
          <div className="flex space-x-24 justify-between">
            <h3 className="text-lg font-bold mb-6 text-center">
              Exchange Rate ({fromCurrency?.currencyCode} to{" "}
              {toCurrency?.currencyCode})
            </h3>
            <h3 className="text-lg font-bold mb-6 text-start">
              Total: {exchangeRates.length}
            </h3>
          </div>
          <table className="mt-6 w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 py-2 px-4">Date</th>
                <th className="border-b-2 border-gray-300 py-2 px-4">Open</th>
                <th className="border-b-2 border-gray-300 py-2 px-4">High</th>
                <th className="border-b-2 border-gray-300 py-2 px-4">Low</th>
                <th className="border-b-2 border-gray-300 py-2 px-4">Close</th>
              </tr>
            </thead>
            {!loading && !error && (
              <tbody>
                {exchangeRates.length > 0 &&
                  exchangeRates.map(([date, rate], i) => (
                    <tr key={i}>
                      <td className="border-b border-gray-300 py-2 px-4">
                        {date}
                      </td>
                      <td className="border-b border-gray-300 py-2 px-4">
                        {rate["1. open"]}
                      </td>
                      <td className="border-b border-gray-300 py-2 px-4">
                        {rate["2. high"]}
                      </td>
                      <td className="border-b border-gray-300 py-2 px-4">
                        {rate["3. low"]}
                      </td>
                      <td className="border-b border-gray-300 py-2 px-4">
                        {rate["4. close"]}
                      </td>
                    </tr>
                  ))}{" "}
              </tbody>
            )}
          </table>
          {loading ||
            (error && (
              <div className="flex justify-center items-center mb-60 mt-60">
                {loading && <CircleLoading />}
                {error && (
                  <h4 className="text-2xl text-red-800">
                    Somthing went wrong, Please try again.{" "}
                    <a
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        fetchExchangeRates();
                        setError(null);
                      }}
                    >
                      Try again.
                    </a>
                  </h4>
                )}
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}
export default memo(Home);
