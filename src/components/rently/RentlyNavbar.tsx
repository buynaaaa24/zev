"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRentlyLang } from "@/contexts/RentlyLangContext";

const NAV = {
  en: [
    { label: "Overview",      href: "/rently", key: "overview" },
    { label: "Features",      href: "/rently#features", key: "features" },
    { label: "Additional",    href: "/rently#additional", key: "additional" },
    { label: "Pricing",       href: "/rently#pricing", key: "pricing" },
  ],
  mn: [
    { label: "Танилцуулга",   href: "/rently", key: "overview" },
    { label: "Боломжууд",     href: "/rently#features", key: "features" },
    { label: "Нэмэлт",        href: "/rently#additional", key: "additional" },
    { label: "Үнэ тариф",     href: "/rently#pricing", key: "pricing" },
  ],
};

export default function RentlyNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle } = useRentlyLang();
  
  const links = NAV[lang];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 sm:pt-6 pointer-events-none">
      <div 
        className="
          flex items-center justify-between pointer-events-auto
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          w-[92%] max-w-[1200px] h-[64px] rounded-[32px] bg-white/10 backdrop-blur-[12px] border border-white/20 px-6
        "
      >
        {/* Logo */}
        <Link href="/rently" className="flex items-center gap-3 group">
          <div
            className="rounded-2xl overflow-hidden shrink-0 transition-all duration-500 w-11 h-11 shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
          >
            <img src="/images/rently.png" alt="Rently" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            Rently
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all duration-300 border-white/20 text-white/50 hover:text-white"
          >
            {lang === "mn" ? "EN" : "МН"}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-[1.5px] w-4 rounded-full transition-all bg-white ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
            <span className={`block h-[1.5px] w-4 rounded-full transition-all bg-white ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[190] bg-white/95 backdrop-blur-[32px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-10">
          {links.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-black text-neutral-900 tracking-tighter"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
