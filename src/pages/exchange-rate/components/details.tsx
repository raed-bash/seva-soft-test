type Props = {
  fromCurrencyCode?: string;
  toCurrencyCode?: string;
  total?: number | string;
};
export default function ExchangeRateDetails(props: Props) {
  const { fromCurrencyCode, toCurrencyCode, total } = props;
  return (
    <div className="flex space-x-24 justify-between">
      <h3 className="text-lg font-bold mb-6 text-center">
        Exchange Rate ({fromCurrencyCode} to {toCurrencyCode})
      </h3>
      <h3 className="text-lg font-bold mb-6 text-start">Total: {total}</h3>
    </div>
  );
}
