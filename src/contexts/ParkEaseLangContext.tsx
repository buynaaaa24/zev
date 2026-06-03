"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type PLang = "en" | "mn";

type ActiveSections = {
  features: boolean;
  bolomjuud: boolean;
};

type Ctx = { 
  lang: PLang; 
  toggle: () => void; 
  sections: ActiveSections;
  setSections: (s: ActiveSections) => void;
};

const ParkEaseLangContext = createContext<Ctx>({ 
  lang: "mn", 
  toggle: () => {},
  sections: { features: true, bolomjuud: false },
  setSections: () => {}
});

export function ParkEaseLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<PLang>("mn");
  const [sections, setSections] = useState<ActiveSections>({ features: true, bolomjuud: false });

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

  const contextValue = useMemo(() => ({ 
    lang, 
    toggle, 
    sections, 
    setSections 
  }), [lang, sections]);

  return (
    <ParkEaseLangContext.Provider value={contextValue}>
      {children}
    </ParkEaseLangContext.Provider>
  );
}

export const useParkEaseLang = () => useContext(ParkEaseLangContext);
