"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type RLang = "en" | "mn";

type ActiveSections = {
  features: boolean;
  notifications: boolean;
  penalties: boolean;
  costs: boolean;
  pricing: boolean;
};

type Ctx = { 
  lang: RLang; 
  toggle: () => void;
  sections: ActiveSections;
  setSections: (s: ActiveSections) => void;
};

const RentlyLangContext = createContext<Ctx>({ 
  lang: "mn", 
  toggle: () => {},
  sections: { features: true, notifications: true, penalties: true, costs: true, pricing: true },
  setSections: () => {}
});

export function RentlyLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<RLang>("mn");
  const [sections, setSections] = useState<ActiveSections>({ features: true, notifications: true, penalties: true, costs: true, pricing: true });

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*rently-lang\s*=\s*([^;]+)/);
    const val = match?.[2] as RLang | undefined;
    if (val === "en" || val === "mn") setLang(val);
  }, []);

  const toggle = () => {
    const next: RLang = lang === "mn" ? "en" : "mn";
    setLang(next);
    document.cookie = `rently-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <RentlyLangContext.Provider value={{ lang, toggle, sections, setSections }}>
      {children}
    </RentlyLangContext.Provider>
  );
}

export const useRentlyLang = () => useContext(RentlyLangContext);
