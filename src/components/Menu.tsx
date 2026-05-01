"use client";

import { useState, useRef } from "react";
import type { PropertiesPageSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";

const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isVideo(src: string) { return VIDEO_EXTS.test(src); }

function getYoutubeThumbUrl(url: string) {
  if (!url) return null;
  const cleanUrl = url.trim();
  const ytIdMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
  const videoId = ytIdMatch ? ytIdMatch[1] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0`;
  }
  return null;
}

function PropertyCard({ p }: { p: PropertiesPageSections["items"][number] }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasDirectVideo = p.videoUrl && isVideo(p.videoUrl);
  const ytThumbUrl = p.videoUrl && !hasDirectVideo ? getYoutubeThumbUrl(p.videoUrl) : null;
  const imageIsVideo = p.image && isVideo(p.image);

  return (
    <div
      className="group relative bg-white/60 backdrop-blur-xl border border-gray-100/50 rounded-[32px] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => { setIsHovered(true); videoRef.current?.play().catch(() => {}); }}
      onMouseLeave={() => { setIsHovered(false); videoRef.current?.pause(); }}
    >
      <div className="relative h-52 sm:h-60 overflow-hidden bg-gray-100">
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-100 group-hover:opacity-50 transition-opacity duration-700" />

        {/* Cover Image */}
        {p.image && !imageIsVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveMediaUrl(p.image)}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : null}

        {/* Hover Video or Main Video */}
        {imageIsVideo ? (
          <video
            ref={videoRef}
            src={resolveMediaUrl(p.image)}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : hasDirectVideo ? (
          <video
            ref={videoRef}
            src={resolveMediaUrl(p.videoUrl!)}
            muted
            loop
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${p.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
          />
        ) : ytThumbUrl && (isHovered || !p.image) ? (
          <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-1000 group-hover:scale-105 bg-black ${p.image ? 'animate-in fade-in duration-700' : ''}`}>
            <iframe
              src={ytThumbUrl}
              className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none opacity-80"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        ) : !p.image ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 opacity-20">
            <span className="text-brand-900 font-bold opacity-30">No Media</span>
          </div>
        ) : null}
        
        {/* Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
        
        {p.badge && (
          <span className="absolute left-4 top-4 z-20 rounded-full bg-accent-500/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            {p.badge}
          </span>
        )}
        
        <span className="absolute bottom-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
          {p.tag}
        </span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-black text-brand-900 text-xl tracking-tight leading-tight mb-1">
              {p.name}
            </h3>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
              {p.category}
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 min-h-[40px]">
          {p.description}
        </p>

        <div className="grid grid-cols-3 gap-1 mb-6 py-4 border-y border-gray-100/60">
          {[
            { icon: "▭", label: p.size, sub: "m²" },
            { icon: "≡", label: p.floor, sub: "Давхар" },
            { icon: "⊡", label: p.parking, sub: "Зогсоол" },
          ].map((spec, idx) => (
            <div key={idx} className="text-center border-r last:border-0 border-gray-100">
              <div className="text-accent-500 text-xs font-bold mb-0.5">
                {spec.label}
              </div>
              <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                {spec.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Эхлэх үнэ
            </div>
            <div className="text-brand-900 font-black text-xl tracking-tighter">
              {p.price}
            </div>
          </div>
          <a
            href={p.redirectUrl || "/contact"}
            className="h-11 flex items-center bg-brand-900 hover:bg-accent-500 text-white text-xs font-bold px-6 rounded-full transition-all duration-300 hover:shadow-lg active:scale-95 shadow-brand-900/10"
          >
            Лавлагаа авах
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Properties({
  content,
}: {
  content: PropertiesPageSections;
}) {
  const categories = content.categories;
  const [active, setActive] = useState("Бүгд");
  const [page, setPage] = useState(0);

  const filtered =
    active === "Бүгд"
      ? content.items
      : content.items.filter((p) => p.category === active);

  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="properties" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span
            className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            {content.header.badge}
          </span>
          <h2
            className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4"
            style={{ animationDelay: "0.25s" }}
          >
            {content.header.titleLine1}{" "}
            <span className="text-accent-500">
              {content.header.titleAccent}
            </span>
          </h2>
          <p
            className="hero-reveal text-gray-500 text-base sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            {content.header.intro}
          </p>
        </div>

        {/* Filters */}
        <div
          className="hero-reveal flex gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center"
          style={{ animationDelay: "0.5s" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat);
                setPage(0);
              }}
              className={`px-4 sm:px-5 py-2 rounded text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all whitespace-nowrap shrink-0 ${
                active === cat
                  ? "bg-brand-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="hero-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          style={{ animationDelay: "0.6s" }}
        >
          {paged.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                  i === page
                    ? "bg-brand-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-brand-900"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <a
            href={content.cta.href}
            className="hero-reveal inline-flex items-center gap-2 border-2 border-brand-900 text-brand-900 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded hover:bg-brand-900 hover:text-white transition-all text-sm sm:text-base"
            style={{ animationDelay: "0.7s" }}
          >
            {content.cta.label}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
