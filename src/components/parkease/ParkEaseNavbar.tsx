"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParkEaseLang } from "@/contexts/ParkEaseLangContext";

const NAV = {
  en: [
    { label: "Overview",      href: "/parkease" },
    { label: "How It Works",  href: "/parkease#how-it-works" },
    { label: "Payments",      href: "/parkease#payments" },
    { label: "Pricing",       href: "/parkease#pricing" },
  ],
  mn: [
    { label: "Танилцуулга",        href: "/parkease" },
    { label: "Хэрхэн ажилладаг",  href: "/parkease#how-it-works" },
    { label: "Төлбөр",            href: "/parkease#payments" },
    { label: "Үнэ тариф",         href: "/parkease#pricing" },
  ],
};

const CTA = { en: "Request Trial", mn: "Турших хүсэлт" };

export default function ParkEaseNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggle } = useParkEaseLang();
  const isHome = pathname === "/parkease" || pathname === "/parkease/";
  const links = NAV[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const glass = !scrolled && isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
        glass
          ? "bg-transparent"
          : "bg-white/80 backdrop-blur-xl border-b border-neutral-100/60 shadow-sm"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex items-center justify-between h-[60px] md:h-[68px]">

        {/* Logo */}
        <Link href="/parkease" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
            style={{ background: "linear-gradient(135deg,#f6b414,#ffc93c)" }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
              <text x="1" y="13" fontSize="14" fontWeight="900" fill="#1a0f00" fontFamily="system-ui,-apple-system">P</text>
            </svg>
          </div>
          <span className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${glass ? "text-white" : "text-neutral-800"}`}>
            ParkEase
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                glass
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className={`text-[13px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
              glass
                ? "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                : "border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {lang === "mn" ? "EN" : "МН"}
          </button>

          <Link
            href="/parkease/try"
            className="text-[13px] font-semibold px-5 py-2.5 rounded-full active:scale-95 transition-all duration-200"
            style={{ background: "#f6b414", color: "#1a0f00", boxShadow: "0 4px 14px rgba(246,180,20,0.35)" }}
          >
            {CTA[lang]}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
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
              className={`block h-[1.5px] w-6 rounded-full transition-all duration-300 ${glass ? "bg-white" : "bg-neutral-800"} ${cls}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-black/92 backdrop-blur-xl flex flex-col transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-8 pt-10 gap-2">
          {links.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
              className={`text-left text-2xl font-bold text-white/80 hover:text-white py-3 border-b border-white/5 transition-all duration-500 ${
                menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6 flex items-center gap-4">
            <Link
              href="/parkease/try"
              onClick={() => setMenuOpen(false)}
              className="inline-block text-[15px] font-semibold px-6 py-3 rounded-full"
              style={{ background: "#f6b414", color: "#1a0f00" }}
            >
              {CTA[lang]}
            </Link>
            <button
              onClick={toggle}
              className="text-white/50 text-[14px] font-semibold border border-white/20 px-3 py-1.5 rounded-full hover:text-white hover:border-white/40 transition-all"
            >
              {lang === "mn" ? "EN" : "МН"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
