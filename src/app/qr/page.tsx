"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export default function QrRootPage() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const projects = [
    { id: "amarhome", name: "Amarhome", desc: "Smart Home Solutions" },
    { id: "rently", name: "Rently", desc: "Rental Management" },
    { id: "posease", name: "PosEase", desc: "Cloud POS System" },
    { id: "parkease", name: "ParkEase", desc: "Automated Parking" },
    { id: "hicar", name: "HiCar", desc: "Car Wash & Service" },
    { id: "toyland", name: "ToyLand", desc: "Toy Store Solution" },
  ];

  return (
    <div className={`min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden relative ${montserrat.className}`}>
      {/* Official Zevfront Hero Background Pattern */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(140deg, #000 0%, #0a0a0a 50%, #0d1b2a 100%)" }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-60" aria-hidden />
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,102,204,0.15) 0%, transparent 70%)" }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[3]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "64px 64px" }} aria-hidden />

      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            Project Directory
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">
            ZEV PORTAL
          </h1>
          <p className="text-white/30 text-sm">Select a project gateway</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/qr/${p.id}`}
              className="group flex items-center justify-between p-5 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl transition-all hover:bg-white/[0.06] hover:border-white/10 active:scale-[0.98]"
            >
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                  {p.name}
                </span>
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {p.desc}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-blue-400" />
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 flex flex-col items-center opacity-30">
          <Image src="/logo.png" alt="Zev" width={40} height={20} className="grayscale" />
        </footer>
      </div>
    </div>
  );
}
