"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/lib/media";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, ExternalLink, Globe } from "lucide-react";
import type { AjluudSections } from "@/lib/site-content-types";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  mobileImage?: string;
  showMobile?: boolean;
  videoUrl?: string;
  description?: string;
  link?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "AmarHome",
    category: "Real Estate Platform",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1600",
    mobileImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600&h=1200",
    showMobile: true,
    description: "Premium property marketplace with advanced filtering and immersive virtual tours.",
    link: "https://amarhome.mn"
  }
];

function isVideo(path: string): boolean {
  if (!path) return false;
  return /\.(mp4|webm|ogg|mov)$/i.test(path);
}

/** Desktop browser chrome */
function BrowserFrame({ children, url }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="w-full rounded-[18px] overflow-hidden border border-white/20 bg-white/5 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
      <div className="bg-white/10 px-4 py-2.5 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 max-w-xs h-6 rounded-md bg-black/20 border border-white/10 flex items-center px-2.5 gap-1.5">
          <Globe size={10} className="text-white/20 shrink-0" />
          <span className="text-[9px] text-white/40 truncate font-mono">
            {url ? url.replace("https://", "") : "zevtabs.mn"}
          </span>
        </div>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900">{children}</div>
    </div>
  );
}

/** Phone chrome */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-[32px] border-[3px] border-white/20 bg-[#111] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38%] h-[26px] bg-[#111] rounded-b-2xl z-10 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-8 h-1 rounded-full bg-white/10" />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-[30px] bg-neutral-900">
          {children}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[35%] h-1 rounded-full bg-white/20 z-10" />
      </div>
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
};

export default function AjluudGallery({ data }: { data?: AjluudSections }) {
  const PROJECTS: Project[] = data?.items?.length
    ? data.items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        mobileImage: item.mobileImage,
        showMobile: item.showMobile,
        videoUrl: item.videoUrl,
        description: item.description,
        link: item.link,
      }))
    : DEFAULT_PROJECTS;

  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [accentIdx, setAccentIdx] = useState(0);
  const [accentVisible, setAccentVisible] = useState(true);
  const { lang } = useLanguage();

  const ACCENT_WORDS = data?.header?.titleAccent 
    ? data.header.titleAccent.split(/[.,|]/).map(s => s.trim()).filter(Boolean)
    : ["Craft.", "Precision.", "Innovation.", "Mastery."];

  useEffect(() => {
    if (ACCENT_WORDS.length <= 1) {
      setAccentVisible(true);
      setAccentIdx(0);
      return;
    }
    const id = setInterval(() => {
      setAccentVisible(false);
      setTimeout(() => {
        setAccentIdx((i) => (i + 1) % ACCENT_WORDS.length);
        setAccentVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, [ACCENT_WORDS.length]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % PROJECTS.length);
  }, [PROJECTS.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, [PROJECTS.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const t = {
    badge: data?.header?.badge || (lang === "mn" ? "Манай бүтээлүүд" : "Our Work"),
    titleLine1: data?.header?.titleLine1 || "Digital",
    visitSite: lang === "mn" ? "Сайт руу орох" : "Visit Site",
  };

  const project = PROJECTS[activeIdx];

  // Resolve Desktop Media
  const desktopSrc = resolveMediaUrl(project.image);
  const isDesktopVid = isVideo(desktopSrc) || (project.videoUrl && isVideo(project.videoUrl));
  const desktopFinalUrl = project.videoUrl ? resolveMediaUrl(project.videoUrl) : (isDesktopVid ? desktopSrc : null);

  // Resolve Mobile Media
  const mobileSrc = project.mobileImage ? resolveMediaUrl(project.mobileImage) : desktopSrc;
  const isMobileVid = isVideo(mobileSrc);
  const mobileFinalUrl = isMobileVid ? mobileSrc : null;

  return (
    <section id="ajluud" className="relative pt-44 pb-32 sm:pt-60 sm:pb-44 bg-black overflow-hidden selection:bg-indigo-500 selection:text-white scroll-mt-32 isolate">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em] mb-4">
            {t.badge}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
            {t.titleLine1}{" "}
            <span
              className="text-indigo-500 inline-block"
              style={{
                transition: "opacity 0.35s ease, transform 0.35s ease",
                opacity: accentVisible ? 1 : 0,
                transform: accentVisible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              {ACCENT_WORDS[accentIdx]}
            </span>
          </h2>
        </div>

        {/* Slideshow — browser + phone side by side */}
        <div className={`relative flex items-end justify-center gap-4 sm:gap-10 transition-all duration-700`}>
          {/* ── Browser ── */}
          <div className={`flex-1 min-w-0 transition-all duration-700 ${project.showMobile ? "max-w-[1000px]" : "max-w-5xl"}`}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIdx}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <BrowserFrame url={project.link}>
                  {desktopFinalUrl ? (
                    <video
                      key={desktopFinalUrl}
                      src={desktopFinalUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={desktopSrc}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 sm:p-10">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{project.title}</h3>
                        {desktopFinalUrl && <div className="px-2 py-0.5 rounded bg-indigo-500 text-[10px] font-bold text-white uppercase tracking-wider">Video</div>}
                      </div>
                      <p className="text-white/60 text-base mb-6 line-clamp-2">{project.description}</p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform"
                        >
                          {t.visitSite} <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </BrowserFrame>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Phone ── */}
          {project.showMobile && (
            <div className="hidden sm:block shrink-0 w-[180px] lg:w-[220px] xl:w-[260px] animate-in slide-in-from-right-10 duration-700">
              <div className="relative w-full aspect-[9/19.5]">
                <div className="absolute inset-0">
                  <PhoneFrame>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                      <motion.div
                        key={activeIdx}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full"
                      >
                        {mobileFinalUrl ? (
                          <video
                            src={mobileFinalUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={mobileSrc}
                            alt={`${project.title} mobile`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </PhoneFrame>
                </div>
              </div>
            </div>
          )}

          {/* Nav arrows */}
          <div className="absolute inset-y-0 -left-4 sm:-left-16 flex items-center">
            <button onClick={prevSlide} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all group">
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="absolute inset-y-0 -right-4 sm:-right-16 flex items-center">
            <button onClick={nextSlide} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all group">
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
          <div className="flex gap-2">
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${activeIdx === i ? "w-10 bg-indigo-500" : "w-3 bg-white/10 hover:bg-white/30"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/20 font-black text-4xl italic">0{activeIdx + 1}</span>
            <div className="w-10 h-[1px] bg-white/10" />
            <span className="text-white/40 text-sm font-bold uppercase tracking-widest">{project.category}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
