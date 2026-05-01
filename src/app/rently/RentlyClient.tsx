"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RentlySections } from "@/lib/site-content-types";
import { useRentlyLang } from "@/contexts/RentlyLangContext";
import { getApiBaseUrl } from "@/lib/api";
import { ArrowRight, ChevronRight, Plus, Menu, X } from "lucide-react";

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
      title: "Pricing Plans",
      tiers: [
        { name: "Basic Plan", price: "100,000₮ / month", desc: "Designed for small properties and retail spaces. Up to 50 tenants." },
        { name: "Business Plan", price: "250,000₮ / month", desc: "Designed for offices and large malls. Unlimited tenants, SMS service included." },
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
      title: "Үнэ тариф",
      tiers: [
        { name: "Энгийн багц", price: "100,000₮ / сар", desc: "Жижиг обьект болон худалдааны төвд зориулагдсан багц. 50 хүртэлх түрээслэгчтэй." },
        { name: "Бизнес багц", price: "250,000₮ / сар", desc: "Оффис болон томоохон худалдааны төвд зориулагдсан. Хязгааргүй түрээслэгчтэй, SMS үйлчилгээ багтсан." },
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

export default function RentlyClient({ initialData }: { initialData: RentlySections }) {
  const { lang, toggle } = useRentlyLang();
  const [data, setData] = useState<RentlySections>(initialData);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaults = DEFAULTS[lang] || DEFAULTS.mn;

  const hero = {
    title: data?.hero?.title || defaults.hero.title,
    titleAccent: data?.hero?.titleAccent || defaults.hero.titleAccent,
    desc: data?.hero?.desc || defaults.hero.desc,
    cta: data?.hero?.cta || defaults.hero.cta,
    image: data?.hero?.image || defaults.hero.image,
  };

  const features = (data?.features?.items?.length ? data.features.items : defaults.features.items).filter(i => i.title && i.title.trim() !== "");
  const pricing = (data?.pricing?.tiers?.length ? data.pricing.tiers : defaults.pricing.tiers).filter(i => i.name && i.name.trim() !== "");
  
  const additionalSections = [
    { name: data?.notifications?.title || defaults.notifications.title, desc: data?.notifications?.desc || defaults.notifications.desc, label: lang === 'mn' ? "Ухаалаг" : "Smart" },
    { name: data?.penalties?.title || defaults.penalties.title, desc: data?.penalties?.desc || defaults.penalties.desc, label: lang === 'mn' ? "Журам" : "Rule" },
    { name: data?.costs?.title || defaults.costs.title, desc: data?.costs?.desc || defaults.costs.desc, label: lang === 'mn' ? "Зардал" : "Cost" },
  ];

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-lg mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <main className="bg-[#050505] selection:bg-emerald-600 selection:text-white min-h-screen relative overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md shadow-sm py-4 border-b border-white/5" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 lg:px-24 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/images/rently.png"
                alt="Rently Logo"
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-bold text-lg tracking-tight text-white">Rently</span>
            </Link>
          </div>

          <nav className="hidden md:flex shrink-0 items-center gap-8">
            <a href="#features" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-emerald-400 transition-colors">{lang === 'mn' ? 'Боломжууд' : 'Features'}</a>
            <a href="#additional" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-emerald-400 transition-colors">{lang === 'mn' ? 'Нэмэлт' : 'Additional'}</a>
            <a href="#pricing" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-emerald-400 transition-colors">{lang === 'mn' ? 'Үнэ тариф' : 'Pricing'}</a>
          </nav>

          <div className="flex-1 hidden md:flex justify-end items-center gap-6">
            <button onClick={toggle} className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 transition-colors">
              {lang === "mn" ? "EN" : "MN"}
            </button>
            <a href="#contact" className="px-5 py-2.5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              {lang === 'mn' ? 'Холбогдох' : 'Contact'}
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-24 px-6 flex flex-col gap-6 md:hidden">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-black text-white">{lang === 'mn' ? 'Боломжууд' : 'Features'}</a>
          <a href="#additional" onClick={() => setMobileMenuOpen(false)} className="text-xl font-black text-white">{lang === 'mn' ? 'Нэмэлт' : 'Additional'}</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-black text-white">{lang === 'mn' ? 'Үнэ тариф' : 'Pricing'}</a>
          <button onClick={() => { toggle(); setMobileMenuOpen(false); }} className="text-xl font-black text-emerald-500 text-left">
            {lang === "mn" ? "English" : "Mongolian"}
          </button>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-5 py-3 mt-4 text-center rounded-full bg-emerald-600 text-white text-lg font-bold">
            {lang === 'mn' ? 'Холбогдох' : 'Contact'}
          </a>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* LUXURY BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#050505]" />
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
        <section id="pricing" className="py-12 md:py-24 relative z-10 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8">{data?.pricing?.title || defaults.pricing.title}</h2>
                <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full" />
            </div>
            
            <div className={`grid ${getGridCols(pricing.length)} gap-8`}>
                {pricing.map((tier, i) => (
                  <PricingTier key={i} tier={tier} index={i} totalCount={pricing.length} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-10 relative z-10 border-t border-white/5 px-6 md:px-24">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/rently.png"
                    alt="Rently Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-black tracking-tighter text-white">Rently</span>
               </div>
               <p className="text-white/30 max-w-sm text-xs leading-relaxed">"Simplicity is the ultimate sophistication."</p>
            </div>
            <div className="flex flex-col gap-3">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Navigation</span>
               <div className="flex flex-col gap-2 text-white/50 font-bold uppercase tracking-widest text-[9px]">
                  <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
                  <Link href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
               </div>
            </div>
            <div className="flex flex-col gap-3">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Contact</span>
               <div className="text-white/50 font-bold uppercase tracking-widest text-[9px] leading-loose">
                  Ulaanbaatar, MN<br />
                  contact@rently.com
               </div>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
            <p>© {new Date().getFullYear()} RENTLY — All Rights Reserved</p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
         </div>
      </footer>
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

function PricingTier({ tier, index, totalCount }: { tier: any; index: number; totalCount: number }) {
  const { ref, visible } = useReveal();
  const isMiddle = totalCount === 3 && index === 1;
  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 150}ms` }}>
       <div className={`p-6 md:p-8 rounded-[20px] md:rounded-[24px] h-full flex flex-col transition-all duration-700 ${isMiddle ? "bg-emerald-600 shadow-[0_0_40px_rgba(6,78,59,0.3)] md:scale-105" : "bg-white/5 border border-white/10 hover:bg-white/[0.08]"}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-6 ${isMiddle ? "bg-white/20" : "bg-emerald-500/20"}`}>
             <Plus size={14} className={isMiddle ? "text-white" : "text-emerald-400"} />
          </div>
          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] mb-3 block ${isMiddle ? "text-white/60" : "text-emerald-500"}`}>{tier.name}</span>
          <h3 className="text-white text-2xl md:text-3xl font-black mb-2 md:mb-4">{tier.price}</h3>
          <p className={`text-[10px] md:text-xs mb-8 font-medium ${isMiddle ? "text-white/70" : "text-white/40"}`}>{tier.desc}</p>
       </div>
    </div>
  );
}
