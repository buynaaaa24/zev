"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { HeroContent } from "@/lib/site-content-types";

export type { HeroContent };

const WORDS = ["Innovation", "Experience", "Excellence", "Future"];

export default function Hero({ hero }: { hero: HeroContent }) {
  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Rotating word animation
  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    };
    const id = setInterval(cycle, 2800);
    setVisible(true);
    return () => clearInterval(id);
  }, []);

  // Subtle animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number; y: number; r: number;
      dx: number; dy: number; alpha: number;
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
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
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
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
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

  const badge = hero.badge || "Next-Generation Platform";
  const title1 = hero.titleLine1 || "Built for";
  const titleAccent = hero.titleAccent || "Tomorrow,";
  const title2 = hero.titleLine2 || "Delivered Today.";
  const desc = hero.desc || "Zevtabs is a premium platform combining cutting-edge design with powerful functionality — crafted for businesses that demand excellence.";
  const btn1 = hero.btn1 || "Explore Now";
  const btn2 = hero.btn2 || "Learn More";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      />

      {/* Blue radial glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
              {badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-black tracking-tight leading-[1.05] mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="block text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {title1}
            </span>
            <span className="block gradient-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {titleAccent}
            </span>
            <span className="block text-white/90 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {title2}
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-white/50 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 font-light transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "0.35s" }}
          >
            {desc}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "0.5s" }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full btn-shimmer text-white text-[15px] font-semibold shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {btn1}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white text-[15px] font-medium hover:bg-white/10 hover:border-white/30 active:scale-[0.98] transition-all duration-300"
            >
              {btn2}
            </Link>
          </div>

          {/* Stats row */}
          {hero.stats && hero.stats.length > 0 && (
            <div
              className={`mt-16 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.65s" }}
            >
              {hero.stats.map((stat) => (
                <div key={stat.label} className="group">
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:text-accent-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(10,10,10,0.4), transparent)" }}
        aria-hidden
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
