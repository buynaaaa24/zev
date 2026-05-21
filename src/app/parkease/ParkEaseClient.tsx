"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParkEaseLang } from "@/contexts/ParkEaseLangContext";
import LeadFormSection from "@/components/sections/LeadFormSection";
import type { ParkEaseSections } from "@/lib/site-content-types";

const YELLOW = "#f6b414";
const YELLOW_DARK = "#d99a0e";
const YELLOW_GLOW = "rgba(246,180,20,";

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
  pricing: {
    label: "",
    title: "",
    desc: "",
    mostPopular: "",
    ctaBtn: "",
    note: "",
    quoteBtn: "",
    tiers: [],
  },
  free: { title: "", desc: "", cards: [] },
  cta: { title: "", desc: "", btn: "", emailLabel: "", email: "", phoneLabel: "", phone: "", locationLabel: "", location: "" },
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
          <Link
            href="#kholbooBarikh"
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
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white text-[15px] font-medium active:scale-[0.97] transition-all duration-300"
          >
            {api.cta2}
          </button>
        </div>

        <div
          className={`mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: ".6s" }}
        >
          {api.stats.map((stat, i) => (
            <div key={i} className="cursor-default">
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
                    className="w-11 h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                    style={{
                      background: `${YELLOW_GLOW}0.12)`,
                      color: YELLOW_DARK,
                    }}
                  >
                    {icons[i]}
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
                      src={bank.image}
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
function FeaturesSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].features;
  const { ref, visible } = useReveal();

  const icons = [
    <svg
      key={0}
      className="w-5 h-5 sm:w-6 sm:h-6"
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
    <svg
      key={1}
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>,
    <svg
      key={2}
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>,
    <svg
      key={3}
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>,
    <svg
      key={4}
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>,
    <svg
      key={5}
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>,
  ];

  return (
    <section id="features" className="bg-neutral-50 py-14 sm:py-24 lg:py-32">
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
              {api.title}
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {api.items.map((f, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-neutral-100 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: visible ? `${i * 80}ms` : "0ms" }}
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
                  style={{
                    background: `${YELLOW_GLOW}0.1)`,
                    color: YELLOW_DARK,
                  }}
                >
                  {icons[i % icons.length]}
                </div>
                <h3 className="text-base sm:text-[17px] font-bold text-neutral-900 mb-2 sm:mb-3 leading-snug">
                  {f.title}
                </h3>
                <p className="text-neutral-500 text-sm sm:text-[14px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────── */
function PricingSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].pricing;
  const { ref, visible } = useReveal();

  const highlight = [false, true, false];

  return (
    <section id="pricing" className="bg-white py-14 sm:py-24 lg:py-32">
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
              {api.title}
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light">
              {api.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-start">
            {api.tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${highlight[i] ? "bg-neutral-900 md:scale-[1.03] md:-mt-2" : "bg-neutral-50 border border-neutral-150"}`}
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
                <div className="mb-5 sm:mb-6">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: highlight[i] ? YELLOW : "#888" }}
                  >
                    {tier.name}
                  </p>
                  <p
                    className={`text-[13px] mb-3 ${highlight[i] ? "text-white/40" : "text-neutral-400"}`}
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
                <Link
                  href="#kholbooBarikh"
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
                </Link>
              </div>
            ))}
          </div>

          <p
            className={`text-center text-neutral-400 text-sm mt-8 sm:mt-10 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.35s" }}
          >
            {api.note}{" "}
            <Link
              href="#kholbooBarikh"
              className="font-medium hover:underline"
              style={{ color: YELLOW_DARK }}
            >
              {api.quoteBtn}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Free Driver ─────────────────────────────────────────── */
function FreeDriverSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].free;
  const { ref, visible } = useReveal();

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
function CtaSection() {
  const { lang } = useParkEaseLang();
  const api = useContext(AdminCtx)[lang].cta;
  return (
    <LeadFormSection
      systemName="ParkEase"
      accentColor={YELLOW}
      title={api.title}
      subtitle={api.btn}
      body={api.desc}
      emailLabel={api.emailLabel}
      contactEmail={api.email}
      phoneLabel={api.phoneLabel}
      phone={api.phone}
      locationLabel={api.locationLabel}
      location={api.location}
    />
  );
}

/* ── Page wrapper ────────────────────────────────────────── */
export default function ParkEaseClient({
  initialMn,
  initialEn,
}: {
  initialMn: ParkEaseSections;
  initialEn: ParkEaseSections;
}) {
  return (
    <AdminCtx.Provider value={{ mn: initialMn, en: initialEn }}>
      <HeroSection />
      <HowItWorksSection />
      <PaymentSection />
      <FeaturesSection />
      <PricingSection />
      <FreeDriverSection />
      <CtaSection />
    </AdminCtx.Provider>
  );
}
