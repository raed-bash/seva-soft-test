import Select from "react-select";
import currencies from "@/data/physical_currency_list.json";
import { useEffect, useState } from "react";
import { DateNow, findCurrencies } from "@/utils";
import { useQuery, useUpdateEffect } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, Currency, Filters } from "@/pages/types";

const defaultCurrency = findCurrencies("USD", "EUR");
type Props = { output: (filters: Filters) => void };
export default function ExchangeRateFilter(props: Props) {
  const { output } = props;
  const searchParams = useSearchParams();
  const [dateNow] = useState(() => DateNow());
  const [filters, setFilters] = useState<Filters>({
    fromCurrency: defaultCurrency.fromCurrency,
    toCurrency: defaultCurrency.toCurrency,
    startDate: dateNow,
    endDate: dateNow,
  });
  const [oneRender, setOneRender] = useState(true);
  const { createNewQueries } = useQuery();
  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFilters((filters) => ({ ...filters, [name]: value }));
  };
  const { startDate, endDate, fromCurrency, toCurrency } = filters;
  const params = {
    fromCurrencyCode: searchParams.get("fromCurrency"),
    toCurrencyCode: searchParams.get("toCurrency"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };
  useUpdateEffect(() => {
    output(filters);
    createNewQueries([
      ["fromCurrency", fromCurrency?.currencyCode],
      ["toCurrency", toCurrency?.currencyCode],
      ["startDate", startDate],
      ["endDate", endDate],
    ]);
  }, [filters]);

  useEffect(() => {
    const { fromCurrencyCode, toCurrencyCode, startDate, endDate } = params;
    if (
      oneRender &&
      (fromCurrencyCode || toCurrencyCode || startDate || endDate)
    ) {
      const startDateHandled =
        startDate && startDate < dateNow ? startDate : dateNow;

      const endDateHandled = endDate && endDate < dateNow ? endDate : dateNow;

      const currenciesFound = findCurrencies(
        params.fromCurrencyCode,
        params.toCurrencyCode
      );
      const fromCurrencyHandled =
        currenciesFound.fromCurrency || defaultCurrency.fromCurrency;
      const toCurrencyHandled =
        currenciesFound.toCurrency || defaultCurrency.toCurrency;

      setFilters({
        startDate: startDateHandled,
        endDate: endDateHandled,
        fromCurrency: fromCurrencyHandled,
        toCurrency: toCurrencyHandled,
      });

      setOneRender(false);
    }
  }, [params]);

  return (
    <div className="flex space-x-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          From Currency
        </label>
        <Select<Currency>
          className="mt-1"
          options={currencies}
          value={fromCurrency}
          getOptionLabel={(currency) =>
            `${currency.currencyCode} (${currency.currencyName})`
          }
          getOptionValue={(currency) => currency.currencyCode}
          onChange={(currency) =>
            handleChange({
              target: { name: "fromCurrency", value: currency },
            })
          }
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          To Currency
        </label>
        <Select<Currency>
          className="mt-1"
          options={currencies}
          value={toCurrency}
          getOptionLabel={(currency) =>
            `${currency.currencyCode} (${currency.currencyName})`
          }
          getOptionValue={(currency) => currency.currencyCode}
          onChange={(currency) =>
            handleChange({
              target: { name: "toCurrency", value: currency },
            })
          }
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          name="startDate"
          type="date"
          value={startDate}
          onChange={handleChange}
          max={endDate}
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          name="endDate"
          type="date"
          value={endDate}
          onChange={handleChange}
          min={startDate}
          max={dateNow}
        />
      </div>
    </div>
  );
}
