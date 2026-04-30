"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";

const NAV = {
  en: [
    { label: "Overview",      href: "/posease" },
    { label: "Features",      href: "/posease#features" },
    { label: "Hardware",      href: "/posease#hardware" },
    { label: "Pricing",       href: "/posease#pricing" },
  ],
  mn: [
    { label: "Танилцуулга",   href: "/posease" },
    { label: "Онцлогууд",     href: "/posease#features" },
    { label: "Төхөөрөмж",     href: "/posease#hardware" },
    { label: "Үнэ тариф",     href: "/posease#pricing" },
  ],
};

const CTA = { en: "Request Demo", mn: "Демо үзэх" };

const PRIMARY = "#ec4899"; // Pink 500

export default function PosEaseNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggle } = usePosEaseLang();
  const isHome = pathname === "/posease" || pathname === "/posease/";
  const links = NAV[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[200] flex justify-center transition-all duration-500 ${scrolled ? "pt-0" : "pt-4 sm:pt-6"} pointer-events-none`}>
      <div 
        className={`
          flex items-center justify-between pointer-events-auto
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${scrolled 
            ? "w-full h-[60px] rounded-none bg-white/80 backdrop-blur-[24px] border-b border-neutral-200/50 shadow-sm px-6" 
            : "w-[92%] max-w-[1200px] h-[64px] rounded-[32px] bg-white/10 backdrop-blur-[12px] border border-white/20 px-6"
          }
        `}
      >
        {/* Logo */}
        <Link href="/posease" className="flex items-center gap-2 group">
          <div
            className={`rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${scrolled ? "w-8 h-8" : "w-9 h-9"}`}
            style={{ background: `linear-gradient(135deg,${PRIMARY},#f472b6)`, boxShadow: `0 4px 12px ${PRIMARY}40` }}
          >
            <span className="text-white font-black text-sm">P</span>
          </div>
          <span className={`font-bold tracking-tight transition-all duration-300 ${scrolled ? "text-neutral-800 text-sm" : "text-white text-base"}`}>
            PosEase
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                scrolled
                  ? "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all duration-300 ${
              scrolled
                ? "border-neutral-200 text-neutral-400 hover:text-neutral-800"
                : "border-white/20 text-white/50 hover:text-white"
            }`}
          >
            {lang === "mn" ? "EN" : "МН"}
          </button>

          <Link
            href="/posease/try"
            className={`font-bold rounded-2xl active:scale-95 transition-all duration-500 flex items-center justify-center ${scrolled ? "px-4 py-2 text-xs" : "px-6 py-2.5 text-[13px]"}`}
            style={{ background: PRIMARY, color: "white", boxShadow: `0 8px 20px ${PRIMARY}40` }}
          >
            {CTA[lang]}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${scrolled ? "hover:bg-black/5" : "hover:bg-white/10"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-[1.5px] w-4 rounded-full transition-all ${scrolled ? "bg-neutral-800" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
            <span className={`block h-[1.5px] w-4 rounded-full transition-all ${scrolled ? "bg-neutral-800" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
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
          <div className="flex flex-col gap-4 w-full mt-10">
            <Link
              href="/posease/try"
              onClick={() => setMenuOpen(false)}
              className="w-full py-5 rounded-[24px] text-center font-bold text-white text-lg"
              style={{ background: PRIMARY, boxShadow: `0 12px 32px ${PRIMARY}40` }}
            >
              {CTA[lang]}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
