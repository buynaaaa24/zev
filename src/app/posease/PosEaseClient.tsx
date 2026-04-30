"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";
import { PosEaseSections } from "@/lib/site-content-types";

const PINK = "#ec4899";

/* ── Fallback Defaults ───────────────────────────────────── */
const DEFAULTS: { en: PosEaseSections; mn: PosEaseSections } = {
  en: {
    hero: {
      title: "Point of Sale.",
      titleAccent: "Perfected.",
      desc: "PosEase is an ultra-modern, cloud-native POS system designed for the future of retail and hospitality. Fast, intuitive, and beautiful.",
      cta: "Request Early Access",
      secondary: "Explore PosEase 2.0",
    },
    features: {
      title: "Everything you need.",
      desc: "Designed to be powerful enough for enterprises, yet simple enough for a single shop.",
      items: [
        { title: "Real-time Sync", desc: "Your data is always live across every terminal and office.", size: "large" },
        { title: "Global Inventory", desc: "Manage stock levels across 100+ locations effortlessly.", size: "small" },
        { title: "Offline Core", desc: "Transaction engine that never stops, even without internet.", size: "small" },
        { title: "Smart Analytics", desc: "AI-driven insights to predict your best selling days.", size: "medium" },
        { title: "Universal Pay", desc: "Accept QPay, Cards, and Crypto with zero extra hardware.", size: "medium" },
      ],
    },
    hardware: {
      title: "Hardware that inspires.",
      items: [
        { name: "PosEase Air", desc: "The thinnest POS terminal ever made.", label: "Mobile" },
        { name: "PosEase Hub", desc: "The centerpiece of your store counter.", label: "Station" },
        { name: "Kitchen Vision", desc: "Perfect clarity for the busiest kitchens.", label: "Display" },
      ]
    },
    pricing: {
      title: "Simple. Transparent.",
      tiers: [
        { name: "Solo", price: "Free", desc: "For single terminal shops." },
        { name: "Studio", price: "$49", desc: "For growing businesses." },
        { name: "Enterprise", price: "Custom", desc: "For global scale." },
      ]
    }
  },
  mn: {
    hero: {
      title: "POS Систем.",
      titleAccent: "Төгс шийдэл.",
      desc: "PosEase бол орчин үеийн, үүлэн технологид суурилсан, ирээдүйн худалдаа үйлчилгээнд зориулсан систем юм. Хурдан, ойлгомжтой, гоёмсог.",
      cta: "Хүсэлт илгээх",
      secondary: "PosEase 2.0-той танилц",
    },
    features: {
      title: "Танд хэрэгтэй бүх зүйл.",
      desc: "Томоохон аж ахуйн нэгжид ч, жижиг дэлгүүрт ч төгс тохирох хүчирхэг бөгөөд энгийн шийдэл.",
      items: [
        { title: "Шууд Синхрончлол", desc: "Бүх салбар болон оффисын өгөгдөл үргэлж хамт шинэчлэгдэнэ.", size: "large" },
        { title: "Барааны Бүртгэл", desc: "100+ байршил дахь барааны үлдэгдлийг төвөггүй удирдана.", size: "small" },
        { title: "Офлайн Цөм", desc: "Интернэтгүй үед ч гүйлгээ хэзээ ч зогсохгүй.", size: "small" },
        { title: "Ухаалаг Аналитик", desc: "Борлуулалтын өгөгдөлд суурилсан хиймэл оюуны зөвлөмжүүд.", size: "medium" },
        { title: "Бүх төрлийн Төлбөр", desc: "QPay, Карт болон Крпито төлбөрийг нэмэлт төхөөрөмжгүй авна.", size: "medium" },
      ],
    },
    hardware: {
      title: "Урам зориг өгөх төхөөрөмжүүд.",
      items: [
        { name: "PosEase Air", desc: "Хамгийн нимгэн POS терминал.", label: "Мобайл" },
        { name: "PosEase Hub", desc: "Таны дэлгүүрийн төв цэг.", label: "Станц" },
        { name: "Kitchen Vision", desc: "Завгүй гал тогоонд зориулсан тунгалаг дэлгэц.", label: "Дэлгэц" },
      ]
    },
    pricing: {
      title: "Энгийн. Ил тод.",
      tiers: [
        { name: "Solo", price: "Үнэгүй", desc: "Ганц салбартай дэлгүүрт." },
        { name: "Studio", price: "$49", desc: "Өсөн нэмэгдэж буй бизнест." },
        { name: "Enterprise", price: "Захиалгат", desc: "Дэлхийн хэмжээний бизнест." },
      ]
    }
  }
};

