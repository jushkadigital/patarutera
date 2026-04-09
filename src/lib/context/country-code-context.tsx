"use client";

import { createContext, useContext } from "react";

type CountryCodeProviderProps = {
  countryCode: string;
  children: React.ReactNode;
};

const CountryCodeContext = createContext<string | null>(null);

export function CountryCodeProvider({
  countryCode,
  children,
}: CountryCodeProviderProps) {
  return (
    <CountryCodeContext.Provider value={countryCode}>
      {children}
    </CountryCodeContext.Provider>
  );
}

export function useCountryCode() {
  const countryCode = useContext(CountryCodeContext);

  if (!countryCode) {
    throw new Error("useCountryCode must be used within a CountryCodeProvider");
  }

  return countryCode;
}
