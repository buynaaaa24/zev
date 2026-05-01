"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { isAndroid, isIOS } from "react-device-detect";
import { FaApple, FaGooglePlay, FaFacebook, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

interface ProjectData {
  name: string;
  description: { mn: string; en: string };
  ios: string;
  android: string;
  facebook?: string;
  facebookName?: string;
  instagram?: string;
  instagramName?: string;
  logo: string;
  color: string;
  glow: string;
}

const PROJECTS_DATA: Record<string, ProjectData> = {
  amarhome: {
    name: "Amarhome",
    description: {
      mn: "Ухаалаг гэрийн шийдэл. Amarhome аппликейшнийг татан авч төлбөрөө удирдах боломжтой.",
      en: "Smart home solution. Download Amarhome app to manage your utilities and payments.",
    },
    ios: "https://apps.apple.com/mn/app/amarhome/id6754548250",
    android: "https://play.google.com/store/apps/details?id=com.home.sukh_app",
    facebook: "https://www.facebook.com/amarhome.mn",
    facebookName: "Amarhome СӨХ-н программ",
    instagram: "https://www.instagram.com/amarhome_app/",
    instagramName: "amarhome_app",
    logo: "/amarhome-logo.jpg",
    color: "from-[#2A52BE] to-[#1E3A8A]",
    glow: "shadow-[#2A52BE]/50",
  },
  parkease: {
    name: "ParkEase",
    description: {
      mn: "Зогсоолын ухаалаг шийдэл. Таны цагийг хэмнэх ParkEase аппликейшн.",
      en: "Smart parking solution. Save your time with ParkEase application.",
    },
    ios: "https://apps.apple.com/app/parkease/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.parkease",
    logo: "/logo.png",
    facebook: "https://facebook.com/parkease",
    facebookName: "ParkEase Smart Parking",
    instagram: "https://instagram.com/parkease_app",
    instagramName: "parkease_app",
    color: "from-[#10B981] to-[#047857]",
    glow: "shadow-[#10B981]/50",
  },
  rently: {
    name: "Rently",
    description: {
      mn: "Түрээсийн системийг хялбарчлах Rently аппликейшн.",
      en: "Rental management simplified. Download Rently application.",
    },
    ios: "https://apps.apple.com/app/rently/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.rently",
    logo: "/logo.png",
    facebook: "https://facebook.com/rently.mn",
    facebookName: "Rently Mongolia",
    instagram: "https://instagram.com/rently_mn",
    instagramName: "rently_mn",
    color: "from-[#8B5CF6] to-[#6D28D9]",
    glow: "shadow-[#8B5CF6]/50",
  },
  posease: {
    name: "PosEase",
    description: {
      mn: "Борлуулалтын цэгийн ухаалаг систем PosEase.",
      en: "Cloud POS system for your business. PosEase application.",
    },
    ios: "https://apps.apple.com/app/posease/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.posease",
    logo: "/posease-logo.jpg",
    facebook: "https://facebook.com/posease",
    facebookName: "PosEase POS System",
    instagram: "https://instagram.com/posease_app",
    instagramName: "posease_app",
    color: "from-[#EF4444] to-[#B91C1C]",
    glow: "shadow-[#EF4444]/50",
  },
  hicar: {
    name: "HiCar",
    description: {
      mn: "Машин угаалга, үйлчилгээний нэгдсэн систем HiCar.",
      en: "Integrated car wash and service system HiCar.",
    },
    ios: "https://apps.apple.com/app/hicar/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.hicar",
    logo: "/logo.png",
    facebook: "https://facebook.com/hicar",
    facebookName: "HiCar Mongolia",
    instagram: "https://instagram.com/hicar_mn",
    instagramName: "hicar_mn",
    color: "from-[#3B82F6] to-[#1D4ED8]",
    glow: "shadow-[#3B82F6]/50",
  },
  toyland: {
    name: "ToyLand",
    description: {
      mn: "Тоглоомын дэлгүүрийн шийдэл ToyLand.",
      en: "Toy store solution ToyLand.",
    },
    ios: "https://apps.apple.com/app/toyland/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.toyland",
    logo: "/logo.png",
    facebook: "https://facebook.com/toyland",
    facebookName: "ToyLand Mongolia",
    instagram: "https://instagram.com/toyland_mn",
    instagramName: "toyland_mn",
    color: "from-[#F59E0B] to-[#B45309]",
    glow: "shadow-[#F59E0B]/50",
  },
};

import { getApiBaseUrl } from "@/lib/api";

export default function QrProjectPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"mn" | "en">("mn");
  const [dynamicData, setDynamicData] = useState<Partial<ProjectData> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectId = (params?.projectId as string)?.toLowerCase();
  const projectInfoStatic = PROJECTS_DATA[projectId];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDynamicData() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/site-pages/qr-portal?lang=${lang}&siteId=${projectId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.sections) {
            setDynamicData(json.data.sections);
          }
        }
      } catch (e) {
        console.error("Failed to fetch dynamic QR data:", e);
      }
    }
    if (projectId) fetchDynamicData();
  }, [lang, projectId]);

  if (!projectInfoStatic) {
    if (!mounted) return null;
    notFound();
  }

  // Merge static data with dynamic data from Admin
  const projectInfo: ProjectData = {
    ...projectInfoStatic,
    ...dynamicData,
    description: {
      ...projectInfoStatic.description,
      ...(dynamicData?.description || {}),
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.25, dy: -Math.random() * 0.4 - 0.05,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,160,255,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  if (!projectInfo) {
    if (!mounted) return null;
    notFound();
  }

  const handleSmartDownload = () => {
    if (isIOS) window.location.href = projectInfo.ios;
    else window.location.href = projectInfo.android;
  };

  const t = {
    mn: {
      download: "Аппликейшн татах",
      powered: "Powered by",
    },
    en: {
      download: "Download App",
      powered: "Powered by",
    }
  };

  return (
    <div className={`min-h-[100dvh] w-full bg-[#050505] text-white flex flex-col items-center relative overflow-hidden ${montserrat.className}`}>
      
      {/* Official Zevfront Hero Background Pattern */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(140deg, #000 0%, #0a0a0a 50%, #0d1b2a 100%)" }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-60" aria-hidden />
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,102,204,0.15) 0%, transparent 70%)" }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[3]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "64px 64px" }} aria-hidden />

      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-[100] flex gap-1 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <button 
          onClick={() => setLang("mn")}
          className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === "mn" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
        >
          MN
        </button>
        <button 
          onClick={() => setLang("en")}
          className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === "en" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
        >
          EN
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[440px] min-h-[100dvh] mx-auto flex flex-col px-6 pt-12 pb-10">
        
        {/* Identity Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -8, 0], 
            }}
            transition={{ 
              delay: 0.1, 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              scale: { type: "spring", bounce: 0.4, duration: 0.8 } 
            }}
            className="relative mb-8"
          >
            <div className={`absolute inset-0 bg-gradient-to-tr ${projectInfo.color} rounded-[36px] blur-[22px] opacity-60`} />
            
            <div className={`relative w-[120px] h-[120px] bg-[#0A0C10]/80 backdrop-blur-md border border-white/10 rounded-[36px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden z-10`}>
              <Image
                src={projectInfo.logo}
                alt={projectInfo.name}
                width={90}
                height={90}
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center px-2"
          >
            <motion.h1 
              animate={{ 
                textShadow: ["0 0 10px rgba(255,255,255,0)", "0 0 15px rgba(255,255,255,0.3)", "0 0 10px rgba(255,255,255,0)"] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-[34px] leading-tight font-black tracking-tight mb-3 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent uppercase"
            >
              {projectInfo.name}
            </motion.h1>
            <AnimatePresence mode="wait">
              <motion.p 
                key={lang}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-[#A1A1AA] text-[15px] leading-relaxed font-medium mx-auto max-w-[280px]"
              >
                {projectInfo.description[lang]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Actions Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col w-full gap-4 mt-auto"
        >
          <div className="w-full relative mb-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 25px rgba(255,255,255,0.1)", "0 0 0px rgba(0,0,0,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleSmartDownload}
              className={`group relative w-full h-[64px] rounded-[22px] font-bold text-[18px] flex items-center justify-center gap-3 overflow-hidden shadow-2xl ${projectInfo.glow} outline-none`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${projectInfo.color} opacity-100 group-hover:opacity-90 transition-opacity duration-300`} />
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40 animate-shine" />
              <AnimatePresence mode="wait">
                <motion.span 
                  key={lang}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="relative z-10 tracking-wide text-white drop-shadow-md font-bold uppercase"
                >
                  {t[lang].download}
                </motion.span>
              </AnimatePresence>
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 ml-1">
                {isIOS ? <FaApple className="text-white text-lg" /> : <FaGooglePlay className="text-white text-[14px]" />}
              </div>
            </motion.button>
          </div>

          {/* Social Links (Full Rows with Names) */}
          {(projectInfo.facebook || projectInfo.instagram) && (
            <div className="flex flex-col w-full gap-3 mb-10">
              {projectInfo.facebook && (
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href={projectInfo.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 px-4 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl text-white hover:bg-white/[0.06] transition-all duration-300 outline-none"
                >
                  <div className="w-11 h-11 bg-[#1877F2] rounded-xl flex items-center justify-center shadow-lg">
                    <FaFacebook className="text-[24px]" />
                  </div>
                  <div className="flex flex-col items-start pt-0.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1877F2] font-black leading-none mb-1">Facebook</span>
                    <span className="text-[14px] font-bold text-white/90 leading-tight">
                      {projectInfo.facebookName}
                    </span>
                  </div>
                </motion.a>
              )}
              {projectInfo.instagram && (
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href={projectInfo.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 px-4 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl text-white hover:bg-white/[0.06] transition-all duration-300 outline-none"
                >
                  <div className="w-11 h-11 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-xl flex items-center justify-center shadow-lg">
                    <FaInstagram className="text-[26px]" />
                  </div>
                  <div className="flex flex-col items-start pt-0.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E4405F] font-black leading-none mb-1">Instagram</span>
                    <span className="text-[14px] font-bold text-white/90 leading-tight">
                      {projectInfo.instagramName}
                    </span>
                  </div>
                </motion.a>
              )}
            </div>
          )}
        </motion.div>

        {/* Branding Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-black">{t[lang].powered}</span>
            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Image src="/logo.png" alt="Zev" width={40} height={20} className="object-contain grayscale" />
            </div>
          </div>
        </motion.div>

      </main>

      <style jsx global>{`
        @keyframes shine { 100% { left: 125%; } }
        .animate-shine { animation: shine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
}
