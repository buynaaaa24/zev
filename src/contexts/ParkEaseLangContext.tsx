"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PLang = "en" | "mn";

type Ctx = { lang: PLang; toggle: () => void };

const ParkEaseLangContext = createContext<Ctx>({ lang: "mn", toggle: () => {} });

export function ParkEaseLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<PLang>("mn");

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*parkease-lang\s*=\s*([^;]+)/);
    const val = match?.[2] as PLang | undefined;
    if (val === "en" || val === "mn") setLang(val);
  }, []);

  const toggle = () => {
    const next: PLang = lang === "mn" ? "en" : "mn";
    setLang(next);
    document.cookie = `parkease-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <ParkEaseLangContext.Provider value={{ lang, toggle }}>
      {children}
    </ParkEaseLangContext.Provider>
  );
}

export const useParkEaseLang = () => useContext(ParkEaseLangContext);
