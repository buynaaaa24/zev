"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";
import { PosEaseSections } from "@/lib/site-content-types";

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
  const { lang, setSections } = usePosEaseLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const data = lang === "mn" ? initialMn : initialEn;
  const defaults = DEFAULTS[lang];

  // CLEAN DATA
  const featuresItems = (data.features.items || []).filter(i => i.title && i.title.trim() !== "");
  const hardwareItems = (data.hardware.items || []).filter(i => i.name && i.name.trim() !== "");
  const pricingTiers = (data.pricing.tiers || []).filter(i => i.name && i.name.trim() !== "");

  // Update Navbar visibility context
  useEffect(() => {
    if (setSections) {
      setSections({
        features: featuresItems.length > 0,
        hardware: hardwareItems.length > 0,
        pricing: pricingTiers.length > 0,
      });
    }
  }, [featuresItems.length, hardwareItems.length, pricingTiers.length, setSections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3, dy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,68,105,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
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
      {/* MORE PINK GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[70%] rounded-full bg-[rgb(255,68,105)]/20 blur-[180px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/15 blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[rgb(255,68,105)]/10 blur-[120px]" />
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,68,105,0.4) 0%, transparent 70%)" }} aria-hidden />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-[100vh] pointer-events-none z-[5]" aria-hidden />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 pt-36 sm:pt-48 pb-20 overflow-hidden z-10">
        
        <div className="relative z-10 max-w-[1000px] w-full">
         
          <h1 className="display-xl text-white mb-8">
            {hero.title}<br />
            <span className="bg-gradient-to-r from-pink-500 via-white to-pink-500 text-transparent bg-clip-text animate-gradient">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="body-lg text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="#features" className="group relative px-12 py-5 rounded-full bg-[rgb(255,68,105)] text-white font-black text-lg hover:scale-[1.05] active:scale-95 transition-all duration-500 shadow-[0_10px_40px_rgba(255,68,105,0.4)] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               <span className="relative z-10 flex items-center gap-3">
                  {hero.cta} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </span>
            </Link>
          </div>
        </div>

        <div className="relative mt-32 w-full max-w-[1200px] aspect-[16/9] bg-gradient-to-b from-pink-500/10 to-transparent rounded-t-[60px] border-t border-x border-pink-500/20 p-2 sm:p-4 backdrop-blur-3xl overflow-hidden shadow-[0_-20px_80px_rgba(255,68,105,0.15)]">
          <div className="relative w-full h-full bg-[#0a0a0a] rounded-[48px] border border-white/5 flex flex-col overflow-hidden">
            {hero.image ? (
               <img src={hero.image} alt="PosEase Dashboard" className="w-full h-full object-cover rounded-[48px]" />
            ) : (
              <div className="flex flex-col p-10 h-full">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-[rgb(255,68,105)]/40" />
                      <div className="w-4 h-4 rounded-full bg-white/5" />
                      <div className="w-4 h-4 rounded-full bg-white/5" />
                  </div>
                  <div className="w-40 h-8 rounded-full bg-white/5" />
                </div>
                <div className="grid grid-cols-4 gap-6 flex-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className="bg-white/5 rounded-[32px] border border-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {featuresItems.length > 0 && (
        <section id="features" className="py-24 sm:py-40 relative z-10 px-6">
          <FeaturesContent title={data.features.title} desc={data.features.desc} items={featuresItems} />
        </section>
      )}

      {/* Hardware Section */}
      {hardwareItems.length > 0 && (
        <section id="hardware" className="py-24 sm:py-40 relative z-10 overflow-hidden">
          <HardwareContent title={data.hardware.title} items={hardwareItems} gridClass={getGridCols(hardwareItems.length)} />
        </section>
      )}

      {/* Pricing Section */}
      {pricingTiers.length > 0 && (
        <section id="pricing" className="py-24 sm:py-40 relative z-10 px-6">
          <PricingContent title={data.pricing.title} tiers={pricingTiers} gridClass={getGridCols(pricingTiers.length)} />
        </section>
      )}

      <footer className="py-20 relative z-10 border-t border-white/10 px-6 bg-gradient-to-b from-transparent to-pink-900/5">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20">
                  <img src="/posease-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
               </div>
               <span className="text-white font-black text-2xl tracking-tighter">PosEase</span>
            </div>
            <div className="flex gap-12 text-white/40 font-bold text-sm uppercase tracking-widest">
               <Link href="#features" className="hover:text-[rgb(255,68,105)] transition-colors">Features</Link>
               <Link href="#hardware" className="hover:text-[rgb(255,68,105)] transition-colors">Hardware</Link>
               <Link href="#pricing" className="hover:text-[rgb(255,68,105)] transition-colors">Pricing</Link>
            </div>
            <p className="text-white/30 text-xs font-medium tracking-tight">© 2026 PosEase. All Rights Reserved.</p>
         </div>
      </footer>
    </main>
  );
}

