"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParkEaseLang } from "@/contexts/ParkEaseLangContext";
import LeadFormSection from "@/components/sections/LeadFormSection";
import type {
  GlobalContactInfo,
  ParkEaseSections,
} from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";
import { ChevronRight } from "lucide-react";

const YELLOW = "#f6b414";
const YELLOW_DARK = "#d99a0e";
const YELLOW_GLOW = "rgba(246,180,20,";

const handleAnchorScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
  const href = e.currentTarget.getAttribute("href");
  if (href && href.startsWith("#")) {
    e.preventDefault();
    const targetId = href.substring(1);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", href);
  }
};

/* ── Admin sections context ─────────────────────────────── */
const EMPTY_SECTIONS: ParkEaseSections = {
  hero: {
    eyebrow: "",
    title1: "",
    words: [],
    desc: "",
    cta1: "",
    cta2: "",
    stats: [],
  },
  how: { label: "", title: [], desc: "", steps: [] },
  payments: {
    label: "",
    title: [],
    desc: "",
    qpayTitle: "",
    qpayBadge: "",
    qpayDesc: "",
    stickerTitle: "",
    stickerBadge: "",
    stickerDesc: "",
    note: "",
    banks: [],
  },
  features: { label: "", title: "", desc: "", items: [] },
  bolomjuud: { label: "", title: "", desc: "", items: [] },
  pricing: {
    label: "",
    title: "",
    desc: "",
    mostPopular: "",
    ctaBtn: "",
    note: "",
    quoteBtn: "",
    quoteLink: "",
    tiers: [],
  },
  free: { title: "", desc: "", cards: [] },
  cta: {
    title: "",
    desc: "",
    btn: "",
    emailLabel: "",
    email: "",
    phoneLabel: "",
    phone: "",
    locationLabel: "",
    location: "",
  },
};

const AdminCtx = createContext<{ mn: ParkEaseSections; en: ParkEaseSections }>({
  mn: EMPTY_SECTIONS,
  en: EMPTY_SECTIONS,
});

/* ── Scroll-reveal hook ─────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Ensures external URLs have a protocol so they don't resolve relative to current page. */
function ensureAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

