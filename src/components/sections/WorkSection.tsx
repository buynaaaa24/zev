"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X, Play } from "lucide-react";
import { PropertiesPageSections } from "@/lib/site-content-types";

import { resolveMediaUrl } from "@/lib/media";

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

const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isDirectVideo(src: string) {
  return VIDEO_EXTS.test(src);
}

function getYoutubeThumbUrl(url: string) {
  if (!url) return null;
  const cleanUrl = url.trim();
  const ytIdMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
  const videoId = ytIdMatch ? ytIdMatch[1] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0`;
  }
  return null;
}

function ModalVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [src]);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-contain sm:object-cover"
      playsInline
      controls
      autoPlay
    />
  );
}

function ProjectCard({ 
  project: p, 
  index: i, 
  headerVis, 
  onSelect 
}: { 
  project: Project; 
  index: number; 
  headerVis: boolean; 
  onSelect: (p: Project) => void;
}) {
  const hasDirectVideo = p.videoUrl && isDirectVideo(p.videoUrl);
  const ytThumbUrl = p.videoUrl && !hasDirectVideo ? getYoutubeThumbUrl(p.videoUrl) : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  const imageIsVideo = p.image && isDirectVideo(p.image);

  return (
    <div 
      key={p.id} 
      className={`group relative flex flex-col gap-5 transition-all duration-1000 ${headerVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      style={{ transitionDelay: `${i * 150}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={() => p.videoUrl && onSelect(p)}
        className={`relative aspect-[4/3] md:aspect-[16/11] w-full overflow-hidden rounded-[32px] bg-neutral-900 border border-white/10 transition-all duration-700 group-hover:shadow-[0_30px_80px_rgba(99,102,241,0.2)] group-hover:-translate-y-2 ${p.videoUrl ? 'cursor-pointer' : ''}`}
      >
        {/* Subtle Vignette & Glow */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

        {/* Cover Image */}
        {p.image && !imageIsVideo ? (
          <img 
            src={resolveMediaUrl(p.image)} 
            alt={p.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : null}

        {/* Hover Video or Main Video */}
        {imageIsVideo ? (
          <video
            ref={videoRef}
            src={resolveMediaUrl(p.image)}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105"
          />
        ) : hasDirectVideo ? (
          <video
            ref={videoRef}
            src={resolveMediaUrl(p.videoUrl!)}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 ${p.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
          />
        ) : ytThumbUrl && (isHovered || !p.image) ? (
          <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000 ease-out group-hover:scale-105 bg-black ${p.image ? 'animate-in fade-in duration-700' : ''}`}>
            <iframe
              src={ytThumbUrl}
              className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none opacity-80"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        ) : !p.image ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <span className="text-white/20 font-medium tracking-widest text-xs uppercase">No Media</span>
          </div>
        ) : null}

        {/* Play Overlay (iOS style) */}
        {p.videoUrl && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md shadow-2xl">
              <Play fill="white" className="ml-1 opacity-80" size={24} />
            </div>
          </div>
        )}

        <div className="absolute top-6 left-6 z-30 px-3 py-1 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl opacity-100 transition-all duration-500">
          <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.15em]">{p.category}</span>
        </div>
      </div>
      
      <div className="px-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white text-3xl font-black tracking-tight group-hover:text-indigo-400 transition-colors">
              {p.title}
            </h3>
            {p.category && (
              <p className="mt-1 text-white/50 font-medium text-base tracking-wide">{p.category}</p>
            )}
          </div>
          {p.redirectUrl ? (
            <a 
              href={p.redirectUrl}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 active:scale-95"
            >
              <ArrowRight size={20} />
            </a>
          ) : (
            <div className="shrink-0 w-12 h-12 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <ArrowRight size={20} className="text-white/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkSection({ 
  properties, 
  lang = "mn",
  bgImages = [] 
}: { 
  properties: PropertiesPageSections;
  lang?: string;
  bgImages?: string[];
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);
  const [bgIdx, setBgIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Slide Cycle (matching Hero)
  useEffect(() => {
    if (bgImages.length <= 1) return;
    const id = setInterval(() => {
      setBgIdx(prev => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [bgImages.length]);

  // Particle canvas (matching Hero)
  useEffect(() => {
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
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.2, dy: -Math.random() * 0.3 - 0.05,
        alpha: Math.random() * 0.2 + 0.05,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,160,255,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
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

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

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
    
    const ytIdMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
    const videoId = ytIdMatch ? ytIdMatch[1] : null;

    if (videoId) {
      const isShort = cleanUrl.includes("/shorts/");
      return { 
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`, 
        type: isShort ? "youtube-short" : "youtube" 
      };
    }
    
    return { url: resolveMediaUrl(cleanUrl), type: "video" };
  };

  const videoData = activeVideo ? getEmbedUrl(activeVideo.videoUrl || "") : null;

  return (
    <section id="work" className="relative py-32 lg:py-48 overflow-hidden bg-black selection:bg-indigo-600 selection:text-white">
      {/* Background Images (matching Hero) */}
      {bgImages.length > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {bgImages.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-[3000ms] ease-out bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === bgIdx ? 0.35 : 0,
                transform: i === bgIdx ? "scale(1.08)" : "scale(1)",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,102,204,0.15) 0%, transparent 70%)" }} />
      )}

      {/* Background Elements (Hero-like overlay) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-40" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] z-[1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "72px 72px" }} aria-hidden />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        
        <div 
          ref={headerRef}
          className={`mb-24 transition-all duration-1000 ${headerVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
            {properties.header.badge || "Portfolio"}
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-[88px] font-black tracking-tighter leading-[0.9] text-white mb-8">
            {properties.header.titleLine1 || "Crafting the"}<br />
            <span className="bg-gradient-to-r from-white via-white/80 to-indigo-500 text-transparent bg-clip-text">
              {properties.header.titleAccent || "extraordinary."}
            </span>
          </h2>
          {properties.header.intro && (
            <p className="text-white/40 text-xl font-medium max-w-2xl leading-relaxed">
              {properties.header.intro}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {displayProjects.map((p, i) => (
            <ProjectCard 
              key={p.id} 
              project={p} 
              index={i} 
              headerVis={headerVis} 
              onSelect={setActiveVideo} 
            />
          ))}
        </div>

        {/* CTA Button */}
        
      </div>

      {/* Full-Screen Lightbox Modal (FoodCity Style) */}
      {activeVideo && videoData && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 flex flex-col bg-black animate-in fade-in duration-300"
          style={{ zIndex: 9999999 }}
        >
          <div className="absolute top-4 right-4 z-30">
            <button 
              onClick={() => setActiveVideo(null)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex-1 animate-in zoom-in-95 duration-300 flex items-center justify-center p-4 sm:p-10 pb-32">
            <div 
              className={`relative w-full overflow-hidden bg-black rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${
                videoData.type === "youtube-short" ? "max-w-[400px] h-[80vh]" : "max-w-6xl aspect-video"
              }`}
              style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
            >
              {videoData.type.startsWith("youtube") ? (
                <iframe
                  src={videoData.url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="YouTube video player"
                />
              ) : (
                <ModalVideoPlayer src={videoData.url} />
              )}
            </div>
          </div>

          {/* Modal Info Bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent px-8 pb-8 pt-32 pointer-events-none flex items-end justify-between">
            <div>
              <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-2 block">
                {activeVideo.category}
              </span>
              <h4 className="text-white text-3xl sm:text-4xl font-black tracking-tight">{activeVideo.title}</h4>
            </div>
            {activeVideo.redirectUrl && (
              <a 
                href={activeVideo.redirectUrl} 
                className="pointer-events-auto inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
              >
                Үзэх <ArrowRight size={18} />
              </a>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}


