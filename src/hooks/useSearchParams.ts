import { useState, useEffect } from "react";

export const useSearchParams = (): [
  URLSearchParams,
  (key: string, value: string | string[]) => void,
  (key: string) => string | string[] | null,
] => {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  const setSearchParam = (key: string, value: string | string[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (Array.isArray(value)) {
      newSearchParams.delete(key);
      value.forEach((val) => {
        newSearchParams.append(key, val);
      });
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParamsState(newSearchParams);
    window.history.pushState({}, "", "?" + newSearchParams.toString());
  };

  const getSearchParam = (key: string): string | string[] | null => {
    const values = searchParams.getAll(key);
    return values.length > 1 ? values : values[0] || null;
  };

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return [searchParams, setSearchParam, getSearchParam];
};
