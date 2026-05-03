"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { ServicesSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";

type ServiceFeature = {
  id: string;
  title: string;
  desc: string;
  image: string;
  accent: string;
};

const DEFAULT_ACCENTS = [
  "rgb(99, 102, 241)", // Indigo
  "rgb(236, 72, 153)", // Pink
  "rgb(34, 197, 94)",  // Green
  "rgb(168, 85, 247)"  // Purple
];

const DEFAULT_IMAGES = [
  "/service_dev_3d_1777823188443.png",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bbbda5366a71?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
];

function InteractiveImage({ src, accent }: { src: string; accent: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full h-full flex items-center justify-center cursor-crosshair"
    >
      {/* Dynamic Background Glow */}
      <motion.div 
        className="absolute inset-0 blur-[140px] opacity-25 rounded-full"
        animate={{ backgroundColor: accent }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[85%] h-[85%] flex items-center justify-center"
        style={{ transform: "translateZ(50px)" }}
      >
        <img 
          src={src} 
          alt="Service Detail"
          className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
        />
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ services }: { services: ServicesSections }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const features = services.features.length > 0 
    ? services.features.map((f, i) => ({
        id: (i + 1).toString().padStart(2, '0'),
        title: f.title,
        desc: f.desc,
        image: f.image ? resolveMediaUrl(f.image) : DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
        accent: f.accent || DEFAULT_ACCENTS[i % DEFAULT_ACCENTS.length]
      }))
    : [];

  if (features.length === 0) return null;

  return (
    <section id="services" ref={sectionRef} className="bg-white py-16 lg:py-24 overflow-hidden relative scroll-mt-20">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-neutral-50/50 pointer-events-none select-none z-0">
        SERVICES
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 relative z-10">
        
        {/* Header - Editorial Style */}
        <div className={`mb-12 lg:mb-20 flex flex-col items-center sm:items-end sm:flex-row justify-between text-center sm:text-left gap-8 transition-all duration-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="max-w-xl">
            <span className="text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              {services.header.badge || "Capabilities"}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 leading-[0.9] mb-4">
              {services.header.h2Line1 || "Everything"}<br />
              <span className="text-neutral-200 italic">{services.header.h2Accent || "Simplified"}</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-base sm:text-lg font-light max-w-sm border-t-2 sm:border-t-0 sm:border-l-2 border-neutral-100 pt-6 sm:pt-0 sm:pl-6 italic">
            "{services.header.intro || "Focused, opinionated solutions built to move fast and last long."}"
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-40">
          
          {/* Left Column: List with Advanced State */}
          <div className="w-full lg:w-[450px] space-y-2 lg:space-y-3 shrink-0 order-2 lg:order-1">
            {features.map((f, i) => (
              <motion.button
                key={f.id}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
                className={`w-full text-left p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] flex items-center gap-4 sm:gap-6 transition-all duration-500 relative group overflow-hidden ${activeIdx === i ? "bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)] ring-1 ring-neutral-100" : "hover:bg-neutral-50/50"}`}
              >
                {/* Active Indicator Bar */}
                {activeIdx === i && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: f.accent }}
                  />
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${activeIdx === i ? "bg-black text-white rotate-45 scale-110" : "bg-neutral-100 text-neutral-300 group-hover:bg-neutral-200"}`}>
                  <Plus size={20} className="transition-transform duration-500" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeIdx === i ? "text-indigo-600" : "text-neutral-200"}`}>
                      {f.id}
                    </span>
                    {activeIdx === i && <ArrowRight size={14} className="text-indigo-600 animate-pulse" />}
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight transition-all duration-500 ${activeIdx === i ? "text-neutral-900 translate-x-1" : "text-neutral-300"}`}>
                    {f.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right Column: 3D Interactive Display */}
          <div className="flex-1 w-full aspect-square lg:h-[700px] relative order-1 lg:order-2">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeIdx}
                 initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                 className="w-full h-full"
               >
                 {/* Main Image View */}
                 <InteractiveImage src={features[activeIdx].image} accent={features[activeIdx].accent} />

                 {/* Editorial Description Card */}
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1, duration: 0.4 }}
                   className="absolute bottom-6 right-0 lg:-right-10 max-w-[280px] p-8 bg-white/60 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-xl z-50 hidden sm:block"
                 >
                   <p className="text-neutral-800 text-base leading-relaxed font-bold tracking-tight">
                     {features[activeIdx].desc}
                   </p>
                 </motion.div>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
