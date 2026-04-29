"use client";

import { useEffect, useRef, useState } from "react";
import { PropertiesPageSections } from "@/lib/site-content-types";

const DEFAULT_PROJECTS = [
  { id: 1, title: "Zev Dashboard", category: "Product Design", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" },
  { id: 2, title: "Luxe Mobile", category: "iOS Development", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000" },
  { id: 3, title: "Cloud Scale", category: "Infrastructure", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000" },
  { id: 4, title: "Quantum UI", category: "Design System", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000" },
];

export default function WorkSection({ properties }: { properties: PropertiesPageSections }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayProjects = properties.items.length > 0 
    ? properties.items.map(item => ({
        id: item.id,
        title: item.name,
        category: item.category,
        image: item.image
      }))
    : DEFAULT_PROJECTS;

  return (
    <section id="showcase" className="bg-neutral-50 py-32 lg:py-44">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        
        <div 
          ref={headerRef}
          className="max-w-2xl mb-20"
          style={{ opacity: headerVis ? 1 : 0, transform: headerVis ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.06] text-neutral-800 mb-6">
            {properties.header.titleLine1 || "Crafting the"}<br />
            <span style={{ background: "linear-gradient(135deg,#0066CC,#2f77e8,#55a3ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {properties.header.titleAccent || "extraordinary."}
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed font-light">
            {properties.header.intro || "A selection of projects where design meets high-performance engineering."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {displayProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: { title: string; category: string; image: string }, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-200"
      style={{ 
        opacity: vis ? 1 : 0, 
        transform: vis ? "translateY(0) scale(1)" : "translateY(60px) scale(0.98)", 
        transition: `opacity 0.8s ${index * 100}ms cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s ${index * 100}ms cubic-bezier(0.25,0.46,0.45,0.94)` 
      }}
    >
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{project.category}</p>
        <h3 className="text-white text-2xl font-bold">{project.title}</h3>
      </div>
    </div>
  );
}
