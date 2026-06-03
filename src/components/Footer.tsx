"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FooterSections } from "@/lib/site-content-types";
import { Translations } from "@/lib/translations";

const SOCIAL_LINKS = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

const NAV_SECTIONS = [
  {
    label: "Platform",
    links: ["Dashboard", "Analytics", "Integrations", "API"],
  },
  {
    label: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    label: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
];

export default function Footer({
  content,
  t,
  accentColor = "rgb(99, 102, 241)",
  logo = "/logo.png",
  brandName = "Zevtabs",
  trialHref,
}: {
  content: FooterSections;
  t: Translations;
  accentColor?: string;
  logo?: string;
  brandName?: string;
  trialHref?: string;
}) {
  const year = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMn = t.nav?.home === "Нүүр";

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const getLightAccent = (color: string) => {
    if (color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", ", 0.12)");
    }
    return `${color}1e`;
  };

  const isYellow = accentColor === "#f6b414";
  const btnTextColor = isYellow ? "#1a0f00" : "#ffffff";

  // Handle translations for "By" and "Trial" if not provided in t
  const textBy = (t as any).footer?.by || "Бүтээгч:";
  const textTrial = (t as any).footer?.trial || "Турших хүсэлт →";


  return (
    <footer className="bg-black border-t border-white/5 py-8 sm:py-10 relative z-10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt={brandName}
            className="w-6 h-6 rounded-lg object-cover"
          />
          <span className="text-white/60 text-sm font-medium">{brandName}</span>
        </div>

        {/* Attribution & Copyright */}
        <p className="text-white/25 text-xs text-center">
          {textBy}{" "}
          <a href="/" className="text-white/40 hover:text-white/60 transition-colors">
            Zevtabs
          </a>{" "}
          · © {year}
        </p>

        {/* CTA */}
        {trialHref && (
          <div className="relative">
            <button 
              onClick={handleCtaClick} 
              className="text-sm font-medium transition-colors hover:opacity-80 focus:outline-none" 
              style={{ color: accentColor }}
            >
              {textTrial}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          {/* Modal Content */}
          <div className="relative bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/10"
              style={{ 
                backgroundColor: getLightAccent(accentColor),
                borderColor: `${accentColor}40`
              }}
            >
              <svg 
                className="w-8 h-8" 
                style={{ color: accentColor }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
              {isMn ? "Тун удахгүй" : "Coming Soon"}
            </h3>
            
            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
              {isMn 
                ? "Энэхүү үйлчилгээ одоогоор хөгжүүлэлтийн шатанд байна. Бид удахгүй бэлэн болгох болно." 
                : "This service is currently under development. We will make it available very soon."}
            </p>

            {/* Action Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                color: btnTextColor,
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor === "#f6b414" ? "#ffd35c" : accentColor === "#10b981" ? "#34d399" : "#ff708f"})`,
                boxShadow: `0 4px 20px rgba(${accentColor === "#f6b414" ? "246,180,20" : accentColor === "#10b981" ? "16,185,129" : "255,68,105"}, 0.25)`
              }}
            >
              {isMn ? "Ойлголоо" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}


