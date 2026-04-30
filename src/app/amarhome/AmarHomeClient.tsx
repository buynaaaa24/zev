"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AmarHomeSections } from "@/lib/site-content-types";
import AmarHomeNavbar from "../../components/amarhome/AmarHomeNavbar";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { useAmarHomeLang } from "@/contexts/AmarHomeLangContext";

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
      title: "Your Sanctuary.",
      tiers: [
        { name: "Urban", price: "Custom", desc: "Optimized for high-end apartments and lofts." },
        { name: "Family", price: "Custom", desc: "Comprehensive ecosystem for residential homes." },
        { name: "Global", price: "Custom", desc: "The ultimate standard for estates and retreats." },
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
      title: "Таны Орон Зай.",
      tiers: [
        { name: "Urban", price: "Захиалгат", desc: "Орчин үеийн орон сууц болон лофтод зориулагдсан." },
        { name: "Family", price: "Захиалгат", desc: "Гэр бүлийн хауст зориулсан бүрэн экосистем." },
        { name: "Global", price: "Захиалгат", desc: "Эдлэн газар болон виллад зориулсан дээд зэргийн стандарт." },
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

export default function AmarHomeClient({ initialData }: { initialData?: AmarHomeSections }) {
  const data = initialData || DEFAULTS.en;
  const defaults = DEFAULTS.en;
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setSections } = useAmarHomeLang();
  
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
    image: data.hero.image || defaults.hero.image,
  };

  // CLEAN DATA
  const features = (data.features.items || []).filter(i => i.title && i.title.trim() !== "");
  const hardware = (data.hardware.items || []).filter(i => i.name && i.name.trim() !== "");
  const pricing = (data.pricing.tiers || []).filter(i => i.name && i.name.trim() !== "");

  // Update Navbar visibility context
  useEffect(() => {
    if (setSections) {
      setSections({
        features: features.length > 0,
        hardware: hardware.length > 0,
        pricing: pricing.length > 0,
      });
    }
  }, [features.length, hardware.length, pricing.length, setSections]);

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-lg mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <main className="bg-[#050505] selection:bg-emerald-600 selection:text-white min-h-screen relative overflow-hidden font-sans">
      <AmarHomeNavbar />

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
              <h1 className="display-xl text-white mb-6">
                 {hero.title}<br />
                 <span className="bg-gradient-to-r from-emerald-400 to-white text-transparent bg-clip-text italic pr-4">{hero.titleAccent}</span>
              </h1>
              <p className="body-lg text-white/40 max-w-lg mb-10">
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

      {/* FEATURES (Онцлог) */}
      {features.length > 0 && (
        <section id="features" className="py-12 md:py-24 relative z-10 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12 md:mb-20 max-w-2xl mx-auto">
                <h2 className="display-lg text-white mb-6">
                  {data.features.title}
                </h2>
                <p className="body-lg text-white/40">{data.features.desc}</p>
            </div>
            
            <div className="space-y-16 md:space-y-24">
                {features.map((item, idx) => (
                  <FeatureRow key={idx} item={item} index={idx} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* HARDWARE (Төхөөрөмжүүд) */}
      {hardware.length > 0 && (
        <section id="hardware" className="py-12 md:py-24 bg-neutral-900/10 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 md:mb-16">
                <h2 className="display-lg text-white">{data.hardware.title}</h2>
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
        <section id="pricing" className="py-12 md:py-24 relative z-10 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="display-lg text-white mb-8">{data.pricing.title}</h2>
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
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                     <img src="/amarhome-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-white">AMAR<span className="text-emerald-500">HOME</span></span>
               </div>
               <p className="text-white/30 max-w-sm text-xs leading-relaxed">"Simplicity is the ultimate sophistication." — Leonardo da Vinci</p>
            </div>
            <div className="flex flex-col gap-3">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Navigation</span>
               <div className="flex flex-col gap-2 text-white/50 font-bold uppercase tracking-widest text-[9px]">
                  <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
                  <Link href="#hardware" className="hover:text-emerald-400 transition-colors">Hardware</Link>
                  <Link href="#pricing" className="hover:text-emerald-400 transition-colors">Investment</Link>
               </div>
            </div>
            <div className="flex flex-col gap-3">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Contact</span>
               <div className="text-white/50 font-bold uppercase tracking-widest text-[9px] leading-loose">
                  Ulaanbaatar, MN<br />
                  contact@amarhome.com
               </div>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
            <p>© 2026 AMARHOME — All Rights Reserved</p>
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

function HardwareSpotlight({ item, index }: { item: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 150}ms` }}>
       <div className="relative aspect-[4/3] md:aspect-square rounded-[24px] md:rounded-[40px] bg-neutral-900/40 border border-white/10 mb-4 md:mb-6 overflow-hidden group">
          {item.image ? (
             <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
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
