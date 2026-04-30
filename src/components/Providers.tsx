"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import SmoothScroll from "./SmoothScroll";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <LanguageProvider>{children}</LanguageProvider>
    </SmoothScroll>
  );
}
