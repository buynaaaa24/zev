"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  {
    id: 1,
    title: "Zev Dashboard",
    category: "Product Design",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    title: "Luxe Mobile",
    category: "iOS Development",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    title: "Cloud Scale",
    category: "Infrastructure",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    title: "Quantum UI",
    category: "Design System",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
  },
];

const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isDirectVideo(src: string) {
  return VIDEO_EXTS.test(src);
}

function getYoutubeThumbUrl(url: string) {
  if (!url) return null;
  const cleanUrl = url.trim();
  const ytIdMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/,
  );
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

/* ── 3D Carousel ── */
function ThreeDCarousel({
  projects,
  headerVis,
  onSelect,
  ctaLabel,
}: {
  projects: Project[];
  headerVis: boolean;
  onSelect: (p: Project) => void;
  ctaLabel: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      if (!pausedRef.current) {
        setRotation((prev) => prev + delta * 0.02);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleHover = useCallback((idx: number | null) => {
    setHoveredIdx(idx);
    pausedRef.current = idx !== null;
  }, []);

  const count = projects.length;
  const angleStep = 360 / count;
  const RADIUS = 300;
  const CARD_W = 180;
  const CARD_H = 240;

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: 640, perspective: "1100px" }}
    >
      {/* Ambient center glow */}
      <div className="absolute w-56 h-56 rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none" />

      {/* Rotating 3D stage — all cards orbit inside this */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(-8deg) rotateY(${rotation}deg)`,
        }}
      >
        {projects.map((p, i) => {
          const cardAngle = angleStep * i;
          const effectiveAngle = (((cardAngle + rotation) % 360) + 360) % 360;
          const cosDepth = Math.cos((effectiveAngle * Math.PI) / 180);
          const depthOpacity = Math.max(0.18, (cosDepth + 1) / 2);
          const isHovered = hoveredIdx === i;
          const imageIsVideo = p.image && isDirectVideo(p.image);

          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                width: CARD_W,
                height: CARD_H,
                left: -CARD_W / 2,
                top: -CARD_H / 2,
                transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                opacity: headerVis ? (isHovered ? 1 : depthOpacity) : 0,
                transition: "opacity 0.4s ease",
                cursor: "pointer",
              }}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleHover(null)}
            >
              <div
                className={`w-full h-full relative overflow-hidden rounded-[24px] border backdrop-blur-xl transition-all duration-500 ${
                  isHovered
                    ? "border-indigo-500/40 shadow-[0_30px_100px_rgba(99,102,241,0.45)] bg-white/[0.08] scale-[1.13]"
                    : "border-white/10 bg-white/[0.03] scale-100"
                }`}
              >
                {/* Media */}
                <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                  {p.image && !imageIsVideo ? (
                    <img
                      src={resolveMediaUrl(p.image)}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      loading="lazy"
                    />
                  ) : imageIsVideo ? (
                    <video
                      src={resolveMediaUrl(p.image)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-black flex items-center justify-center">
                      <span className="text-white/10 text-6xl font-black">
                        {i + 1}
                      </span>
                    </div>
                  )}

                  {isHovered && p.videoUrl && isDirectVideo(p.videoUrl) && (
                    <video
                      src={resolveMediaUrl(p.videoUrl)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover z-10 animate-in fade-in duration-500"
                    />
                  )}
                  {isHovered &&
                    p.videoUrl &&
                    !isDirectVideo(p.videoUrl) &&
                    getYoutubeThumbUrl(p.videoUrl) && (
                      <iframe
                        src={getYoutubeThumbUrl(p.videoUrl)!}
                        className="absolute inset-0 w-full h-full z-10 pointer-events-none scale-[1.15] animate-in fade-in duration-500"
                        allow="autoplay; encrypted-media"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[15]" />
                </div>

                {/* Play button */}
                {p.videoUrl && isHovered && (
                  <div
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    onClick={() => onSelect(p)}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center backdrop-blur-xl hover:bg-white/30 transition-all">
                      <Play fill="white" className="ml-1" size={18} />
                    </div>
                  </div>
                )}

                {/* Info — visible on hover */}
                <div
                  className={`absolute bottom-0 inset-x-0 z-20 p-4 transition-all duration-500 ${
                    isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3"
                  }`}
                >
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider mb-1.5">
                    {p.category}
                  </span>
                  <h3 className="text-white text-base font-black tracking-tight leading-tight">
                    {p.title}
                  </h3>
                  {p.redirectUrl && (
                    <a
                      href={p.redirectUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1.5 text-indigo-400 text-xs font-bold hover:text-white transition-colors"
                    >
                      {ctaLabel} <ArrowRight size={12} />
                    </a>
                  )}
                </div>

                {/* Compact title when not hovered */}
                {!isHovered && (
                  <div className="absolute inset-0 z-20 flex items-end justify-center pb-3">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider opacity-80 truncate px-2 text-center">
                      {p.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkSection({
  properties,
  lang = "mn",
  bgImages = [],
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
      setBgIdx((prev) => (prev + 1) % bgImages.length);
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
    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      alpha: number;
    }[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.2,
        dy: -Math.random() * 0.3 - 0.05,
        alpha: Math.random() * 0.2 + 0.05,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,160,255,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayProjects: Project[] =
    properties.items.length > 0
      ? properties.items.map((item) => ({
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
    return () => {
      document.body.style.overflow = "";
    };
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

    const ytIdMatch = cleanUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/,
    );
    const videoId = ytIdMatch ? ytIdMatch[1] : null;

    if (videoId) {
      const isShort = cleanUrl.includes("/shorts/");
      return {
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
        type: isShort ? "youtube-short" : "youtube",
      };
    }

    return { url: resolveMediaUrl(cleanUrl), type: "video" };
  };

  const videoData = activeVideo
    ? getEmbedUrl(activeVideo.videoUrl || "")
    : null;

  return (
    <section
      id="work"
      className="relative py-32 lg:py-48 overflow-hidden bg-black selection:bg-indigo-600 selection:text-white"
    >
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
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,102,204,0.15) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Background Elements (Hero-like overlay) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-40"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        <div
          ref={headerRef}
          className={`mb-16 text-center transition-all duration-1000 ${headerVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
            {properties.header.badge || "Portfolio"}
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-[88px] font-black tracking-tighter leading-[0.9] text-white mb-8">
            {properties.header.titleLine1 || "Crafting the"}
            <br />
            <span className="bg-gradient-to-r from-white via-white/80 to-indigo-500 text-transparent bg-clip-text">
              {properties.header.titleAccent || "extraordinary."}
            </span>
          </h2>
          {properties.header.intro && (
            <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              {properties.header.intro}
            </p>
          )}
        </div>

        {/* 3D Carousel */}
        <ThreeDCarousel
          projects={displayProjects}
          headerVis={headerVis}
          onSelect={setActiveVideo}
          ctaLabel={properties.cta?.label || "Үзэх"}
        />
      </div>

      {/* Full-Screen Lightbox Modal (FoodCity Style) */}
      {activeVideo &&
        videoData &&
        typeof document !== "undefined" &&
        createPortal(
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
                  videoData.type === "youtube-short"
                    ? "max-w-[400px] h-[80vh]"
                    : "max-w-6xl aspect-video"
                }`}
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                }}
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
                <h4 className="text-white text-3xl sm:text-4xl font-black tracking-tight">
                  {activeVideo.title}
                </h4>
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
          document.body,
        )}
    </section>
  );
}
