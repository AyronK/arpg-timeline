import { useState, useEffect } from "react";

const isServer = typeof window === "undefined";

export const useSearchParams = (): [
  URLSearchParams,
  (key: string, value: string | string[]) => void,
  (key: string) => string | string[] | null,
] => {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(() => {
    if (isServer) {
      return new URLSearchParams();
    } else {
      return new URLSearchParams(window.location.search);
    }
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
    if (!isServer) {
      window.history.pushState({}, "", "?" + newSearchParams.toString());
    }
  };

  const getSearchParam = (key: string): string | string[] | null => {
    const values = searchParams.getAll(key);
    return values.length > 1 ? values : values[0] || null;
  };

  useEffect(() => {
    if (!isServer) {
      const handlePopState = () => {
        setSearchParamsState(new URLSearchParams(window.location.search));
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  return [searchParams, setSearchParam, getSearchParam];
};
