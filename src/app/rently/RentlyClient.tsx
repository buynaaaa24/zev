"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GlobalContactInfo, RentlySections } from "@/lib/site-content-types";
import { useRentlyLang } from "@/contexts/RentlyLangContext";
import LeadFormSection from "@/components/sections/LeadFormSection";
import { getApiBaseUrl } from "@/lib/api";
import { ArrowRight, ChevronRight } from "lucide-react";

const DEFAULTS: { en: RentlySections; mn: RentlySections } = {
  en: {
    hero: {
      title: "Comprehensive Rent Management",
      titleAccent: "System",
      desc: "Monitor rent payments, send invoices, calculate penalties, and manage utility costs all in one place with Rently.",
      cta: "Get Started",
      secondary: "Learn More",
    },
    features: {
      title: "Core Features",
      desc: "Smart solutions to simplify your rental operations.",
      items: [
        { title: "Payment Monitoring", desc: "Track tenant payments in real-time and generate reports instantly.", size: "medium" },
        { title: "Penalty Calculation", desc: "Automatically calculate penalties for overdue payments based on contract terms.", size: "small" },
        { title: "Utility Costs", desc: "Accurately calculate and distribute utility costs like water, electricity, and heating based on usage.", size: "large" },
      ],
    },
    notifications: {
      title: "Smart Notifications",
      desc: "Automatically send rent invoices and payment reminders to tenants via Email and SMS.",
    },
    penalties: {
      title: "Penalty Rules",
      desc: "Flexibly configure penalty calculations based on contract terms and conditions.",
    },
    costs: {
      title: "Utility Costs",
      desc: "Accurately calculate all types of utility costs such as heating, electricity, fresh water, and waste.",
    },
    pricing: {
      label: "Pricing Plans",
      title: "Pricing Plans",
      desc: "Choose the right plan for your property.",
      mostPopular: "Most Popular",
      ctaBtn: "Get Started",
      note: "Need a custom solution?",
      quoteBtn: "Contact us →",
      tiers: [
        { name: "Basic Plan", price: "100,000₮ / month", features: ["Up to 50 tenants", "Payment monitoring", "Email notifications", "Basic reports"], discounts: [] },
        { name: "Business Plan", price: "250,000₮ / month", features: ["Unlimited tenants", "SMS + Email notifications", "Advanced reports", "Penalty calculation", "Utility cost tracking"], discounts: [] },
      ],
    },
  },
  mn: {
    hero: {
      title: "Түрээсийн удирдлагын цогц",
      titleAccent: "Систем",
      desc: "Түрээсийн төлбөрийн хяналт, нэхэмжлэх илгээх, алданги тооцох болон ашиглалтын зардлын тооцооллыг нэг дороос удирдах боломжтой систем.",
      cta: "Систем нэвтрүүлэх",
      secondary: "Дэлгэрэнгүй",
    },
    features: {
      title: "Үндсэн боломжууд",
      desc: "Түрээсийн үйл ажиллагааг хөнгөвчлөх ухаалаг шийдлүүд.",
      items: [
        { title: "Төлбөрийн хяналт", desc: "Түрээслэгчдийн төлбөр төлөлтийн байдлыг цаг алдалгүй хянах, тайлан гаргах.", size: "medium" },
        { title: "Алданги тооцоолол", desc: "Хугацаа хэтэрсэн төлбөрт гэрээнд заасан хувиар алданги автоматаар тооцох.", size: "small" },
        { title: "Ашиглалтын зардал", desc: "Ус, цахилгаан, дулаан зэрэг ашиглалтын зардлыг талбайн хэмжээ болон хэрэглээгээр хуваарилан тооцох.", size: "large" },
      ],
    },
    notifications: {
      title: "Ухаалаг мэдэгдэл",
      desc: "Түрээсийн нэхэмжлэх болон төлбөрийн сануулгыг И-мэйл болон Мессежээр (SMS) түрээслэгчдэд автоматаар илгээх.",
    },
    penalties: {
      title: "Алдангийн журам",
      desc: "Гэрээний хугацаа болон нөхцөлөөс хамааран алдангийн тооцооллыг уян хатан тохируулах боломжтой.",
    },
    costs: {
      title: "Ашиглалтын зардал",
      desc: "Дулаан, цахилгаан, цэвэр ус, хог зэрэг бүх төрлийн ашиглалтын зардлыг үнэн зөвөөр тооцоолох.",
    },
    pricing: {
      label: "Үнэ тариф",
      title: "Үнэ тариф",
      desc: "Объектдоо тохирсон багцаа сонгоно уу.",
      mostPopular: "Хамгийн алдартай",
      ctaBtn: "Эхлэх",
      note: "Тусгай шийдэл хэрэгтэй юу?",
      quoteBtn: "Холбоо барих →",
      tiers: [
        { name: "Энгийн багц", price: "100,000₮ / сар", features: ["50 хүртэлх түрээслэгч", "Төлбөрийн хяналт", "Имэйл мэдэгдэл", "Үндсэн тайлан"], discounts: [] },
        { name: "Бизнес багц", price: "250,000₮ / сар", features: ["Хязгааргүй түрээслэгч", "SMS + Имэйл мэдэгдэл", "Дэлгэрэнгүй тайлан", "Алданги тооцоолол", "Ашиглалтын зардал хяналт"], discounts: [] },
      ],
    },
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

export default function RentlyClient({ initialData, globalContact }: { initialData: RentlySections; globalContact?: GlobalContactInfo }) {
  const { lang, toggle } = useRentlyLang();
  const [data, setData] = useState<RentlySections>(initialData);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchLang() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/v1/site-pages/rently?lang=${lang}&siteId=rently`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.sections) {
            setData(json.data.sections);
          } else {
            setData(DEFAULTS[lang]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch language data", e);
      }
    }
    if (lang !== "mn") {
      fetchLang();
    } else {
      setData(initialData);
    }
  }, [lang, initialData]);

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


  const defaults = DEFAULTS[lang] || DEFAULTS.mn;

  const hero = {
    title: data?.hero?.title || defaults.hero.title,
    titleAccent: data?.hero?.titleAccent || defaults.hero.titleAccent,
    desc: data?.hero?.desc || defaults.hero.desc,
    cta: data?.hero?.cta || defaults.hero.cta,
    image: data?.hero?.image || defaults.hero.image,
  };

  const features = (data?.features?.items?.length ? data.features.items : defaults.features.items).filter(i => (i.title && i.title.trim() !== "") || i.image);
  const pricing = (data?.pricing?.tiers?.length ? data.pricing.tiers : defaults.pricing.tiers).filter(i => i.name && i.name.trim() !== "");

  const additionalSections = [
    { name: data?.notifications?.title || defaults.notifications.title, desc: data?.notifications?.desc || defaults.notifications.desc, label: lang === 'mn' ? "Ухаалаг" : "Smart" },
    { name: data?.penalties?.title || defaults.penalties.title, desc: data?.penalties?.desc || defaults.penalties.desc, label: lang === 'mn' ? "Журам" : "Rule" },
    { name: data?.costs?.title || defaults.costs.title, desc: data?.costs?.desc || defaults.costs.desc, label: lang === 'mn' ? "Зардал" : "Cost" },
  ];

  return (
    <main className="bg-[#050505] selection:bg-emerald-600 selection:text-white min-h-screen relative overflow-hidden font-sans">


      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* LUXURY BACKGROUND — slightly bright green */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#081a10]" />
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] rounded-full bg-emerald-800/50 blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[50%] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[50%] h-[40%] rounded-full bg-emerald-700/10 blur-[120px]" />
        <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,120,80,0.35) 0%, transparent 80%)" }} />
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
              <Link href="#features" className="group px-8 py-4 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all duration-500 shadow-2xl shadow-emerald-900/40 flex items-center gap-3">
                {hero.cta} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div className={`lg:col-span-6 relative transition-all duration-[1500ms] delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"}`}>
            <div className="relative aspect-square sm:aspect-video lg:aspect-[4/5] xl:aspect-square animate-float">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-[32px] sm:rounded-[48px] blur-[40px] sm:blur-[60px]" />
              <div className="relative h-full w-full rounded-[32px] sm:rounded-[48px] border border-white/10 bg-neutral-900/20 backdrop-blur-3xl overflow-hidden shadow-2xl p-2 sm:p-3">
                {hero.image ? (
                  <img src={hero.image} alt="Hero" className="w-full h-full object-cover rounded-[24px] sm:rounded-[40px]" />
                ) : (
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[24px] sm:rounded-[40px] flex flex-col p-6 sm:p-12">
                    <div className="flex justify-between items-start mb-12">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                        <div className="w-3 h-3 rounded-full bg-white/5" />
                        <div className="w-3 h-3 rounded-full bg-white/5" />
                      </div>
                    </div>
                    <div className="space-y-6 flex-1">
                      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/40 to-transparent" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
                        <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {features.length > 0 && (
        <section id="features" className="py-12 md:py-24 relative z-10 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12 md:mb-20 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6">
                {data?.features?.title || defaults.features.title}
              </h2>
              <p className="text-lg text-white/40">{data?.features?.desc || defaults.features.desc}</p>
            </div>

            <div className="space-y-16 md:space-y-24">
              {features.map((item, idx) => (
                <FeatureRow key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ADDITIONAL SECTIONS (Notifications, Penalties, Costs) */}
      <section id="additional" className="py-12 md:py-24 bg-neutral-900/10 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10`}>
            {additionalSections.map((item, i) => (
              <SpotlightCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {pricing.length > 0 && (
        <section id="pricing" className="py-14 sm:py-24 lg:py-32 relative z-10">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">
            <div className="text-center mb-10 sm:mb-14 lg:mb-20">
              {(data?.pricing?.label || defaults.pricing.label) && (
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: RE_ACCENT }}>
                  {data?.pricing?.label || defaults.pricing.label}
                </p>
              )}
              <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
                {data?.pricing?.title || defaults.pricing.title}
              </h2>
              {(data?.pricing?.desc || defaults.pricing.desc) && (
                <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light">
                  {data?.pricing?.desc || defaults.pricing.desc}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-start">
              {pricing.map((tier, i) => (
                <PricingTier
                  key={i} tier={tier} index={i} totalCount={pricing.length}
                  mostPopular={data?.pricing?.mostPopular || defaults.pricing.mostPopular}
                  ctaBtn={data?.pricing?.ctaBtn || defaults.pricing.ctaBtn}
                />
              ))}
            </div>
            {(data?.pricing?.note || defaults.pricing.note) && (
              <p className="text-center text-white/30 text-sm mt-8 sm:mt-10">
                {data?.pricing?.note || defaults.pricing.note}{" "}
                {(data?.pricing?.quoteBtn || defaults.pricing.quoteBtn) && (
                  <Link href="#kholbooBarikh" className="font-medium hover:underline" style={{ color: RE_ACCENT }}>
                    {data?.pricing?.quoteBtn || defaults.pricing.quoteBtn}
                  </Link>
                )}
              </p>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <LeadFormSection
        systemName="Rently"
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
            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
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

function SpotlightCard({ item, index }: { item: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="relative aspect-[4/3] md:aspect-square rounded-[24px] md:rounded-[40px] bg-neutral-900/40 border border-white/10 mb-4 md:mb-6 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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

const RE_ACCENT = "#10b981";
const RE_GLOW = "rgba(16,185,129,";

function PricingTier({ tier, index, totalCount, mostPopular, ctaBtn }: { tier: any; index: number; totalCount: number; mostPopular: string; ctaBtn: string }) {
  const { ref, visible } = useReveal();
  const isMiddle = totalCount === 3 ? index === 1 : index === Math.floor(totalCount / 2) && totalCount > 1;

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${isMiddle ? "bg-neutral-900 md:scale-[1.03] md:-mt-2" : "bg-white/5 border border-white/10"}`}
      style={{
        transitionDelay: visible ? `${index * 100}ms` : "0ms",
        ...(isMiddle ? { border: `2px solid ${RE_GLOW}0.45)`, boxShadow: `0 20px 60px ${RE_GLOW}0.12)` } : {}),
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
          <span className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide" style={{ background: RE_ACCENT, color: "#fff", boxShadow: `0 4px 14px ${RE_GLOW}0.4)` }}>
            {mostPopular}
          </span>
        </div>
      )}
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: isMiddle ? RE_ACCENT : "#888" }}>
          {tier.name}
        </p>
        <p className={`text-[13px] mb-3 ${isMiddle ? "text-white/40" : "text-white/30"}`}>{tier.price}</p>
      </div>
      {(tier.features || []).length > 0 && (
        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {(tier.features as string[]).map((f, j) => (
            <li key={j} className={`flex items-start gap-2.5 text-sm sm:text-[14px] ${isMiddle ? "text-white/70" : "text-white/50"}`}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: RE_ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        style={isMiddle ? { background: RE_ACCENT, color: "#fff", boxShadow: `0 8px 24px ${RE_GLOW}0.3)` } : {}}
      >
        {ctaBtn || "Get Started"}
      </Link>
    </div>
  );
}