function FeaturesContent({ title, desc, items }: { title: string; desc: string; items: any[] }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto">
      <div className={`mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="w-20 h-1.5 bg-[rgb(255,68,105)] rounded-full mb-10 shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
        <h2 className="display-lg text-white mb-10">{title}</h2>
        <p className="body-lg text-white/40 max-w-3xl leading-relaxed">{desc}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[280px]">
        {items.map((item, i) => (
          <div 
            key={i}
            className={`
              group relative rounded-[48px] p-10 overflow-hidden border border-white/5 bg-neutral-900/20 backdrop-blur-3xl transition-all duration-700
              ${item.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
              ${item.size === "medium" ? "md:col-span-2" : ""}
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              hover:border-[rgb(255,68,105)]/30 hover:shadow-[0_20px_60px_rgba(255,68,105,0.1)]
            `}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(255,68,105)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {item.image && (
              <div className="absolute inset-0 z-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>
            )}
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-14 h-14 rounded-2xl bg-[rgb(255,68,105)]/10 border border-[rgb(255,68,105)]/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[rgb(255,68,105)]/30 transition-all duration-500 shadow-[0_0_30px_rgba(255,68,105,0.1)]">
                 <div className="w-3 h-3 rounded-full bg-[rgb(255,68,105)] shadow-[0_0_20px_rgba(255,68,105,1)]" />
              </div>
              <h3 className={`font-black text-white mb-4 leading-tight ${item.size === "large" ? "text-5xl" : "text-3xl"}`}>{item.title}</h3>
              <p className="text-white/40 text-lg font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardwareContent({ title, items, gridClass }: { title: string; items: any[]; gridClass: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto px-6">
      <div className={`text-center mb-24 transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <h2 className="display-lg text-white mb-4">{title}</h2>
        <div className="w-24 h-1.5 bg-[rgb(255,68,105)] mx-auto rounded-full shadow-[0_0_20px_rgba(255,68,105,0.5)]" />
      </div>
      <div className={`grid ${gridClass} gap-12 sm:gap-20`}>
         {items.map((item, i) => (
            <div key={i} className={`flex flex-col items-center text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`} style={{ transitionDelay: `${i * 200}ms` }}>
               <div className="relative w-full aspect-square mb-12 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(255,68,105)]/30 to-violet-500/30 rounded-[80px] blur-[60px] opacity-60 group-hover:opacity-100 group-hover:blur-[80px] transition-all duration-1000" />
                  <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-6 transition-transform duration-700 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                      ) : (
                        <span className="text-[rgb(255,68,105)]/10 text-[180px] font-black">{i+1}</span>
                      )}
                  </div>
                  <div className="absolute -top-4 -right-4 px-6 py-2 rounded-full bg-[rgb(255,68,105)] shadow-[0_10px_30px_rgba(255,68,105,0.4)]">
                      <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</span>
                  </div>
               </div>
               <h3 className="text-4xl font-black text-white mb-4 tracking-tight">{item.name}</h3>
               <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xs">{item.desc}</p>
            </div>
         ))}
      </div>
    </div>
  );
}

function PricingContent({ title, tiers, gridClass }: { title: string; tiers: any[]; gridClass: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="max-w-[1200px] mx-auto text-center">
      <h2 className={`display-lg text-white mb-24 transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
        {title}
      </h2>
      <div className={`grid ${gridClass} gap-10`}>
         {tiers.map((tier, i) => (
            <div 
              key={i}
              className={`
                p-12 rounded-[60px] bg-neutral-900/20 border border-white/5 backdrop-blur-3xl text-left flex flex-col items-start transition-all duration-1000
                ${tiers.length === 3 && i === 1 ? "border-[rgb(255,68,105)]/40 scale-105 bg-black/40 shadow-[0_30px_100px_rgba(255,68,105,0.15)]" : ""}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
                hover:border-[rgb(255,68,105)]/30 hover:-translate-y-2 transition-all duration-500
              `}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
               <div className={`px-4 py-1.5 rounded-full mb-8 ${tiers.length === 3 && i === 1 ? "bg-[rgb(255,68,105)]" : "bg-white/5 border border-white/10"}`}>
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${tiers.length === 3 && i === 1 ? "text-white" : "text-[rgb(255,68,105)]"}`}>{tier.name}</span>
               </div>
               <p className="text-white text-6xl font-black mb-8 tracking-tighter">{tier.price}</p>
               <p className="text-white/50 text-lg mb-12 font-medium leading-relaxed">{tier.desc}</p>
               <Link href="/posease/try" className={`mt-auto w-full py-5 rounded-[24px] text-center font-black text-lg transition-all duration-500 shadow-xl ${tiers.length === 3 && i === 1 ? "bg-white text-black hover:bg-[rgb(255,68,105)] hover:text-white shadow-pink-500/20" : "bg-[rgb(255,68,105)] text-white hover:bg-white hover:text-black shadow-pink-500/30"}`}>
                  Get Started
               </Link>
            </div>
         ))}
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
