import { DependencyList, EffectCallback, useEffect, useState } from "react";

export default function useUpdateEffect(
  callback: EffectCallback,
  deps?: DependencyList
) {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    callback();
  }, deps);
}
