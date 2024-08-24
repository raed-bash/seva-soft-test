import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createNewQueries = useCallback(
    (queries: [string, string?][]) => {
      const params = new URLSearchParams(searchParams.toString());
      queries.forEach(([name, value]) => {
        params.set(name, typeof value === "string" ? value : "");
      });
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams]
  );

  return { createNewQueries };
}
