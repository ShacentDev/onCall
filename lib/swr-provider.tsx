"use client";
import { SWRConfig } from "swr";
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
        refreshInterval: 100000,
        revalidateOnFocus: false,
        revalidateIfStale: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
