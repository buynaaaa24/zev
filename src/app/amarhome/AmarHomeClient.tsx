"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AmarHomeSections, GlobalContactInfo } from "@/lib/site-content-types";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useAmarHomeLang } from "@/contexts/AmarHomeLangContext";
import LeadFormSection from "../../components/sections/LeadFormSection";
import { resolveMediaUrl } from "@/lib/media";

const DEFAULTS: { en: AmarHomeSections; mn: AmarHomeSections } = {
  en: {
    hero: {
      title: "The Intelligence of Home.",
      titleAccent: "Redefined.",
      desc: "AmarHome orchestrates your environment with invisible precision. Experience a living space that breathes, learns, and evolves with you.",
      cta: "View System",
    },
    features: {
      title: "Invisible Technology.",
      desc: "We believe the best technology is the one you never see, but always feel.",
      items: [
        { title: "Atmospheric Intelligence", desc: "Lighting and climate that adjust to your biological clock.", size: "large", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" },
        { title: "Sonic Architecture", desc: "Immersive audio that moves with you through every room.", size: "medium", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" },
        { title: "Guardian AI", desc: "Proactive security that identifies anomalies before they become threats.", size: "small" },
        { title: "Energy Synthesis", desc: "A self-optimizing power grid that minimizes your footprint.", size: "small" },
      ],
    },
    hardware: {
      title: "The Components.",
      items: [
        { name: "Core Hub", desc: "The silent engine powering your entire ecosystem.", label: "Neural Station" },
        { name: "Glass Touch", desc: "A singular, hand-polished interface for absolute control.", label: "Control Surface" },
        { name: "Lumina S1", desc: "Bio-adaptive sensors that read the rhythm of the day.", label: "Sensor Array" },
      ]
    },
    pricing: {
      label: "Packages",
      title: "Your Sanctuary.",
      desc: "Tailored solutions for every living space.",
      mostPopular: "Most Popular",
      ctaBtn: "Get Started",
      note: "All packages include installation and support.",
      quoteBtn: "Request a quote →",
      tiers: [
        { name: "Urban", price: "Custom", features: ["Apartment & loft optimization", "Lighting control", "Climate control", "Mobile app"], discounts: [] },
        { name: "Family", price: "Custom", features: ["Full residential ecosystem", "Multi-room audio", "Security AI", "Energy optimization", "Mobile app"], discounts: [] },
        { name: "Global", price: "Custom", features: ["Estate & retreat standard", "Full ecosystem", "24/7 monitoring", "Dedicated manager", "Custom integrations"], discounts: [] },
      ]
    }
  },
  mn: {
    hero: {
      title: "Гэрийн Оюун Ухаан.",
      titleAccent: "Шинэ Түвшин.",
      desc: "AmarHome таны орчныг үл үзэгдэх нарийвчлалтайгаар удирдана. Таныг ойлгодог, тантай хамт хөгждөг амьдрах орон зайг мэдэр.",
      cta: "Систем харах",
    },
    features: {
      title: "Үл Үзэгдэх Технологи.",
      desc: "Хамгийн шилдэг технологи бол хэзээ ч харагдахгүй мөртлөө үргэлж мэдрэгддэг технологи юм.",
      items: [
        { title: "Агаар мандлын оюун ухаан", desc: "Таны биологийн цагт тохирсон гэрэлтүүлэг болон уур амьсгал.", size: "large", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" },
        { title: "Дуу авианы архитектур", desc: "Таныг өрөө бүрт дагах гайхалтай дуугаралт.", size: "medium", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" },
        { title: "Хамгаалагч AI", desc: "Аюулыг болохоос нь өмнө илрүүлэх ухаалаг хамгаалалт.", size: "small" },
        { title: "Эрчим хүчний синтез", desc: "Таны хэрэглээг багасгах өөрөө оновчтой болгодог сүлжээ.", size: "small" },
      ],
    },
    hardware: {
      title: "Бүрэлдэхүүн Хэсэг.",
      items: [
        { name: "Core Hub", desc: "Таны бүх экосистемийг тэжээх чимээгүй хөдөлгүүр.", label: "Мэдрэлийн төв" },
        { name: "Glass Touch", desc: "Бүрэн хяналт тавих гараар өнгөлсөн шилэн интерфэйс.", label: "Хяналтын гадаргуу" },
        { name: "Lumina S1", desc: "Өдрийн хэмнэлийг мэдрэх био-адаптив мэдрэгчүүд.", label: "Мэдрэгч" },
      ]
    },
    pricing: {
      label: "Багцууд",
      title: "Таны Орон Зай.",
      desc: "Амьдрах орон зай бүрт тохирсон шийдэл.",
      mostPopular: "Хамгийн алдартай",
      ctaBtn: "Эхлэх",
      note: "Бүх багцад суурилуулалт болон дэмжлэг багтана.",
      quoteBtn: "Үнийн санал авах →",
      tiers: [
        { name: "Urban", price: "Захиалгат", features: ["Орон сууц болон лофтод тохиромжтой", "Гэрэлтүүлгийн удирдлага", "Цаг уурын удирдлага", "Мобайл апп"], discounts: [] },
        { name: "Family", price: "Захиалгат", features: ["Бүрэн гэрийн экосистем", "Олон өрөөний дуу", "Хамгаалалтын AI", "Эрчим хүчний оновчлол", "Мобайл апп"], discounts: [] },
        { name: "Global", price: "Захиалгат", features: ["Эдлэн болон вилланд зориулсан", "Бүрэн экосистем", "24/7 хяналт", "Хувийн менежер", "Тусгай интеграц"], discounts: [] },
      ]
    }
  }
};

export default function AmarHomeClient({ data, globalContact }: { data: AmarHomeSections; globalContact?: GlobalContactInfo }) {
  const { lang } = useAmarHomeLang();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const defaults = lang === "en" ? DEFAULTS.en : DEFAULTS.mn;

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        dx: (Math.random() - 0.5) * 0.1, dy: -Math.random() * 0.3 - 0.05,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.alpha})`; ctx.fill();
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
  };

  const features = data.features.items.length > 0 ? data.features : defaults.features;
  const hardware = data.hardware.items.length > 0 ? data.hardware.items : defaults.hardware.items;
  const pricing = data.pricing.tiers.length > 0 ? data.pricing.tiers : defaults.pricing.tiers;

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-md mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <main className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] rounded-full bg-emerald-900/40 blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[50%] rounded-full bg-emerald-600/10 blur-[140px]" />
        <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,78,59,0.4) 0%, transparent 80%)" }} />
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[5]" />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-20 px-6 md:px-16 lg:px-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full max-w-[1400px] mx-auto">
           <div className={`lg:col-span-6 transition-all duration-[1200ms] ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black text-white mb-6 leading-[1.1] tracking-tighter">
                 {hero.title}<br />
                 <span className="bg-gradient-to-r from-emerald-400 to-white text-transparent bg-clip-text italic pr-4">{hero.titleAccent}</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/40 max-w-lg mb-10 leading-relaxed font-medium">
                 {hero.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                 <Link href="#kholbooBarikh" className="group px-8 py-4 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all duration-500 shadow-2xl shadow-emerald-900/40 flex items-center gap-3">
                    {hero.cta} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURES (Технологи) */}
      <section id="features" className="py-20 md:py-40 relative z-10 px-6">
        <div className="max-w-[1200px] mx-auto">
           <div className="mb-20 md:mb-32">
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Innovation</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">{features.title}</h2>
              <p className="text-white/40 text-lg mt-6 max-w-xl">{features.desc}</p>
           </div>
           
           <div className="flex flex-col gap-24 md:gap-40">
              {features.items.map((item, i) => (
                <FeatureRow key={i} item={item} index={i} />
              ))}
           </div>
        </div>
      </section>

      {/* HARDWARE (Төхөөрөмжүүд) */}
      {hardware.length > 0 && (
        <section id="hardware" className="py-12 md:py-24 bg-neutral-900/10 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 md:mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{data.hardware.title}</h2>
            </div>
            
            <div className={`grid ${getGridCols(hardware.length)} gap-6 md:gap-10`}>
                {hardware.map((item, i) => (
                  <HardwareSpotlight key={i} item={item} index={i} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICING (Үнийн санал) */}
      {pricing.length > 0 && (
        <section id="pricing" className="py-14 sm:py-24 lg:py-32 relative z-10">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
            <div className="text-center mb-10 sm:mb-14 lg:mb-20">
              {(data.pricing.label || defaults.pricing.label) && (
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: AH_ACCENT }}>
                  {data.pricing.label || defaults.pricing.label}
                </p>
              )}
              <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
                {data.pricing.title || defaults.pricing.title}
              </h2>
              {(data.pricing.desc || defaults.pricing.desc) && (
                <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light">
                  {data.pricing.desc || defaults.pricing.desc}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-start">
              {pricing.map((tier, i) => (
                <PricingTier key={i} tier={tier} index={i} totalCount={pricing.length} pricing={data.pricing} defaults={defaults.pricing} />
              ))}
            </div>
            {(data.pricing.note || defaults.pricing.note) && (
              <p className="text-center text-white/30 text-sm mt-8 sm:mt-10">
                {data.pricing.note || defaults.pricing.note}{" "}
                {(data.pricing.quoteBtn || defaults.pricing.quoteBtn) && (
                  <Link href="#kholbooBarikh" className="font-medium hover:underline" style={{ color: AH_ACCENT }}>
                    {data.pricing.quoteBtn || defaults.pricing.quoteBtn}
                  </Link>
                )}
              </p>
            )}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <LeadFormSection
        systemName="AmarHome"
        accentColor="#10b981"
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


function FeatureRow({ item, index }: { item: any; index: number }) {
  const { ref, visible } = useReveal();
  const isEven = index % 2 === 0;
  return (
    <div ref={ref} className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-20`}>
       <div className={`flex-1 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : isEven ? "opacity-0 -translate-x-12" : "opacity-0 translate-x-12"}`}>
          <div className="w-10 h-1 bg-emerald-500 mb-6 rounded-full" />
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tighter mb-4 leading-tight">{item.title}</h3>
          <p className="text-white/40 text-sm sm:text-base font-medium leading-relaxed mb-6">{item.desc}</p>
       </div>
       <div className={`flex-1 relative w-full transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
          <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full" />
          <div className="relative aspect-[16/10] rounded-[20px] md:rounded-[32px] overflow-hidden border border-white/10 group">
             {item.image ? (
                <img src={resolveMediaUrl(item.image)} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
             ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                   <ChevronRight size={60} className="text-white/5" />
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function HardwareSpotlight({ item, index }: { item: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 150}ms` }}>
       <div className="relative aspect-[4/3] md:aspect-square rounded-[24px] md:rounded-[40px] bg-neutral-900/40 border border-white/10 mb-4 md:mb-6 overflow-hidden group">
          {item.image ? (
             <img src={resolveMediaUrl(item.image)} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
          ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          )}
          <div className="absolute top-4 left-4 text-white/5 text-[32px] md:text-[48px] font-black leading-none">0{index + 1}</div>
          <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8 text-center group-hover:-translate-y-2 transition-transform duration-700">
             <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-emerald-500/30 transition-all duration-500 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)]" />
             </div>
             <span className="text-emerald-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">{item.label}</span>
             <h3 className="text-xl md:text-2xl font-black text-white">{item.name}</h3>
          </div>
       </div>
       <p className="text-white/30 text-[10px] md:text-xs font-medium leading-relaxed pl-6 border-l border-white/5">{item.desc}</p>
    </div>
  );
}

const AH_ACCENT = "#10b981";
const AH_GLOW = "rgba(16,185,129,";

function PricingTier({ tier, index, totalCount, pricing, defaults }: { tier: any; index: number; totalCount: number; pricing: any; defaults: any }) {
  const { ref, visible } = useReveal();
  const isMiddle = totalCount === 3 ? index === 1 : index === Math.floor(totalCount / 2) && totalCount > 1;
  const mostPopular = pricing.mostPopular || defaults.mostPopular;
  const ctaBtn = pricing.ctaBtn || defaults.ctaBtn;

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${isMiddle ? "bg-neutral-900 md:scale-[1.03] md:-mt-2" : "bg-white/5 border border-white/10"}`}
      style={{
        transitionDelay: visible ? `${index * 100}ms` : "0ms",
        ...(isMiddle ? { border: `2px solid ${AH_GLOW}0.45)`, boxShadow: `0 20px 60px ${AH_GLOW}0.12)` } : {}),
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
      {isMiddle && mostPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide" style={{ background: AH_ACCENT, color: "#fff", boxShadow: `0 4px 14px ${AH_GLOW}0.4)` }}>
            {mostPopular}
          </span>
        </div>
      )}
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: isMiddle ? AH_ACCENT : "#888" }}>
          {tier.name}
        </p>
        <p className={`text-[13px] mb-3 ${isMiddle ? "text-white/40" : "text-white/30"}`}>{tier.price}</p>
      </div>
      {(tier.features || []).length > 0 && (
        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {(tier.features as string[]).map((f, j) => (
            <li key={j} className={`flex items-start gap-2.5 text-sm sm:text-[14px] ${isMiddle ? "text-white/70" : "text-white/50"}`}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AH_ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}
      <Link
        href="#kholbooBarikh"
        className={`block text-center text-[14px] font-semibold py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${isMiddle ? "" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
        style={isMiddle ? { background: AH_ACCENT, color: "#fff", boxShadow: `0 8px 24px ${AH_GLOW}0.3)` } : {}}
      >
        {ctaBtn || "Get Started"}
      </Link>
    </div>
  );
}

function useReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}
