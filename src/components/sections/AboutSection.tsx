"use client";

import { useEffect, useRef, useState } from "react";
import { AboutSections, PartnerLogo } from "@/lib/site-content-types";

// Features remain static for now to maintain the rich Apple iconography, 
// but titles and descriptions are mapped from the CMS about.main field.
const FEATURES = [
  { title: "Modular Architecture", desc: "Every component composable, scalable, replaceable — your platform grows with you." },
  { title: "Blazing Performance", desc: "Sub-second loads and silky 60fps animations. We obsess over milliseconds." },
  { title: "Precision Design", desc: "Pixel-perfect interfaces with the same rigor Apple applies to hardware." },
  { title: "Enterprise Security", desc: "End-to-end encryption and role-based access built into every layer." },
  { title: "Global Ready", desc: "Multi-language, multi-tenant, multi-region. Scales wherever you go." },
  { title: "Always Evolving", desc: "Continuous delivery — your platform improves automatically, zero downtime." },
];

function FeatureCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 80}ms`,
        transitionDuration: "800ms",
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
      }}
      className="group bg-white rounded-3xl p-10 border border-neutral-100/80 hover:border-accent-200 hover:shadow-2xl hover:shadow-accent-500/10 cursor-default transition-all duration-500 hover:-translate-y-2"
    >
      <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6 group-hover:bg-accent-50 group-hover:scale-110 transition-all duration-500">
        <div className="w-6 h-6 rounded-lg bg-accent-500/20 flex items-center justify-center">
           <div className="w-2 h-2 rounded-full bg-accent-500" />
        </div>
      </div>
      <h3 className="text-neutral-900 font-bold text-xl mb-3 group-hover:text-accent-600 transition-colors duration-300">{title}</h3>
      <p className="text-neutral-500 text-[15px] leading-relaxed font-light">{desc}</p>
    </div>
  );
}

export default function AboutSection({ about, partners = [] }: { about: AboutSections["main"]; partners?: PartnerLogo[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);

  // Map CMS stats to features. If no stats, use defaults.
  const displayFeatures = about.stats && about.stats.length > 0 
    ? about.stats.map((s) => ({
        title: s.value,
        desc: s.label
      }))
    : FEATURES;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="bg-neutral-50 py-32 lg:py-44 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Animated header */}
        <div
          ref={headerRef}
          className="max-w-2xl mb-20"
          style={{
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(60px)",
            transition: "opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.06] text-neutral-800 mb-5">
            {about.h2Line1 || "Where technology"}<br />
            <span style={{ background: "linear-gradient(135deg,#0066CC,#2f77e8,#55a3ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {about.h2Accent || "meets elegance."}
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed font-light">
            {about.p1 || "Software should feel inevitable — so natural and refined that using it feels like second nature."}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayFeatures.map((f, i) => (
            <FeatureCard key={i} {...f} index={i} />
          ))}
        </div>

        {/* Quote */}
        <QuoteBlock quote={about.p2} attribution={about.yearsLabel} />

        {/* Partners Slider */}
        {partners.length > 0 && (
          <div className="mt-40">
            <p className="text-center text-neutral-400 text-sm font-bold uppercase tracking-widest mb-12">Хамтрагч байгууллагууд</p>
            <div className="relative w-full overflow-hidden">
              <div className="flex partner-marquee">
                {/* Double the array for seamless infinite scroll */}
                {[...partners, ...partners, ...partners].map((logo, i) => (
                  <div key={i} className="flex-shrink-0 mx-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <img src={logo.src} alt={logo.name} className="h-8 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteBlock({ quote, attribution }: { quote?: string; attribution?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const text = quote || "The best interface is the one you never notice because it just works.";

  return (
    <div
      ref={ref}
      className="mt-28 text-center max-w-4xl mx-auto"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)", transition: "opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94)" }}
    >
      <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 leading-tight">
        &ldquo;
        <span style={{ background: "linear-gradient(135deg,#0066CC,#2f77e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {text}
        </span>
        &rdquo;
      </blockquote>
      <p className="mt-4 text-neutral-400 text-sm">— {attribution || "Zevtabs Design Philosophy"}</p>
    </div>
  );
}
