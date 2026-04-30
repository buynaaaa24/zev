"use client";

import { useEffect, useRef, useState } from "react";
import { ServicesSections } from "@/lib/site-content-types";

// Static fallback data for the Apple aesthetic
const DEFAULT_SERVICES = [
  { n: "01", title: "Digital Platform", desc: "End-to-end platform design and development. Architecture to deployment.", tags: ["Architecture", "APIs", "Cloud"] },
  { n: "02", title: "Product Design", desc: "UX research, interface design, and interactive prototyping.", tags: ["UX Research", "UI Design", "Prototyping"] },
  { n: "03", title: "Data & Analytics", desc: "Real-time dashboards, BI, and predictive analytics.", tags: ["Dashboards", "BI", "ML"] },
  { n: "04", title: "Content Management", desc: "Headless CMS, multi-site workflows. Your team in control, no code.", tags: ["CMS", "Workflows", "Multi-site"] },
];

function ServiceRow({ s, index }: { s: { n: string; title: string; desc: string; tags: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateX(0)" : index % 2 === 0 ? "translateX(-40px)" : "translateX(40px)",
        transitionDelay: `${index * 100}ms`,
        transitionDuration: "700ms",
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
      className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 py-10 border-b border-neutral-100 last:border-none hover:bg-neutral-50 -mx-6 px-6 rounded-2xl transition-colors duration-300 cursor-default"
    >
      <span className="text-neutral-200 font-black text-4xl md:text-5xl shrink-0 w-14 group-hover:text-accent-400 transition-colors duration-500 tabular-nums">{s.n}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-neutral-800 font-bold text-xl mb-1.5 group-hover:text-accent-600 transition-colors duration-300">{s.title}</h3>
        <p className="text-neutral-400 text-[14px] leading-relaxed max-w-lg">{s.desc}</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        {s.tags.map(t => (
          <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-500 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors duration-300">{t}</span>
        ))}
      </div>
    </div>

  );
}

export default function ServicesSection({ services }: { services: ServicesSections }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayFeatures = services.features.length > 0 
    ? services.features.map((f, i) => ({
        n: (i + 1).toString().padStart(2, '0'),
        title: f.title,
        desc: f.desc,
        tags: []
      }))
    : DEFAULT_SERVICES;

  return (
    <section id="services" className="bg-white py-32 lg:py-44 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">

        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
          style={{ opacity: headerVis ? 1 : 0, transform: headerVis ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.06] text-neutral-800">
              {services.header.h2Line1 || "Everything you need."}<br />
              <span style={{ background: "linear-gradient(135deg,#0066CC,#2f77e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {services.header.h2Accent || "Nothing you don't."}
              </span>
            </h2>
          </div>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-sm lg:text-right font-light">
            {services.header.intro || "Focused, opinionated solutions built to move fast and last long."}
          </p>
        </div>

        <div className="divide-y divide-neutral-100">
          {displayFeatures.map((s, i) => <ServiceRow key={i} s={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
