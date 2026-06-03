"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";
import { GlobalContactInfo, PosEaseSections } from "@/lib/site-content-types";
import LeadFormSection from "@/components/sections/LeadFormSection";
import SplineScene from "@/components/spline/SplineScene";
import { resolveMediaUrl } from "@/lib/media";

const PINK = "rgb(255, 68, 105)";
const PINK_GLOW = "rgba(255, 68, 105, 0.5)";

/* ── Fallback Defaults ───────────────────────────────────── */
const DEFAULTS: { en: PosEaseSections; mn: PosEaseSections } = {
  en: {
    hero: {
      title: "Point of Sale.",
      titleAccent: "Perfected.",
      desc: "PosEase is an ultra-modern, cloud-native POS system designed for the future of retail and hospitality. Fast, intuitive, and beautiful.",
      cta: "Request Early Access",
    },
    features: {
      title: "Everything you need.",
      desc: "Designed to be powerful enough for enterprises, yet simple enough for a single shop.",
      items: [
        {
          title: "Real-time Sync",
          desc: "Your data is always live across every terminal and office.",
          size: "large",
        },
        {
          title: "Global Inventory",
          desc: "Manage stock levels across 100+ locations effortlessly.",
          size: "small",
        },
        {
          title: "Offline Core",
          desc: "Transaction engine that never stops, even without internet.",
          size: "small",
        },
        {
          title: "Smart Analytics",
          desc: "AI-driven insights to predict your best selling days.",
          size: "medium",
        },
        {
          title: "Universal Pay",
          desc: "Accept QPay, Cards, and Crypto with zero extra hardware.",
          size: "medium",
        },
      ],
    },
    hardware: {
      title: "Hardware that inspires.",
      items: [
        {
          name: "PosEase Air",
          desc: "The thinnest POS terminal ever made.",
          label: "Mobile",
        },
        {
          name: "PosEase Hub",
          desc: "The centerpiece of your store counter.",
          label: "Station",
        },
        {
          name: "Kitchen Vision",
          desc: "Perfect clarity for the busiest kitchens.",
          label: "Display",
        },
      ],
    },
    pricing: {
      label: "Pricing",
      title: "Simple. Transparent.",
      desc: "Choose the plan that fits your business.",
      mostPopular: "Most Popular",
      ctaBtn: "Get Started",
      note: "Need something custom?",
      quoteBtn: "Contact us →",
      tiers: [
        { name: "Solo", price: "Free", features: ["Single terminal", "Basic sales reports", "Email support"], discounts: [] },
        { name: "Studio", price: "$49", features: ["Up to 5 terminals", "Advanced reports", "Priority support", "Cloud sync"], discounts: [] },
        { name: "Enterprise", price: "Custom", features: ["Unlimited terminals", "Custom integrations", "24/7 support", "Dedicated manager"], discounts: [] },
      ],
    },
  },
  mn: {
    hero: {
      title: "POS Систем.",
      titleAccent: "Төгс шийдэл.",
      desc: "PosEase бол орчин үеийн, үүлэн технологид суурилсан, ирээдүйн худалдаа үйлчилгээнд зориулсан систем юм. Хурдан, ойлгомжтой, гоёмсог.",
      cta: "Хүсэлт илгээх",
    },
    features: {
      title: "Танд хэрэгтэй бүх зүйл.",
      desc: "Томоохон аж ахуйн нэгжид ч, жижиг дэлгүүрт ч төгс тохирох хүчирхэг бөгөөд энгийн шийдэл.",
      items: [
        {
          title: "Шууд Синхрончлол",
          desc: "Бүх салбар болон оффисын өгөгдөл үргэлж хамт шинэчлэгдэнэ.",
          size: "large",
        },
        {
          title: "Барааны Бүртгэл",
          desc: "100+ байршил дахь барааны үлдэгдлийг төвөггүй удирдана.",
          size: "small",
        },
        {
          title: "Офлайн Цөм",
          desc: "Интернэтгүй үед ч гүйлгээ хэзээ ч зогсохгүй.",
          size: "small",
        },
        {
          title: "Ухаалаг Аналитик",
          desc: "Борлуулалтын өгөгдөлд суурилсан хиймэл оюуны зөвлөмжүүд.",
          size: "medium",
        },
        {
          title: "Бүх төрлийн Төлбөр",
          desc: "QPay, Карт болон Крпито төлбөрийг нэмэлт төхөөрөмжгүй авна.",
          size: "medium",
        },
      ],
    },
    hardware: {
      title: "Урам зориг өгөх төхөөрөмжүүд.",
      items: [
        {
          name: "PosEase Air",
          desc: "Хамгийн нимгэн POS терминал.",
          label: "Мобайл",
        },
        {
          name: "PosEase Hub",
          desc: "Таны дэлгүүрийн төв цэг.",
          label: "Станц",
        },
        {
          name: "Kitchen Vision",
          desc: "Завгүй гал тогоонд зориулсан тунгалаг дэлгэц.",
          label: "Дэлгэц",
        },
      ],
    },
    pricing: {
      label: "Үнэ тариф",
      title: "Энгийн. Ил тод.",
      desc: "Бизнестээ тохирох багцаа сонгоно уу.",
      mostPopular: "Хамгийн алдартай",
      ctaBtn: "Эхлэх",
      note: "Тусгай шийдэл хэрэгтэй юу?",
      quoteBtn: "Холбоо барих →",
      tiers: [
        { name: "Solo", price: "Үнэгүй", features: ["Ганц терминал", "Үндсэн борлуулалтын тайлан", "Имэйл дэмжлэг"], discounts: [] },
        { name: "Studio", price: "$49", features: ["5 хүртэлх терминал", "Дэлгэрэнгүй тайлан", "Тэргүүлэх дэмжлэг", "Үүлэн синк"], discounts: [] },
        { name: "Enterprise", price: "Захиалгат", features: ["Хязгааргүй терминал", "Тусгай интеграц", "24/7 дэмжлэг", "Хувийн менежер"], discounts: [] },
      ],
    },
  },
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

interface PosEasePageClientProps {
  initialMn: PosEaseSections;
  initialEn: PosEaseSections;
  globalContact?: GlobalContactInfo;
}

export default function PosEaseClient({
  initialMn,
  initialEn,
  globalContact,
}: PosEasePageClientProps) {
  const { lang } = usePosEaseLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mount flag — SplineScene renders once and never remounts

  const data = lang === "mn" ? initialMn : initialEn;
  const defaults = DEFAULTS[lang];

  // Clean data
  const featuresItems = (data.features.items || []).filter(
    (i) => (i.title && i.title.trim() !== "") || i.image,
  );
  const hardwareItems = (data.hardware.items || []).filter(
    (i) => i.name && i.name.trim() !== "",
  );
  const pricingTiers = (data.pricing.tiers || []).filter(
    (i) => i.name && i.name.trim() !== "",
  );

  // Particle canvas
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
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,68,105,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const hero = {
    title: data.hero.title || defaults.hero.title,
    titleAccent: data.hero.titleAccent || defaults.hero.titleAccent,
    desc: data.hero.desc || defaults.hero.desc,
    cta: data.hero.cta || defaults.hero.cta,
    image: data.hero.image || defaults.hero.image,
  };

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-lg mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <main className="bg-[#0a0a0a] selection:bg-[rgb(255,68,105)] selection:text-white min-h-screen relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div
          className="absolute top-[-25%] left-[-15%] w-[80%] h-[70%] rounded-full bg-[rgb(255,68,105)]/20 blur-[180px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/15 blur-[150px] animate-pulse"
          style={{ animationDuration: "9s" }}
        />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[rgb(255,68,105)]/10 blur-[120px]" />
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,68,105,0.4) 0%, transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-[100vh] pointer-events-none z-[5]"
        aria-hidden
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 pt-36 sm:pt-48 pb-20 overflow-hidden z-10">
        <div className="relative z-10 max-w-[1000px] w-full">
          <h1 className="display-xl text-white mb-8">
            {hero.title}
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-white to-pink-500 text-transparent bg-clip-text animate-gradient">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="body-lg text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="#kholbooBarikh"
              className="group relative px-12 py-5 rounded-full bg-[rgb(255,68,105)] text-white font-black text-lg hover:scale-[1.05] active:scale-95 transition-all duration-500 shadow-[0_10px_40px_rgba(255,68,105,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3">
                {hero.cta}{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Spline 3D scene — seamless, full screen, no frame */}
        <div className="relative mt-10 w-full z-10" style={{ height: "100vh" }}>
          <SplineScene />
        </div>
      </section>

      {/* ── Features ── */}
      {featuresItems.length > 0 && (
        <section id="features" className="py-24 sm:py-40 relative z-10 px-6">
          <FeaturesContent
            title={data.features.title}
            desc={data.features.desc}
            items={featuresItems}
          />
        </section>
      )}

      {/* ── Hardware ── */}
      {hardwareItems.length > 0 && (
        <section
          id="hardware"
          className="py-24 sm:py-40 relative z-10 overflow-hidden"
        >
          <HardwareContent
            title={data.hardware.title}
            items={hardwareItems}
            gridClass={getGridCols(hardwareItems.length)}
          />
        </section>
      )}

      {/* ── Pricing ── */}
      {pricingTiers.length > 0 && (
        <section id="pricing" className="py-14 sm:py-24 lg:py-32 relative z-10 px-6">
          <PricingContent
            pricing={data.pricing}
            defaults={defaults.pricing}
            tiers={pricingTiers}
          />
        </section>
      )}

      {/* ── Contact ── */}
      <LeadFormSection
        systemName="PosEase"
        accentColor={PINK}
        emailLabel={globalContact?.emailLabel}
        contactEmail={globalContact?.email}
        phoneLabel={globalContact?.phoneLabel}
        phone={globalContact?.phone}
        locationLabel={globalContact?.locationLabel}
        location={globalContact?.location}
        locationUrl={globalContact?.locationUrl}
      />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Section sub-components                                      */
/* ─────────────────────────────────────────────────────────── */

function FeaturesContent({
  title,
  desc,
  items,
}: {
  title: string;
  desc: string;
  items: any[];
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto">
      <div
        className={`mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="w-20 h-1.5 bg-[rgb(255,68,105)] rounded-full mb-10 shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
        <h2 className="display-lg text-white mb-10">{title}</h2>
        <p className="body-lg text-white/40 max-w-3xl leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 sm:auto-rows-[280px]">
        {items.map((item, i) => (
          <div
            key={i}
            className={`
              group relative rounded-[28px] sm:rounded-[48px] p-6 sm:p-10 overflow-hidden border border-white/5 bg-neutral-900/20 backdrop-blur-3xl transition-all duration-700
              ${item.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
              ${item.size === "medium" ? "md:col-span-2" : ""}
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              hover:border-[rgb(255,68,105)]/30 hover:shadow-[0_20px_60px_rgba(255,68,105,0.1)]
            `}
            style={{ transitionDelay: `${i * 100}ms`, minHeight: "200px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(255,68,105)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {item.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={resolveMediaUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>
            )}
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(255,68,105)]/10 border border-[rgb(255,68,105)]/20 flex items-center justify-center mb-4 sm:mb-8 group-hover:scale-110 group-hover:bg-[rgb(255,68,105)]/30 transition-all duration-500 shadow-[0_0_30px_rgba(255,68,105,0.1)]">
                <div className="w-3 h-3 rounded-full bg-[rgb(255,68,105)] shadow-[0_0_20px_rgba(255,68,105,1)]" />
              </div>
              <h3
                className={`font-black text-white mb-3 leading-tight ${item.size === "large" ? "text-2xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl md:text-3xl"}`}
              >
                {item.title}
              </h3>
              <p className="text-white/40 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardwareContent({
  title,
  items,
  gridClass,
}: {
  title: string;
  items: any[];
  gridClass: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto px-6">
      <div
        className={`text-center mb-24 transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <h2 className="display-lg text-white mb-4">{title}</h2>
        <div className="w-24 h-1.5 bg-[rgb(255,68,105)] mx-auto rounded-full shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
      </div>
      <div className={`grid ${gridClass} gap-12 sm:gap-20`}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
            style={{ transitionDelay: `${i * 200}ms` }}
          >
            <div className="relative w-full aspect-square mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(255,68,105)]/30 to-violet-500/30 rounded-[80px] blur-[60px] opacity-60 group-hover:opacity-100 group-hover:blur-[80px] transition-all duration-1000" />
              <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-6 transition-transform duration-700 overflow-hidden">
                {item.image ? (
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                  />
                ) : (
                  <span className="text-[rgb(255,68,105)]/10 text-[80px] sm:text-[140px] md:text-[180px] font-black">
                    {i + 1}
                  </span>
                )}
              </div>
              <div className="absolute -top-4 -right-4 px-6 py-2 rounded-full bg-[rgb(255,68,105)] shadow-[0_10px_30px_rgba(255,68,105,0.4)]">
                <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">
                  {item.label}
                </span>
              </div>
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight">
              {item.name}
            </h3>
            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xs">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const ACCENT = "rgb(255,68,105)";
const ACCENT_HEX = "#ff4469";

function PricingContent({
  pricing,
  defaults,
  tiers,
}: {
  pricing: any;
  defaults: any;
  tiers: any[];
}) {
  const { ref, visible } = useReveal();
  const highlight = tiers.length === 3 ? [false, true, false] : tiers.map((_, i) => i === Math.floor(tiers.length / 2) && tiers.length > 1);
  const label = pricing.label || defaults.label;
  const title = pricing.title || defaults.title;
  const desc = pricing.desc || defaults.desc;
  const mostPopular = pricing.mostPopular || defaults.mostPopular;
  const ctaBtn = pricing.ctaBtn || defaults.ctaBtn;
  const note = pricing.note || defaults.note;
  const quoteBtn = pricing.quoteBtn || defaults.quoteBtn;

  return (
    <div ref={ref} className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
      <div className={`text-center mb-10 sm:mb-14 lg:mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {label && (
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
            {label}
          </p>
        )}
        <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
          {title}
        </h2>
        {desc && <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light">{desc}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-start">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${highlight[i] ? "bg-neutral-900 md:scale-[1.03] md:-mt-2" : "bg-white/5 border border-white/10"}`}
            style={{
              transitionDelay: visible ? `${i * 100}ms` : "0ms",
              ...(highlight[i] ? { border: `2px solid ${ACCENT_HEX}72`, boxShadow: `0 20px 60px ${ACCENT_HEX}1f` } : {}),
            }}
          >
            {tier.discounts && tier.discounts.length > 0 && (
              <div className="absolute -top-3 -right-3 flex flex-col items-end gap-1.5 z-20">
                {tier.discounts.map((d: { label: string; color?: string }, di: number) => (
                  <div key={di} className="px-3 py-1.5 rounded-full text-white text-[10px] font-black shadow-lg uppercase whitespace-nowrap" style={{ backgroundColor: d.color || "#7c3aed" }}>
                    {d.label}
                  </div>
                ))}
              </div>
            )}
            {highlight[i] && mostPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide" style={{ background: ACCENT, color: "#fff", boxShadow: `0 4px 14px ${ACCENT_HEX}66` }}>
                  {mostPopular}
                </span>
              </div>
            )}
            <div className="mb-5 sm:mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: highlight[i] ? ACCENT : "#888" }}>
                {tier.name}
              </p>
              <p className={`text-[13px] mb-3 ${highlight[i] ? "text-white/40" : "text-white/30"}`}>{tier.price}</p>
            </div>
            {(tier.features || []).length > 0 && (
              <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                {(tier.features as string[]).map((f, j) => (
                  <li key={j} className={`flex items-start gap-2.5 text-sm sm:text-[14px] ${highlight[i] ? "text-white/70" : "text-white/50"}`}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="#kholbooBarikh"
              className={`block text-center text-[14px] font-semibold py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${highlight[i] ? "" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
              style={highlight[i] ? { background: ACCENT, color: "#fff", boxShadow: `0 8px 24px ${ACCENT_HEX}4d` } : {}}
            >
              {ctaBtn || "Get Started"}
            </Link>
          </div>
        ))}
      </div>

      {(note || quoteBtn) && (
        <p className={`text-center text-white/30 text-sm mt-8 sm:mt-10 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.35s" }}>
          {note}{" "}
          {quoteBtn && (
            <Link href="#kholbooBarikh" className="font-medium hover:underline" style={{ color: ACCENT }}>
              {quoteBtn}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
