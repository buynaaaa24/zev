"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const SECTIONS = [
  { id: "home",     label: { en: "Home",     mn: "Нүүр" } },
  { id: "about",    label: { en: "About",    mn: "Тухай" } },
  { id: "services", label: { en: "Services", mn: "Үйлчилгээ" } },
  { id: "work",     label: { en: "Work",     mn: "Төсөл" } },
  { id: "contact",  label: { en: "Contact",  mn: "Холбоо" } },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar({ siteId = "zevtabs" }: { siteId?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const { lang, toggle } = useLanguage();
  const base = siteId === "zevtabs" ? "" : `/${siteId}`;
  const isHome = pathname === `${base}/` || pathname === base || pathname === "/";

  // Track scroll depth + active section
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);

      // Find which section is currently in view
      const sectionIds = SECTIONS.map((s) => s.id);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isTransparent = !scrolled && isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] flex justify-center transition-all duration-500 pointer-events-none ${
        scrolled ? "pt-0" : "pt-4 sm:pt-6"
      }`}
    >
      <div 
        className={`
          flex items-center justify-between pointer-events-auto
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${scrolled 
            ? "w-full h-[60px] md:h-[68px] rounded-none bg-white/80 backdrop-blur-[24px] border-b border-neutral-200/50 shadow-sm px-6 md:px-10" 
            : "w-[92%] max-w-[1200px] h-[60px] md:h-[64px] rounded-[32px] bg-white/10 backdrop-blur-[12px] border border-white/20 px-6 shadow-2xl"
          }
        `}
      >

        {/* Logo */}
        <button
          onClick={() => isHome ? scrollToSection("home") : undefined}
          className="flex items-center gap-2 group"
          aria-label="Zevtabs – scroll to top"
        >
          {!isHome ? (
            <Link href={`${base}/`} className="flex items-center gap-2">
              <LogoMark />
              <WordMark dark={!isTransparent} />
            </Link>
          ) : (
            <>
              <LogoMark />
              <WordMark dark={!isTransparent} />
            </>
          )}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {SECTIONS.map((s) => {
            const label = lang === "mn" ? s.label.mn : s.label.en;
            const isActive = isHome && activeSection === s.id;

            if (isHome) {
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    isActive
                      ? isTransparent
                        ? "text-white bg-white/10"
                        : "text-neutral-900 bg-neutral-100"
                      : isTransparent
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-500" />
                  )}
                </button>
              );
            }

            return (
              <Link
                key={s.id}
                href={`${base}/#${s.id}`}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  isTransparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className={`text-[13px] font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${
              isTransparent
                ? "text-white/60 hover:text-white hover:bg-white/10"
                : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {lang === "mn" ? "EN" : "МН"}
          </button>
          <button
            onClick={() => isHome ? scrollToSection("contact") : undefined}
            className="text-[13px] font-semibold px-5 py-2.5 rounded-full bg-accent-500 text-white hover:bg-accent-600 active:scale-95 transition-all duration-200 shadow-sm shadow-accent-500/25"
          >
            {lang === "mn" ? "Холбоо барих" : "Get Started"}
          </button>
        </div>

        {/* Mobile hamburger */}
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
              className={`block h-[1.5px] w-6 rounded-full transition-all duration-300 ${
                isTransparent ? "bg-white" : "bg-neutral-800"
              } ${cls}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-black/90 backdrop-blur-xl flex flex-col transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-8 pt-10 gap-2">
          {SECTIONS.map((s, i) => {
            const label = lang === "mn" ? s.label.mn : s.label.en;
            return (
              <button
                key={s.id}
                onClick={() => { scrollToSection(s.id); setMenuOpen(false); }}
                style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
                className={`text-left text-2xl font-bold text-white/80 hover:text-white py-3 border-b border-white/5 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
              >
                {label}
              </button>
            );
          })}
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

function LogoMark() {
  return (
    <img 
      src="/logo.png" 
      alt="Zevtabs" 
      className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform duration-300" 
    />
  );
}

function WordMark({ dark }: { dark: boolean }) {
  return (
    <span
      className={`text-[17px] font-semibold tracking-tight transition-colors duration-300 ${
        dark ? "text-neutral-800" : "text-white"
      }`}
    >
      Zevtabs
    </span>
  );
}