/* ── Scroll Reveal Hook ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

interface PosEasePageClientProps {
  initialMn: PosEaseSections;
  initialEn: PosEaseSections;
}

export default function PosEaseClient({ initialMn, initialEn }: PosEasePageClientProps) {
  const { lang } = usePosEaseLang();
  
  // Use CMS data if available, otherwise fallback to defaults
  const data = lang === "mn" ? initialMn : initialEn;
  const defaults = DEFAULTS[lang];

  const hero = {
    title: data.hero.title || defaults.hero.title,
    titleAccent: data.hero.titleAccent || defaults.hero.titleAccent,
    desc: data.hero.desc || defaults.hero.desc,
    cta: data.hero.cta || defaults.hero.cta,
    secondary: data.hero.secondary || defaults.hero.secondary,
    image: data.hero.image || defaults.hero.image,
  };
  
  const features = { 
    title: data.features.title || defaults.features.title,
    desc: data.features.desc || defaults.features.desc,
    items: data.features.items?.length ? data.features.items : defaults.features.items 
  };
  
  const hardware = { 
    title: data.hardware.title || defaults.hardware.title,
    items: data.hardware.items?.length ? data.hardware.items : defaults.hardware.items 
  };
  
  const pricing = { 
    title: data.pricing.title || defaults.pricing.title,
    tiers: data.pricing.tiers?.length ? data.pricing.tiers : defaults.pricing.tiers 
  };

  return (
    <main className="bg-black selection:bg-pink-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden bg-[#050505]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px]" />
        
        <div className="relative z-10 max-w-[900px] w-full">
          <h1 className="text-[56px] sm:text-[90px] md:text-[120px] font-black tracking-tight leading-[0.9] text-white mb-8">
            {hero.title}<br />
            <span className="bg-gradient-to-b from-white via-white/80 to-pink-500 text-transparent bg-clip-text">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="text-white/40 text-lg sm:text-2xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/posease/try" className="px-10 py-5 rounded-[28px] bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              {hero.cta}
            </Link>
            <button className="text-white/60 font-bold hover:text-white transition-colors">
              {hero.secondary} →
            </button>
          </div>
        </div>

        <div className="relative mt-20 w-full max-w-[1000px] aspect-[16/9] bg-gradient-to-b from-white/10 to-transparent rounded-t-[40px] border-t border-x border-white/20 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full h-full bg-[#0a0a0a] rounded-[24px] border border-white/5 flex flex-col overflow-hidden">
            {hero.image ? (
               <img src={hero.image} alt="PosEase Dashboard" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col p-6 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                  <div className="w-32 h-6 rounded-full bg-white/5" />
                </div>
                <div className="grid grid-cols-4 gap-4 flex-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className="bg-white/5 rounded-2xl border border-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-40 bg-black px-6">
        <FeaturesContent features={features} />
      </section>

      {/* Hardware Section */}
      <section id="hardware" className="py-24 sm:py-40 bg-[#050505] overflow-hidden">
        <HardwareContent hardware={hardware} />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-40 bg-black px-6">
        <PricingContent pricing={pricing} />
      </section>

      <footer className="py-10 bg-black border-t border-white/5 px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center font-black text-white text-sm">P</div>
               <span className="text-white font-bold text-lg">PosEase</span>
            </div>
            <p className="text-white/20 text-sm">© 2026 Zevtabs. Designed for the future.</p>
         </div>
      </footer>
    </main>
  );
}

function FeaturesContent({ features }: { features: PosEaseSections["features"] }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto">
      <div className={`mb-20 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter mb-8">{features.title}</h2>
        <p className="text-white/40 text-xl sm:text-2xl font-medium max-w-2xl">{features.desc}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {(features.items || []).map((item, i) => (
          <div 
            key={i}
            className={`
              group relative rounded-[40px] p-8 overflow-hidden border border-white/10 bg-neutral-900/40 backdrop-blur-xl transition-all duration-700
              ${item.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
              ${item.size === "medium" ? "md:col-span-2" : ""}
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
            `}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {item.image && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
            )}

            <div className="relative z-10 h-full flex flex-col justify-end">
              {!item.image && (
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-pink-500/50 transition-all duration-500">
                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                </div>
              )}
              <h3 className={`font-black text-white mb-3 ${item.size === "large" ? "text-4xl" : "text-2xl"}`}>{item.title}</h3>
              <p className="text-white/50 text-base font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardwareContent({ hardware }: { hardware: PosEaseSections["hardware"] }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto px-6">
      <div className={`text-center mb-20 transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <h2 className="text-4xl sm:text-8xl font-black text-white tracking-tighter">{hardware.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
         {(hardware.items || []).map((item, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
               <div className="relative w-full aspect-square mb-10 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 rounded-[60px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  <div className="absolute inset-[10%] bg-neutral-900 rounded-[40px] border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-4 transition-transform duration-500 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white/10 text-9xl font-black">{i+1}</span>
                      )}
                  </div>
                  <div className="absolute top-6 left-6 px-4 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
               </div>
               <h3 className="text-3xl font-black text-white mb-2">{item.name}</h3>
               <p className="text-white/40 font-medium">{item.desc}</p>
            </div>
         ))}
      </div>
    </div>
  );
}

function PricingContent({ pricing }: { pricing: PosEaseSections["pricing"] }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto text-center">
      <h2 className={`text-4xl sm:text-7xl font-black text-white tracking-tighter mb-20 transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
        {pricing.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {(pricing.tiers || []).map((tier, i) => (
            <div 
              key={i}
              className={`
                p-10 rounded-[48px] bg-neutral-900/40 border border-white/5 backdrop-blur-2xl text-left flex flex-col items-start transition-all duration-1000
                ${i === 1 ? "border-pink-500/50 scale-105 bg-neutral-800/60" : ""}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              `}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
               <p className="text-white/40 font-black uppercase tracking-widest text-xs mb-2">{tier.name}</p>
               <p className="text-white text-5xl font-black mb-6">{tier.price}</p>
               <p className="text-white/60 mb-10 font-medium">{tier.desc}</p>
               <Link href="/posease/try" className={`mt-auto w-full py-4 rounded-[20px] text-center font-bold transition-all ${i === 1 ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
                  Get Started
               </Link>
            </div>
         ))}
      </div>
    </div>
  );
}
