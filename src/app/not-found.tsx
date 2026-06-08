"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import PromoBanner from "@/components/PromoBanner";

function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    >
      <ArrowLeft size={16} />
      Буцах
    </button>
  );
}

const PROJECTS = [
  {
    name: "PosEase",
    path: "/posease",
    icon: "/posease-logo.jpg",
    desc: "Cloud POS for retail & hospitality",
    color: "#ec4899",
  },
  {
    name: "ParkEase",
    path: "/parkease",
    icon: "/images/parkease.jpg",
    desc: "Automated parking system",
    color: "#3b82f6",
  },
  {
    name: "Rently",
    path: "/rently",
    icon: "/images/rently.png",
    desc: "Rental management platform",
    color: "#10b981",
  },
  {
    name: "AmarHome",
    path: "/amarhome",
    icon: "/amarhome-logo.jpg",
    desc: "Modern luxury living",
    color: "#f59e0b",
  },

];

const PARTICLES = [
  { size: 3, color: "#ec4899", left: 12, top: 8,  dur: 7,  delay: 0 },
  { size: 4, color: "#3b82f6", left: 45, top: 15, dur: 9,  delay: 1 },
  { size: 2, color: "#10b981", left: 78, top: 5,  dur: 8,  delay: 2 },
  { size: 5, color: "#f59e0b", left: 88, top: 22, dur: 10, delay: 0 },
  { size: 3, color: "#ec4899", left: 25, top: 35, dur: 6,  delay: 1 },
  { size: 4, color: "#3b82f6", left: 62, top: 30, dur: 11, delay: 2 },
  { size: 2, color: "#10b981", left: 5,  top: 48, dur: 7,  delay: 0 },
  { size: 3, color: "#f59e0b", left: 92, top: 55, dur: 9,  delay: 1 },
  { size: 4, color: "#ec4899", left: 38, top: 60, dur: 8,  delay: 2 },
  { size: 2, color: "#3b82f6", left: 72, top: 68, dur: 10, delay: 0 },
  { size: 3, color: "#10b981", left: 15, top: 75, dur: 6,  delay: 1 },
  { size: 5, color: "#f59e0b", left: 55, top: 82, dur: 9,  delay: 2 },
  { size: 2, color: "#ec4899", left: 82, top: 88, dur: 7,  delay: 0 },
  { size: 4, color: "#3b82f6", left: 30, top: 90, dur: 11, delay: 1 },
  { size: 3, color: "#10b981", left: 68, top: 12, dur: 8,  delay: 2 },
  { size: 2, color: "#f59e0b", left: 50, top: 45, dur: 6,  delay: 0 },
  { size: 4, color: "#ec4899", left: 18, top: 55, dur: 10, delay: 1 },
  { size: 3, color: "#3b82f6", left: 85, top: 70, dur: 7,  delay: 2 },
  { size: 2, color: "#10b981", left: 42, top: 25, dur: 9,  delay: 0 },
  { size: 5, color: "#f59e0b", left: 95, top: 95, dur: 8,  delay: 1 },
];

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden px-6 py-20">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float-particle ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse" />
            Тун удахгүй
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            Энэ хуудас удахгүй нээгдэнэ
          </h2>
          <p className="text-base text-white/40 max-w-md leading-relaxed">
            Бид хөгжүүлэлт хийж байна. Та доорх бүтээгдэхүүнүүдээс
            сонирхоорой — таны бизнесийг өсгөх шийдлүүд энд байна.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white font-semibold text-sm hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ec4899]/20"
          >
            <Home size={16} />
            Нүүр хуудас
          </Link>
          <BackButton />
        </div>

        {/* Project links */}
        <div className="w-full">
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-5">
            Манай бүтээгдэхүүнүүд
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 w-full">
            {PROJECTS.map((project) => (
              <Link
                key={project.path}
                href={project.path}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10"
                  style={{ boxShadow: `0 4px 20px ${project.color}25` }}
                >
                  <img
                    src={project.icon}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                    {project.name}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">
                    {project.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AmarHome Promo Banner */}
        <div className="mt-10 w-full max-w-md mx-auto">
          <PromoBanner />
        </div>
      </div>
    </div>
  );
}
