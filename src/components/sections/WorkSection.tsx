"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { PropertiesPageSections } from "@/lib/site-content-types";

type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  videoUrl?: string;
  redirectUrl?: string;
};

const DEFAULT_PROJECTS: Project[] = [
  { id: 1, title: "Zev Dashboard", category: "Product Design", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" },
  { id: 2, title: "Luxe Mobile", category: "iOS Development", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000" },
  { id: 3, title: "Cloud Scale", category: "Infrastructure", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000" },
  { id: 4, title: "Quantum UI", category: "Design System", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000" },
];

export default function WorkSection({ properties }: { properties: PropertiesPageSections }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayProjects: Project[] = properties.items.length > 0 
    ? properties.items.map(item => ({
        id: item.id,
        title: item.name,
        category: item.category,
        image: item.image,
        videoUrl: item.videoUrl,
        redirectUrl: item.redirectUrl,
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
            <ProjectCard 
              key={p.id} 
              project={p} 
              index={i} 
              onClick={() => p.videoUrl && setActiveVideo(p)} 
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[1001]"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
            <video 
              src={activeVideo.videoUrl} 
              className="w-full h-full object-contain"
              autoPlay 
              controls 
              playsInline
            />
            
            {activeVideo.redirectUrl && (
              <a 
                href={activeVideo.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 right-8 flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 group shadow-lg"
              >
                <span>Дараах</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project, index: number, onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 20;
    const tiltY = (centerX - x) / 20;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const hasVideo = !!project.videoUrl;

  return (
    <div 
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-200 perspective-1200 preserve-3d transition-all duration-700 ${hasVideo ? 'cursor-pointer' : ''}`}
      style={{ 
        opacity: vis ? 1 : 0, 
        transform: vis 
          ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0) scale(1)` 
          : "perspective(1200px) translateY(60px) scale(0.98)", 
        transition: `opacity 0.8s ${index * 100}ms cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)` 
      }}
    >
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ transform: `translateZ(20px)` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
        {hasVideo && (
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-2xl" style={{ transform: "translateZ(50px)" }}>
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transform: "translateZ(40px)" }}>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{project.category}</p>
        <h3 className="text-white text-2xl font-bold">{project.title}</h3>
        {hasVideo && <span className="text-[10px] text-blue-400 font-bold uppercase mt-2 block">Video Available</span>}
      </div>
    </div>
  );
}

