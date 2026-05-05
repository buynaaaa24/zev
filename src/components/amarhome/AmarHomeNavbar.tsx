"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAmarHomeLang } from "@/contexts/AmarHomeLangContext";

const NAV = {
  en: [
    { label: "Overview", href: "/amarhome", key: "overview" },
    { label: "Features", href: "/amarhome#features", key: "features" },
    { label: "Hardware", href: "/amarhome#hardware", key: "hardware" },
    { label: "Pricing", href: "/amarhome#pricing", key: "pricing" },
  ],
  mn: [
    { label: "Танилцуулга", href: "/amarhome", key: "overview" },
    { label: "Онцлогууд", href: "/amarhome#features", key: "features" },
    { label: "Төхөөрөмж", href: "/amarhome#hardware", key: "hardware" },
    { label: "Үнэ тариф", href: "/amarhome#pricing", key: "pricing" },
  ],
};

export default function AmarHomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle, sections } = useAmarHomeLang();

  const links = NAV[lang].filter(link => {
    if (link.key === "overview") return true;
    if (link.key === "features") return sections.features;
    if (link.key === "hardware") return sections.hardware;
    if (link.key === "pricing") return sections.pricing;
    return true;
  });

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
        <Link href="/amarhome" className="flex items-center gap-3 group">
          <div
            className="rounded-2xl overflow-hidden shrink-0 transition-all duration-500 w-11 h-11"
            style={{ boxShadow: `0 4px 12px rgba(5,150,105,0.4)` }}
          >
            <img src="/amarhome-logo.jpg" alt="AmarHome" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            AmarHome
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
            type="button"
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] transition-colors hover:bg-white/10 rounded-full"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {[
              menuOpen ? "translate-y-[6.5px] rotate-45" : "",
              menuOpen ? "opacity-0" : "",
              menuOpen ? "-translate-y-[6.5px] -rotate-45" : "",
            ].map((cls, i) => (
              <span
                key={i}
                className={`block h-[1.5px] w-6 rounded-full transition-all duration-300 bg-white ${cls}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-black/90 backdrop-blur-xl flex flex-col transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col px-8 pt-10 gap-2">
          {links.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
              className={`text-left text-2xl font-bold text-white/80 hover:text-white py-3 border-b border-white/5 transition-all duration-500 ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6">
            <button
              onClick={toggle}
              className="text-white/40 text-sm font-medium"
            >
              {lang === "mn" ? "Switch to English" : "Монгол руу шилжих"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
