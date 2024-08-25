import { ExchangeRate } from "@/pages/types";

type Props = {
  exchangeRates?: ExchangeRate[];
  hideTbody?: boolean;
};
const columns = ["Date", "Open", "High", "Low", "Close"];

export default function ExchangeRateTable(props: Props) {
  const { exchangeRates = [], hideTbody = false } = props;
  return (
    <table className="mt-6 w-full text-left border-collapse">
      <thead>
        <tr>
          {columns.map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      {!hideTbody && (
        <tbody>
          {exchangeRates.length > 0 &&
            exchangeRates.map(([date, rate]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{rate["1. open"]}</td>
                <td>{rate["2. high"]}</td>
                <td>{rate["3. low"]}</td>
                <td>{rate["4. close"]}</td>
              </tr>
            ))}
        </tbody>
      )}
    </table>
  );
}
