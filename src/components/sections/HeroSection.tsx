"use client";

import { useEffect, useRef, useState } from "react";
import { HomeSections } from "@/lib/site-content-types";

export default function HeroSection({ hero }: { hero: HomeSections["hero"] }) {
  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [bgIdx, setBgIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const images = hero.slideImages || [];

  // Derived words from titleAccent
  const WORDS = hero.titleAccent 
    ? hero.titleAccent.split(/[.,|]/).map(s => s.trim()).filter(Boolean)
    : ["Tomorrow.", "Excellence.", "You."];

  // Mount
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  // Word cycle
  useEffect(() => {
    if (WORDS.length <= 1) {
      setWordIdx(0);
      setWordVisible(true);
      return;
    }
    const id = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setWordVisible(true); }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, [WORDS.length]);

  // BG Slide cycle
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setBgIdx(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  // Parallax on scroll
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const onScroll = () => {
      const y = window.scrollY;
      const content = heroEl.querySelector<HTMLElement>(".hero-content");
      if (content) content.style.transform = `translateY(${y * 0.35}px)`;
      const canvas = heroEl.querySelector<HTMLElement>("canvas");
      if (canvas) canvas.style.transform = `translateY(${y * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Particle canvas
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
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.25, dy: -Math.random() * 0.4 - 0.05,
        alpha: Math.random() * 0.35 + 0.05,
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

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Images */}
      {images.length > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {images.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-[3000ms] ease-out bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === bgIdx ? 0.4 : 0,
                transform: i === bgIdx ? "scale(1.08)" : "scale(1)",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay to ensure text readability */}
        </div>
      ) : (
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(140deg, #000 0%, #0a0a0a 50%, #0d1b2a 100%)" }} />
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden />
      
      {/* Blue glow */}
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,102,204,0.2) 0%, transparent 70%)" }} aria-hidden />
      
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] z-[3]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "72px 72px" }} aria-hidden />

      <div className="hero-content relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-28 lg:pt-44">
        {/* Headline */}
        <h1 className={`display-xl mb-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`} style={{ transitionDelay: ".2s" }}>
          <span className="block text-white">
            {hero.titleLine1 || "Built for"}
          </span>
          <span className="block" style={{ background: "linear-gradient(135deg,#fff 0%,#a0b4ff 50%,#0066CC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", transition: "opacity .5s ease, transform .5s ease", opacity: wordVisible ? 1 : 0, transform: wordVisible ? "translateY(0)" : "translateY(24px)" }}>
            {WORDS[wordIdx]}
          </span>
          <span className="block text-white/90">
            {hero.titleLine2 || "Delivered now."}
          </span>
        </h1>

        {/* Description */}
        <p className={`text-white/45 text-lg sm:text-2xl leading-relaxed max-w-2xl mb-14 font-light transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: ".45s" }}>
          {hero.desc || "Zevtabs is a premium platform combining cutting-edge design with powerful functionality — crafted for businesses that demand excellence."}
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: ".52s" }}>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white text-[15px] font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
            style={{ background: "linear-gradient(90deg,#0066CC,#2f77e8,#0066CC)", backgroundSize: "200%", animation: "shimmer 3s linear infinite", boxShadow: "0 8px 32px rgba(0,102,204,0.3)" }}
          >
            {hero.btn1 || "Get Started"}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white text-[15px] font-medium hover:bg-white/10 hover:border-white/30 active:scale-[0.97] transition-all duration-300"
          >
            {hero.btn2 || "Discover More"}
          </button>
        </div>

        {/* Stats */}
        <div className={`mt-20 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: ".68s" }}>
          {(hero.stats && hero.stats.length > 0 ? hero.stats : [
            { value: "500+", label: "Clients" },
            { value: "99.9%", label: "Uptime" },
            { value: "3x", label: "Faster" },
            { value: "24/7", label: "Support" }
          ]).map((stat, idx) => (
            <div key={idx} className="group cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:text-accent-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-white/35 text-xs uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-bounce" style={{ animationDuration: "2s" }}>
        <span className="text-white/25 text-[10px] uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
