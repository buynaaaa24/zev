"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParkEaseLang } from "@/contexts/ParkEaseLangContext";

const NAV = {
  en: [
    { label: "Overview", href: "/parkease" },
    { label: "How It Works", href: "/parkease#how-it-works" },
    { label: "Payments", href: "/parkease#payments" },
    { label: "Pricing", href: "/parkease#pricing" },
  ],
  mn: [
    { label: "Танилцуулга", href: "/parkease" },
    { label: "Хэрхэн ажилладаг", href: "/parkease#how-it-works" },
    { label: "Төлбөр", href: "/parkease#payments" },
    { label: "Үнэ тариф", href: "/parkease#pricing" },
  ],
};

const CTA = { en: "Request Trial", mn: "Турших хүсэлт" };

export default function ParkEaseNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle } = useParkEaseLang();

  const links = NAV[lang];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 sm:pt-6 pointer-events-none">
      <div
        className={`
          flex items-center justify-between pointer-events-auto
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          w-[92%] max-w-[1200px] h-[64px] rounded-[32px] backdrop-blur-[20px] border px-6
          ${scrolled
            ? "bg-neutral-900/90 border-neutral-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-white/10 border-white/20"
          }
        `}
      >
        {/* Logo */}
        <Link href="/parkease" className="flex items-center gap-3 group">
          <div
            className="rounded-2xl overflow-hidden shrink-0 transition-all duration-500 w-11 h-11 shadow-[0_4px_12px_rgba(246,180,20,0.3)]"
          >
            <img src="/images/parkease.jpg" alt="ParkEase" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            ParkEase
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
          {/* Desktop CTA */}
          <Link
            href="/parkease/try"
            className="hidden sm:inline-block text-[11px] font-bold px-4 py-2 rounded-full bg-[#f6b414] text-[#1a0f00] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
          >
            {CTA[lang]}
          </Link>

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
          <div className="pt-6 flex flex-col gap-4">
            <Link
              href="/parkease/try"
              onClick={() => setMenuOpen(false)}
              className="inline-block text-center text-sm font-bold px-6 py-3 rounded-full bg-[#f6b414] text-[#1a0f00] active:scale-95 transition-all duration-200"
            >
              {CTA[lang]}
            </Link>
            <button
              onClick={toggle}
              className="text-white/40 text-left text-sm font-medium"
            >
              {lang === "mn" ? "Switch to English" : "Монгол руу шилжих"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
