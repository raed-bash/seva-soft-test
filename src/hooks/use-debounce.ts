import { useRef } from "react";

export default function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
) {
  const timerId = useRef<NodeJS.Timeout>();

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timerId.current);

    timerId.current = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