/* ── Hero ────────────────────────────────────────────────── */
function HeroSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].hero;
  const words = api.words;

  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    setWordIdx(0);
    setWordVisible(true);
  }, [lang]);
  useEffect(() => {
    const id = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % words.length);
        setWordVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const onScroll = () => {
      if (window.innerWidth < 768) return;
      const content = heroEl.querySelector<HTMLElement>(".hero-content");
      if (content)
        content.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      alpha: number;
    }[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.2,
        dy: -Math.random() * 0.3 - 0.05,
        alpha: Math.random() * 0.22 + 0.04,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${YELLOW_GLOW}${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(140deg,#0a0800 0%,#0d0b00 55%,#120e00 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${YELLOW_GLOW}0.16) 0%, transparent 70%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-[3]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />

      <div className="hero-content relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16 pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44">
        <div className={`flex flex-col ${api.image ? "lg:flex-row lg:items-start lg:gap-12 xl:gap-16" : ""}`}>
        {/* Text column */}
        <div className={api.image ? "lg:flex-1" : ""}>
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-[11px] sm:text-xs font-medium tracking-wider uppercase mb-6 sm:mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: YELLOW }}
            />
            {api.eyebrow}
          </div>

          <h1
            className={`font-black tracking-tight leading-[1.06] mb-6 sm:mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: ".15s" }}
          >
            <span className="block text-white text-[36px] sm:text-5xl md:text-6xl lg:text-[84px]">
              {api.title1}
            </span>
            <span
              className="block text-[36px] sm:text-5xl md:text-6xl lg:text-[84px]"
              style={{
                background:
                  "linear-gradient(135deg,#fff 0%,#ffe48a 45%,#f6b414 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transition: "opacity .35s ease, transform .35s ease",
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {words[wordIdx]}
            </span>
          </h1>

          <p
            className={`text-white/45 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl sm:max-w-2xl mb-8 sm:mb-12 font-light transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: ".3s" }}
          >
            {api.desc}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: ".44s" }}
          >
            <a
              href="#kholbooBarikh"
              onClick={handleAnchorScroll}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold active:scale-[0.97] transition-all duration-300"
              style={{
                background: `linear-gradient(90deg,${YELLOW},#ffc93c,${YELLOW})`,
                backgroundSize: "200%",
                animation: "shimmer 3s linear infinite",
                boxShadow: `0 8px 28px ${YELLOW_GLOW}0.35)`,
                color: "#1a0f00",
              }}
            >
              {api.cta1}
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            {api.cta2Link ? (
              <a
                href={ensureAbsoluteUrl(api.cta2Link)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white text-[15px] font-medium active:scale-[0.97] hover:bg-white/5 transition-all duration-300"
              >
                {api.cta2}
              </a>
            ) : (
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white text-[15px] font-medium active:scale-[0.97] hover:bg-white/5 transition-all duration-300"
              >
                {api.cta2}
              </button>
            )}
          </div>

        </div>

        {/* Right column — image + stats */}
        {api.image && (
          <div
            className={`lg:flex-1 hidden lg:flex flex-col gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{ transitionDelay: ".5s" }}
          >
            <div className="relative w-full">
              <div
                className="absolute -inset-8 rounded-3xl opacity-20 blur-3xl"
                style={{ background: `radial-gradient(ellipse at center, ${YELLOW_GLOW}0.6), transparent 70%)` }}
                aria-hidden
              />
              <img
                src={resolveMediaUrl(api.image)}
                alt=""
                className="relative z-10 w-full h-auto max-h-[50vh] object-contain object-top drop-shadow-2xl"
              />
            </div>
            {api.stats.length > 0 && (
              <div
                className={`pt-8 border-t border-white/8 grid grid-cols-2 gap-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: ".7s" }}
              >
                {api.stats.map((stat, i) => (
                  <div key={i} className="cursor-default text-center">
                    <div
                      className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 transition-colors duration-300"
                      onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/30 text-[11px] sm:text-xs uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-bounce"
        style={{ animationDuration: "2s" }}
      >
        <span className="text-white/20 text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <svg
          className="w-4 h-4 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────────────────── */
function HowItWorksSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].how;
  const title = api.title as [string, string] | string[];
  const { ref, visible } = useReveal();

  const icons = [
    <svg
      key={0}
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>,
    <svg
      key={1}
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
      />
    </svg>,
    <svg
      key={2}
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>,
  ];

  return (
    <section id="how-it-works" className="bg-white py-14 sm:py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={ref}>
          <div
            className={`text-center mb-10 sm:mb-14 lg:mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: YELLOW_DARK }}
            >
              {api.label}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-4 sm:mb-6">
              {title[0]}
              {title[1] ? (
                <>
                  <br />
                  {title[1]}
                </>
              ) : null}
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {api.steps.map((step, i) => (
              <div
                key={i}
                className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: visible ? `${i * 120}ms` : "0ms" }}
              >
                {i < api.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-1.5rem)] w-[calc(100%-3rem)] h-px bg-gradient-to-r from-neutral-200 to-transparent z-0" />
                )}
                <div className="relative bg-neutral-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral-100">
                  <span className="absolute top-5 right-5 sm:top-6 sm:right-6 text-3xl sm:text-4xl font-black text-neutral-100 select-none">
                    0{i + 1}
                  </span>
                  <div
                    className="w-11 h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 overflow-hidden"
                    style={{
                      background: step.icon ? "transparent" : `${YELLOW_GLOW}0.12)`,
                      color: YELLOW_DARK,
                    }}
                  >
                    {step.icon ? (
                      <img src={resolveMediaUrl(step.icon)} alt="" className="w-full h-full object-contain" />
                    ) : icons[i]}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 text-sm sm:text-[15px] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Payment Methods ─────────────────────────────────────── */
function PaymentSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].payments;
  const title = api.title as [string, string] | string[];
  const { ref, visible } = useReveal();

  const banks = api.banks;

  const qrIcon = (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6"
      style={{ color: YELLOW }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
      />
    </svg>
  );
  const stickerIcon = (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6"
      style={{ color: YELLOW }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );

  return (
    <section
      id="payments"
      className="py-14 sm:py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(160deg,#0a0800 0%,#0e0c00 60%,#0a0800 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={ref}>
          <div
            className={`text-center mb-10 sm:mb-14 lg:mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: YELLOW }}
            >
              {api.label}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
              {title[0]}
              {title[1] ? (
                <>
                  <br />
                  {title[1]}
                </>
              ) : null}
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.1s" }}
          >
            {[
              {
                icon: qrIcon,
                title: api.qpayTitle,
                badge: api.qpayBadge,
                desc: api.qpayDesc,
              },
              {
                icon: stickerIcon,
                title: api.stickerTitle,
                badge: api.stickerBadge,
                desc: api.stickerDesc,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/8 bg-white/4 flex gap-4 items-start"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${YELLOW_GLOW}0.15)` }}
                >
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="text-white font-bold text-base sm:text-lg">
                      {card.title}
                    </h3>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        background: `${YELLOW_GLOW}0.18)`,
                        color: YELLOW,
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm sm:text-[14px] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            {banks.map((bank, i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl border border-white/6 bg-white/3 p-3 sm:p-5 flex flex-col items-center text-center"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/8 flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
                  {bank.image ? (
                    <img
                      src={resolveMediaUrl(bank.image)}
                      alt={bank.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span
                      className="font-black text-xs sm:text-sm"
                      style={{ color: YELLOW }}
                    >
                      {bank.name[0]}
                    </span>
                  )}
                </div>
                <p className="text-white/80 font-semibold text-[11px] sm:text-[13px] leading-tight">
                  {bank.name}
                </p>
                <p className="text-white/25 text-[9px] sm:text-[11px] mt-0.5 leading-tight">
                  {bank.sub}
                </p>
              </div>
            ))}
          </div>
          <p
            className={`text-center text-white/25 text-xs sm:text-[13px] mt-4 sm:mt-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.3s" }}
          >
            {api.note}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────── */
const FEATURE_ICONS = [
  // 1. Auto Barrier
  <svg
    key={0}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>,
  // 2. Payments / qPay
  <svg
    key={1}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>,
  // 3. Sticker QR
  <svg
    key={2}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
    />
  </svg>,
  // 4. 24/7 support
  <svg
    key={3}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>,
  // 5. Analytics
  <svg
    key={4}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
    />
  </svg>,
  // 6. Automated Staff-free
  <svg
    key={5}
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>,
];

function FeaturesSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].features;
  const { ref, visible } = useReveal();

  const features = (api.items || []).filter(
    (item) => (item.title && item.title.trim() !== "") || item.image,
  );

  if (features.length === 0) return null;

  return (
    <section id="features" className="bg-neutral-50 py-14 sm:py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={ref}>
          <div
            className={`text-center mb-10 sm:mb-16 md:mb-24 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p
              className="text-[28px] sm:text-4xl md:text-5xl lg:text-[72px] font-black tracking-tight mb-3 sm:mb-4"
              style={{ color: YELLOW_DARK }}
            >
              {api.label}
            </p>
            <h2
              className="text-[28px] sm:text-4xl md:text-5xl lg:text-[72px] font-black tracking-tight mb-3 sm:mb-4"
              style={{
                background:
                  "linear-gradient(135deg,#1a1a1a 0%,#3d3d3d 40%,#f6b414 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {api.title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.3)" }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: YELLOW }}
              />
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.3)" }}
              />
            </div>
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-auto">
            {features.map((item, idx) => {
              const hasImage = !!item.image;
              const isLarge = item.size === "large";
              const isMedium = item.size === "medium";

              return (
                <div
                  key={idx}
                  className={`
                    relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden border transition-all duration-700
                    ${isLarge ? "md:col-span-2 md:row-span-2 min-h-[260px] sm:min-h-[320px] md:min-h-[360px]" : ""}
                    ${isMedium ? "md:col-span-2 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]" : ""}
                    ${!isLarge && !isMedium ? "min-h-[180px] sm:min-h-[210px] md:min-h-[240px]" : ""}
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                    ${
                      hasImage
                        ? "border-neutral-800 text-white bg-neutral-900"
                        : "bg-white border-neutral-150 text-neutral-800"
                    }
                  `}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  {hasImage && (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={resolveMediaUrl(item.image!)}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent" />
                    </div>
                  )}

                  {!hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] to-transparent" />
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      {!hasImage && (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-[0_4px_12px_rgba(246,180,20,0.15)]"
                          style={{
                            background: `linear-gradient(135deg, ${YELLOW}, #ffc93c)`,
                            color: "#1a0f00",
                          }}
                        >
                          {item.icon ? (
                            <img src={resolveMediaUrl(item.icon)} alt="" className="w-full h-full object-contain" />
                          ) : FEATURE_ICONS[idx % FEATURE_ICONS.length]}
                        </div>
                      )}

                      {hasImage && (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)]">
                          {item.icon ? (
                            <img src={resolveMediaUrl(item.icon)} alt="" className="w-full h-full object-contain" />
                          ) : FEATURE_ICONS[idx % FEATURE_ICONS.length]}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3
                        className={`font-black tracking-tight leading-snug mb-3
                          ${hasImage ? "text-white" : "text-neutral-900"}
                          ${isLarge ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"}
                        `}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-sm sm:text-base font-medium leading-relaxed ${hasImage ? "text-white/70" : "text-neutral-500"}`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
function BolomjuudSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].bolomjuud;
  const { ref, visible } = useReveal();

  if (!api || !api.items || api.items.length === 0) return null;

  const items = api.items.filter(
    (item) => (item.title && item.title.trim() !== "") || item.image,
  );

  if (items.length === 0) return null;

  return (
    <section
      id="bolomjuud"
      className="py-14 sm:py-24 lg:py-32 relative z-10 px-5 sm:px-10 lg:px-16"
      style={{
        background:
          "linear-gradient(140deg, #0a0800 0%, #110e02 55%, #050400 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref}>
          <div
            className={`text-center mb-16 md:mb-24 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: YELLOW }}
            >
              {api.label || (lang === "mn" ? "Боломжууд" : "Opportunities")}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
              {api.title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.3)" }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: YELLOW }}
              />
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.3)" }}
              />
            </div>
            <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>

          <div className="space-y-16 md:space-y-28">
            {items.map((item, idx) => (
              <BolomjuudRow key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BolomjuudRow({ item, index }: { item: any; index: number }) {
  const { ref, visible } = useReveal();
  const isEven = index % 2 === 0;
  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-6 sm:gap-8 md:gap-12 lg:gap-20`}
    >
      <div
        className={`flex-1 transition-all duration-1000 ${
          visible
            ? "opacity-100 translate-x-0"
            : isEven
              ? "opacity-0 -translate-x-12"
              : "opacity-0 translate-x-12"
        }`}
      >
        <div
          className="w-10 h-1 mb-6 rounded-full"
          style={{ backgroundColor: YELLOW }}
        />
        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
          {item.title}
        </h3>
        <p className="text-white/40 text-sm sm:text-base font-medium leading-relaxed mb-6">
          {item.desc}
        </p>
      </div>
      <div
        className={`flex-1 relative w-full transition-all duration-1000 delay-200 ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <div
          className="absolute inset-0 blur-[60px] rounded-full"
          style={{ background: `${YELLOW_GLOW}0.15)` }}
        />
        <div className="relative aspect-[4/3] w-full rounded-[20px] md:rounded-[32px] overflow-hidden">
          {item.image ? (
            <img
              src={resolveMediaUrl(item.image)}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChevronRight size={60} className="text-white/5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Pricing ─────────────────────────────────────────────── */
function PricingSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].pricing;
  const { ref, visible } = useReveal();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const highlight = [false, true, false];

  const hasTiers =
    api.tiers.length > 0 &&
    api.tiers.some((t) => t.name?.trim() || t.slots?.trim());
  if (!hasTiers) return null;

  return (
    <section id="pricing" className="bg-white py-14 sm:py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={ref}>
          <div
            className={`text-center mb-10 sm:mb-14 lg:mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p
              className="text-lg font-semibold uppercase tracking-widest mb-4"
              style={{ color: YELLOW_DARK }}
            >
              {api.label}
            </p>
            <h2
              className="text-[36px] sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight mb-3 sm:mb-4"
              style={{
                background:
                  "linear-gradient(135deg,#1a1a1a 0%,#3d3d3d 40%,#f6b414 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {api.title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.5)" }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: YELLOW }}
              />
              <div
                className="h-px w-12 rounded-full"
                style={{ background: YELLOW_GLOW + "0.5)" }}
              />
            </div>
            <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-start">
            {api.tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-[32px] sm:rounded-[40px] md:rounded-[48px] p-6 sm:p-8 md:p-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${highlight[i] ? "bg-neutral-900 md:scale-[1.03] md:-mt-2" : "bg-neutral-50 border border-neutral-150"}`}
                style={{
                  transitionDelay: visible ? `${i * 100}ms` : "0ms",
                  ...(highlight[i]
                    ? {
                        border: `2px solid ${YELLOW_GLOW}0.45)`,
                        boxShadow: `0 20px 60px ${YELLOW_GLOW}0.12)`,
                      }
                    : {}),
                }}
              >
                {/* Discount badges — top-right corner */}
                {tier.discounts && tier.discounts.length > 0 && (
                  <div className="absolute -top-3 -right-3 flex flex-col items-end gap-1.5 z-20">
                    {tier.discounts.map(
                      (d: { label: string; color?: string }, di: number) => (
                        <div
                          key={di}
                          className="px-3 py-1.5 rounded-full text-white text-[10px] font-black shadow-lg uppercase whitespace-nowrap"
                          style={{
                            backgroundColor: d.color
                              ? d.color.startsWith("#")
                                ? d.color
                                : `#${d.color}`
                              : "#7c3aed",
                          }}
                        >
                          {d.label}
                        </div>
                      ),
                    )}
                  </div>
                )}
                {highlight[i] && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide"
                      style={{
                        background: YELLOW,
                        color: "#1a0f00",
                        boxShadow: `0 4px 14px ${YELLOW_GLOW}0.4)`,
                      }}
                    >
                      {api.mostPopular}
                    </span>
                  </div>
                )}
                <div className="mb-5 sm:mb-6 text-center">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: highlight[i] ? YELLOW : "#888" }}
                  >
                    {tier.name}
                  </p>
                  <p
                    className={`text-[13px] mb-3 break-all w-full ${highlight[i] ? "text-white/40" : "text-neutral-400"}`}
                  >
                    {tier.slots}
                  </p>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {tier.features.map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-2.5 text-sm sm:text-[14px] ${highlight[i] ? "text-white/70" : "text-neutral-600"}`}
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: YELLOW }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kholbooBarikh"
                  onClick={handleAnchorScroll}
                  className={
                    highlight[i]
                      ? "block text-center text-[14px] font-semibold py-3 rounded-xl sm:rounded-2xl"
                      : "block text-center text-[14px] font-semibold py-3 rounded-xl sm:rounded-2xl bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300"
                  }
                  style={
                    highlight[i]
                      ? {
                          background: YELLOW,
                          color: "#1a0f00",
                          boxShadow: `0 8px 24px ${YELLOW_GLOW}0.3)`,
                        }
                      : {}
                  }
                >
                  {api.ctaBtn}
                </a>
              </div>
            ))}
          </div>

          <p
            className={`text-center text-neutral-400 text-sm mt-8 sm:mt-10 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.35s" }}
          >
            {api.note}{" "}
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="font-medium hover:underline focus:outline-none"
              style={{ color: YELLOW_DARK }}
            >
              {api.quoteBtn}
            </button>
          </p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuoteModalOpen(false)}
          />
          <div className="relative bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center border"
              style={{ backgroundColor: `${YELLOW}18`, borderColor: `${YELLOW}40` }}
            >
              <svg className="w-8 h-8" style={{ color: YELLOW }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
              {lang === "mn" ? "Тун удахгүй" : "Coming Soon"}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
              {lang === "mn"
                ? "Энэхүү үйлчилгээ одоогоор хөгжүүлэлтийн шатанд байна. Бид удахгүй бэлэн болгох болно."
                : "This service is currently under development. We will make it available very soon."}
            </p>
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(90deg, ${YELLOW}, #ffd35c)`,
                color: "#1a0f00",
                boxShadow: `0 4px 20px rgba(246,180,20,0.25)`,
              }}
            >
              {lang === "mn" ? "Ойлголоо" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Free Driver ─────────────────────────────────────────── */
function FreeDriverSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].free;
  const { ref, visible } = useReveal();

  if (api.hidden) return null;

  return (
    <section
      className="py-14 sm:py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(135deg,#120d00 0%,#1e1500 50%,#120d00 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
              style={{
                background: `${YELLOW_GLOW}0.1)`,
                border: `1px solid ${YELLOW_GLOW}0.2)`,
              }}
            >
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                style={{ color: YELLOW }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-[28px] sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 sm:mb-6">
              {api.title}
            </h2>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 font-light max-w-xl mx-auto">
              {api.desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {api.cards.map((card, i) => (
                <div
                  key={i}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{
                    transitionDelay: visible ? `${i * 100 + 150}ms` : "0ms",
                    background: `${YELLOW_GLOW}0.06)`,
                    border: `1px solid ${YELLOW_GLOW}0.12)`,
                  }}
                >
                  <p className="text-white font-bold text-sm sm:text-[15px] mb-1">
                    {card.label}
                  </p>
                  <p className="text-white/35 text-xs">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA (Lead Form) ─────────────────────────────────────── */
function CtaSection({ globalContact }: { globalContact?: GlobalContactInfo }) {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].cta;
  return (
    <LeadFormSection
      systemName="ParkEase"
      accentColor={YELLOW}
      title={api.title}
      subtitle={api.btn}
      body={api.desc}
      emailLabel={globalContact?.emailLabel || api.emailLabel}
      contactEmail={globalContact?.email || api.email}
      phoneLabel={globalContact?.phoneLabel || api.phoneLabel}
      phone={globalContact?.phone || api.phone}
      locationLabel={globalContact?.locationLabel || api.locationLabel}
      location={globalContact?.location || api.location}
      locationUrl={globalContact?.locationUrl}
    />
  );
}

/* ── Page wrapper ────────────────────────────────────────── */
export default function ParkEaseClient({
  initialMn,
  initialEn,
  globalContact,
}: {
  initialMn: ParkEaseSections;
  initialEn: ParkEaseSections;
  globalContact?: GlobalContactInfo;
}) {
  const { lang, setSections } = useParkEaseLang();

  const currentSections = lang === "mn" ? initialMn : initialEn;
  const features = (currentSections.features?.items || []).filter(
    (item) => (item.title && item.title.trim() !== "") || item.image,
  );
  const bolomjuud = (currentSections.bolomjuud?.items || []).filter(
    (item) => (item.title && item.title.trim() !== "") || item.image,
  );

  useEffect(() => {
    setSections({
      features: features.length > 0,
      bolomjuud: bolomjuud.length > 0,
    });
  }, [features.length, bolomjuud.length, setSections]);

  return (
    <AdminCtx.Provider value={{ mn: initialMn, en: initialEn }}>
      <HeroSection />
      <HowItWorksSection />
      <PaymentSection />
      <FeaturesSection />
      <BolomjuudSection />
      <PricingSection />
      <FreeDriverSection />
      <CtaSection globalContact={globalContact} />
    </AdminCtx.Provider>
  );
}
