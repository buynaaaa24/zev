"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";
import { GlobalContactInfo, PosEaseSections } from "@/lib/site-content-types";
import LeadFormSection from "@/components/sections/LeadFormSection";
import Scene3D from "@/components/scene/Scene3D";
import { resolveMediaUrl } from "@/lib/media";

const PINK = "rgb(255, 68, 105)";
const PINK_GLOW = "rgba(255, 68, 105, 0.5)";

const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      title: "Simple. Transparent.",
      tiers: [
        { name: "Solo", price: "Free", desc: "For single terminal shops." },
        { name: "Studio", price: "$49", desc: "For growing businesses." },
        { name: "Enterprise", price: "Custom", desc: "For global scale." },
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
      title: "Энгийн. Ил тод.",
      tiers: [
        { name: "Solo", price: "Үнэгүй", desc: "Ганц салбартай дэлгүүрт." },
        { name: "Studio", price: "$49", desc: "Өсөн нэмэгдэж буй бизнест." },
        { name: "Enterprise", price: "Захиалгат", desc: "Дэлхийн хэмжээний бизнест." },
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
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-28 sm:pt-36 md:pt-48 pb-10 sm:pb-16 md:pb-20 overflow-hidden z-10">
        <div className="relative z-10 max-w-[1000px] w-full">
          <h1 className="display-xl text-white mb-5 sm:mb-8">
            {hero.title}
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-white to-pink-500 text-transparent bg-clip-text animate-gradient">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="body-lg text-white/50 max-w-2xl mx-auto mb-8 sm:mb-14 leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#kholbooBarikh"
              onClick={handleScroll}
              className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-[rgb(255,68,105)] text-white font-black text-base sm:text-lg hover:scale-[1.05] active:scale-95 transition-all duration-500 shadow-[0_10px_40px_rgba(255,68,105,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {hero.cta}{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </span>
            </a>
          </div>
        </div>

        {/* Custom 3D scene — zero dependencies, full CSS 3D */}
        <div className="relative mt-8 lg:-mt-16 w-full z-10" style={{ height: "clamp(300px, 60vw, 100vh)" }}>
          <Scene3D />
        </div>
      </section>

      {/* ── Features ── */}
      {featuresItems.length > 0 && (
        <section id="features" className="py-10 sm:py-16 md:py-24 lg:py-40 relative z-10 px-5 sm:px-8 md:px-6">
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
          className="py-10 sm:py-16 md:py-24 lg:py-40 relative z-10 overflow-hidden"
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
        <section id="pricing" className="py-10 sm:py-16 md:py-24 lg:py-40 relative z-10 px-5 sm:px-8 md:px-6">
          <PricingContent
            title={data.pricing.title}
            tiers={pricingTiers}
            gridClass={getGridCols(pricingTiers.length)}
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
        className={`mb-10 sm:mb-16 md:mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="w-14 sm:w-20 h-1.5 bg-[rgb(255,68,105)] rounded-full mb-6 sm:mb-10 shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
        <h2 className="display-lg text-white mb-5 sm:mb-10">{title}</h2>
        <p className="body-lg text-white/40 max-w-3xl leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 md:auto-rows-[280px]">
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
        className={`text-center mb-10 sm:mb-16 md:mb-24 transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <h2 className="display-lg text-white mb-4">{title}</h2>
        <div className="w-16 sm:w-24 h-1.5 bg-[rgb(255,68,105)] mx-auto rounded-full shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
      </div>
      <div className={`grid ${gridClass} gap-8 sm:gap-12 md:gap-16 lg:gap-20`}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
            style={{ transitionDelay: `${i * 200}ms` }}
          >
            <div className="relative w-full aspect-square mb-6 sm:mb-10 md:mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(255,68,105)]/30 to-violet-500/30 rounded-[80px] blur-[60px] opacity-60 group-hover:opacity-100 group-hover:blur-[80px] transition-all duration-1000" />
              <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-6 transition-transform duration-700 overflow-hidden">
                {item.image ? (
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                  />
                ) : (
                  <span className="text-[rgb(255,68,105)]/10 text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black">
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
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 tracking-tight">
              {item.name}
            </h3>
            <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed max-w-xs">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingContent({
  title,
  tiers,
  gridClass,
}: {
  title: string;
  tiers: any[];
  gridClass: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto text-center">
      <h2
        className={`display-lg text-white mb-8 sm:mb-14 md:mb-24 transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {title}
      </h2>
      <div className={`grid ${gridClass} gap-4 sm:gap-6 md:gap-10`}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`
              relative p-6 sm:p-10 md:p-12 rounded-[32px] sm:rounded-[48px] md:rounded-[60px] bg-neutral-900/20 border border-white/5 backdrop-blur-3xl text-left flex flex-col items-start
              ${tiers.length === 3 && i === 1 ? "border-[rgb(255,68,105)]/40 md:scale-105 bg-black/40 shadow-[0_30px_100px_rgba(255,68,105,0.15)]" : ""}
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              hover:border-[rgb(255,68,105)]/30 hover:-translate-y-2 transition-all duration-500
            `}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            {tier.discounts && tier.discounts.length > 0 && (
              <div className="absolute -top-3 -right-3 flex flex-col items-end gap-1.5 z-20">
                {tier.discounts.map(
                  (d: { label: string; color?: string }, di: number) => (
                    <div
                      key={di}
                      className="px-3 py-1.5 rounded-full text-white text-[11px] font-black shadow-lg uppercase whitespace-nowrap"
                      style={{ backgroundColor: d.color ? (d.color.startsWith("#") ? d.color : `#${d.color}`) : "#7c3aed" }}
                    >
                      {d.label}
                    </div>
                  ),
                )}
              </div>
            )}
            <div
              className={`px-4 py-1.5 rounded-full mb-5 sm:mb-8 ${tiers.length === 3 && i === 1 ? "bg-[rgb(255,68,105)]" : "bg-white/5 border border-white/10"}`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-[0.3em] ${tiers.length === 3 && i === 1 ? "text-white" : "text-[rgb(255,68,105)]"}`}
              >
                {tier.name}
              </span>
            </div>
            <p className="text-white text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-8 tracking-tighter break-all w-full">
              {tier.price}
            </p>
            <p className="text-white/50 text-sm sm:text-base md:text-lg mb-6 sm:mb-12 font-medium leading-relaxed">
              {tier.desc}
            </p>
            <a
              href="#kholbooBarikh"
              onClick={handleScroll}
              className={`mt-auto w-full py-3 sm:py-5 rounded-2xl sm:rounded-[24px] text-center font-black text-base sm:text-lg transition-all duration-500 shadow-xl
                ${
                  tiers.length === 3 && i === 1
                    ? "bg-white text-black hover:bg-[rgb(255,68,105)] hover:text-white shadow-pink-500/20"
                    : "bg-[rgb(255,68,105)] text-white hover:bg-white hover:text-black shadow-pink-500/30"
                }`}
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
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
