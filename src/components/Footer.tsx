"use client";

import type { FooterSections } from "@/lib/site-content-types";
import { Translations } from "@/lib/translations";

export default function Footer({
  content: _content,
  t: _t,
  accentColor: _accentColor,
  trialHref: _trialHref,
  copyrightYear,
}: {
  content: FooterSections;
  t: Translations;
  accentColor?: string;
  trialHref?: string;
  copyrightYear?: number;
}) {
  const year = copyrightYear ?? new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-white/10 py-8 sm:py-10 relative z-10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-white/40 text-sm">All rights reserved © {year}</p>
        <p className="text-white/40 text-sm">Powered by Zevtabs since 2021</p>
      </div>
    </footer>
  );
}
