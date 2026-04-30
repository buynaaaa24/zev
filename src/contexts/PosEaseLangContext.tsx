"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PLang = "en" | "mn";

type ActiveSections = {
  features: boolean;
  hardware: boolean;
  pricing: boolean;
};

type Ctx = { 
  lang: PLang; 
  toggle: () => void; 
  sections: ActiveSections;
  setSections: (s: ActiveSections) => void;
};

const PosEaseLangContext = createContext<Ctx>({ 
  lang: "mn", 
  toggle: () => {},
  sections: { features: true, hardware: true, pricing: true },
  setSections: () => {}
});

export function PosEaseLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<PLang>("mn");
  const [sections, setSections] = useState<ActiveSections>({ features: true, hardware: true, pricing: true });

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*posease-lang\s*=\s*([^;]+)/);
    const val = match?.[2] as PLang | undefined;
    if (val === "en" || val === "mn") setLang(val);
  }, []);

  const toggle = () => {
    const next: PLang = lang === "mn" ? "en" : "mn";
    setLang(next);
    document.cookie = `posease-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <PosEaseLangContext.Provider value={{ lang, toggle, sections, setSections }}>
      {children}
    </PosEaseLangContext.Provider>
  );
}

export const usePosEaseLang = () => useContext(PosEaseLangContext);
