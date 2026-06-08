"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="w-full"
    >
      <Link
        href="/qr/amarhome"
        className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 backdrop-blur-md border border-blue-500/20 rounded-[24px] text-white hover:border-blue-500/40 hover:from-blue-900/60 hover:to-indigo-900/60 transition-all duration-300 shadow-[0_15px_40px_-15px_rgba(30,58,138,0.5)] overflow-hidden"
      >
        {/* Glowing Background Light */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500" />

        {/* Shine effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-30 animate-shine" />

        <div className="relative w-12 h-12 bg-[#0A0C10]/95 border border-white/10 rounded-2xl p-2.5 shadow-lg flex items-center justify-center overflow-hidden shrink-0 z-10 group-hover:scale-105 transition-transform duration-300">
          <img
            src="/amarhome-logo.jpg"
            alt="Amarhome"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex-1 flex flex-col items-start z-10">
          <span className="text-[9px] uppercase tracking-[0.25em] text-blue-400 font-black leading-none mb-1">
            Ухаалаг гэрийн систем
          </span>
          <span className="text-[14px] font-black text-white leading-tight">
            AMARHOME СӨХ апп татах
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 group-hover:text-slate-300 transition-colors">
            Төлбөр удирдах & ухаалаг СӨХ
          </span>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center shrink-0 border border-white/5 transition-all duration-300">
          <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
