import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PromoBanner from "@/components/PromoBanner";

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

export const metadata = {
  title: "HiCar — Тун удахгүй",
  description: "Тун удахгүй нээгдэхээр бэлтгэгдэж байна.",
};

export default function HicarPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden px-6 py-20">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] opacity-20"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "pulse 10s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-10 h-10 text-white/80" />
          </div>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "0 0 40px rgba(236,72,153,0.15)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-6">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#ec4899" }}
          />
          Тун удахгүй
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
          HiCar
        </h1>

        <p className="text-lg sm:text-xl text-white/50 mb-2 max-w-lg">
          Ухаалаг автомашины удирдлагын систем
        </p>
        <p className="text-sm text-white/30 mb-12 max-w-md">
          Манай баг энэхүү төслийг бэлтгэж байна. Удахгүй таньтай уулзахад
          бэлэн болно.
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-xs mb-16">
          <div className="flex items-center justify-between text-xs text-white/30 mb-2">
            <span>Хөгжүүлэлт</span>
            <span>80%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: "80%",
                background: "linear-gradient(90deg, #ec4899, #3b82f6)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer-slide 2s infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Project links */}
        <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">
              Дэлгэрэнгүй
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {PROJECTS.map((project) => (
            <Link
              key={project.path}
              href={project.path}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="w-12 h-12 rounded-xl overflow-hidden shadow-lg"
                style={{ boxShadow: `0 4px 16px ${project.color}20` }}
              >
                <img
                  src={project.icon}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  {project.name}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5 leading-tight">
                  {project.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* AmarHome Promo */}
        <div className="mt-10 w-full max-w-md mx-auto">
          <PromoBanner />
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
          >
            <ArrowRight
              size={14}
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
            />
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>

    </div>
  );
}
