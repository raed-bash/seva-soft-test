import { CircleLoading } from "@/components";

type Props = { loading?: boolean; error?: any; tryAgain?: () => void };
export default function ExchangeRateLoadingAndError(props: Props) {
  const { loading, error, tryAgain } = props;
  return (
    (loading || error) && (
      <div className="flex justify-center items-center mb-60 mt-60">
        {loading && <CircleLoading />}
        {error && (
          <h4 className="text-2xl text-red-800">
            {error.length > 3 ? error : "Somthing went wrong, Please try again"}
            .
            <a
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                if (tryAgain) tryAgain();
              }}
            >
              Try again.
            </a>
          </h4>
        )}
      </div>
    )
  );
}
