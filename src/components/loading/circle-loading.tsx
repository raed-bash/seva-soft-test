import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = {
  loadingProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
function CircleLoading(props: Props) {
  const {
    loadingProps = { className: "" },
    className = "",
    ...otherProps
  } = props;

  return (
    <div
      {...otherProps}
      className={"flex justify-center items-center h-12" + className}
    >
      <div
        {...loadingProps}
        className={
          "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 " +
          loadingProps.className
        }
      ></div>
    </div>
  );
}
export default CircleLoading;
