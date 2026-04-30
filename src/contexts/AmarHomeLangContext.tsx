"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ALang = "en" | "mn";

type ActiveSections = {
  features: boolean;
  hardware: boolean;
  pricing: boolean;
};

type Ctx = { 
  lang: ALang; 
  toggle: () => void;
  sections: ActiveSections;
  setSections: (s: ActiveSections) => void;
};

const AmarHomeLangContext = createContext<Ctx>({ 
  lang: "mn", 
  toggle: () => {},
  sections: { features: true, hardware: true, pricing: true },
  setSections: () => {}
});

export function AmarHomeLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<ALang>("mn");
  const [sections, setSections] = useState<ActiveSections>({ features: true, hardware: true, pricing: true });

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*amarhome-lang\s*=\s*([^;]+)/);
    const val = match?.[2] as ALang | undefined;
    if (val === "en" || val === "mn") setLang(val);
  }, []);

  const toggle = () => {
    const next: ALang = lang === "mn" ? "en" : "mn";
    setLang(next);
    document.cookie = `amarhome-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <AmarHomeLangContext.Provider value={{ lang, toggle, sections, setSections }}>
      {children}
    </AmarHomeLangContext.Provider>
  );
}

export const useAmarHomeLang = () => useContext(AmarHomeLangContext);
