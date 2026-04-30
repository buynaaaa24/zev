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

  // Prevent scroll when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    
    // Extract ID using a robust regex
    const ytIdMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
    const videoId = ytIdMatch ? ytIdMatch[1] : null;

    if (videoId) {
      const isShort = cleanUrl.includes("/shorts/");
      return { 
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`, 
        type: isShort ? "youtube-short" : "youtube" 
      };
    }
    
    return { url: cleanUrl, type: "video" };
  };

  const videoData = activeVideo ? getEmbedUrl(activeVideo.videoUrl || "") : null;

  return (
    <section id="work" className="bg-white py-32 lg:py-44 relative">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        
        <div 
          ref={headerRef}
          className="mb-20"
          style={{ 
            opacity: headerVis ? 1 : 0, 
            transform: headerVis ? "translateY(0)" : "translateY(20px)", 
            transition: "opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)" 
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight leading-[1.1] text-neutral-900 mb-6">
            {properties.header.titleLine1 || "Crafting the"}<br />
            <span className="text-neutral-400">
              {properties.header.titleAccent || "extraordinary."}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 relative z-10">
          {displayProjects.map((p, i) => (
            <div 
              key={p.id} 
              className="group"
              style={{ 
                opacity: headerVis ? 1 : 0, 
                transform: headerVis ? "translateY(0)" : "translateY(40px)", 
                transition: `opacity 1s ${i * 100}ms cubic-bezier(0.22, 1, 0.36, 1), transform 1s ${i * 100}ms cubic-bezier(0.22, 1, 0.36, 1)` 
              }}
            >
              <div 
                onClick={() => p.videoUrl && setActiveVideo(p)}
                className={`relative aspect-[16/10] overflow-hidden rounded-[32px] bg-neutral-100 mb-6 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-neutral-200 group-hover:-translate-y-1 ${p.videoUrl ? 'cursor-pointer' : ''}`}
              >
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {p.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-neutral-900 border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-2">
                <p className="text-neutral-400 text-sm font-medium uppercase tracking-widest mb-2">{p.category}</p>
                <h3 className="text-neutral-900 text-2xl font-semibold tracking-tight group-hover:text-accent-600 transition-colors">
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Video Player Modal */}
      {activeVideo && videoData && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999999, backgroundColor: 'rgba(0,0,0,0.95)' }}
        >
          {/* Dismiss Layer */}
          <div 
            onClick={() => setActiveVideo(null)}
            className="absolute inset-0 cursor-zoom-out"
          />

          {/* Player Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center justify-center w-full h-full max-w-7xl max-h-[90vh] pointer-events-none"
          >
            {/* Close Button at Top */}
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-all p-2 pointer-events-auto"
            >
              <X size={32} />
            </button>

            {/* Video Box */}
            <div 
              className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl pointer-events-auto ${
                videoData.type === "youtube-short" ? "h-[80vh] aspect-[9/16]" : "w-full aspect-video"
              }`}
              style={{ 
                boxShadow: "0 0 100px rgba(0,0,0,1)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <div className="w-full h-full relative">
                {videoData.type.startsWith("youtube") ? (
                  <iframe
                    src={videoData.url}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="YouTube video player"
                  />
                ) : (
                  <video 
                    src={videoData.url} 
                    className="w-full h-full object-contain"
                    autoPlay 
                    controls 
                    playsInline
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            {activeVideo.redirectUrl && (
              <div className="mt-8 pointer-events-auto">
                <a 
                  href={activeVideo.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-neutral-100 transition-all shadow-xl active:scale-95"
                >
                  <span>Visit Project</span>
                  <ArrowRight size={20} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


