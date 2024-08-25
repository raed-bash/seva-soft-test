"use client";
import { memo, useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks";
import { URL_API } from "@/constants/url-apis";
import { Layout } from "@/components";
import { ExchangeRate, Filters } from "../types";
import {
  ExchangeRateDetails,
  ExchangeRateFilter,
  ExchangeRateLoadingAndError,
  ExchangeRateTable,
} from "./components";

function Home() {
  const [filters, setFilters] = useState<Filters>({
    fromCurrency: null,
    toCurrency: null,
    startDate: "",
    endDate: "",
  });
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [cashingExchangeRates, setCashingExchangeRates] = useState<
    Record<string, Record<string, ExchangeRate[]> | any>
  >({});
  const [loading, setLoading] = useState(exchangeRates.length ? false : true);
  const [error, setError] = useState<any>(null);

  const { startDate, endDate, fromCurrency, toCurrency } = filters;

  const setAndFilterData = useCallback(
    (data: ExchangeRate[]) => {
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
    },
    [startDate, endDate]
  );

  const fetchExchangeRates = useCallback(() => {
    if (!fromCurrency || !toCurrency) return;

    setError(null);

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

        if (res.status === 200 && results.Information) {
          setError(results.Information);
          setLoading(false);
          return;
        }

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

  const fetchExchangeRatesDebounce = useDebounce(fetchExchangeRates, 1000);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    fetchExchangeRatesDebounce();
  }, [filters]);

  return (
    <Layout title="Exchange Rate">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg mt-10">
          <h1 className="text-2xl font-bold text-center mb-6">
            Currency Exchange Rates
          </h1>
          <ExchangeRateFilter output={(filter) => setFilters(filter)} />
          <ExchangeRateDetails
            fromCurrencyCode={fromCurrency?.currencyCode}
            toCurrencyCode={toCurrency?.currencyCode}
            total={exchangeRates.length}
          />
          <ExchangeRateTable
            exchangeRates={exchangeRates}
            hideTbody={!loading && !error}
          />
          <ExchangeRateLoadingAndError
            error={error}
            loading={loading}
            tryAgain={() => {
              fetchExchangeRates();
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
export default memo(Home);
