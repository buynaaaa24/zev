"use client";

import { useEffect, useRef, useState } from "react";
import { AboutSections, PartnerLogo } from "@/lib/site-content-types";
import { Meteors } from "@/components/ui/meteor";
import { resolveMediaUrl } from "@/lib/media";
import * as LucideIcons from "lucide-react";

// Default features with icons that can be overridden by CMS
const DEFAULT_FEATURES = [
  {
    title: "Modular Architecture",
    desc: "Every component composable, scalable, replaceable — your platform grows with you.",
    color: "blue",
    icon: "BookCheck",
  },
  {
    title: "Blazing Performance",
    desc: "Sub-second loads and silky 60fps animations. We obsess over milliseconds.",
    color: "green",
    icon: "Zap",
  },
  {
    title: "Precision Design",
    desc: "Pixel-perfect interfaces with the same rigor Apple applies to hardware.",
    color: "purple",
    icon: "Binary",
  },
  {
    title: "Enterprise Security",
    desc: "End-to-end encryption and role-based access built into every layer.",
    color: "orange",
    icon: "ThumbsUp",
  },
  {
    title: "Global Ready",
    desc: "Multi-language, multi-tenant, multi-region. Scales wherever you go.",
    color: "cyan",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Always Evolving",
    desc: "Continuous delivery — your platform improves automatically, zero downtime.",
    color: "pink",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
];

const colorClasses: Record<
  string,
  { bg: string; border: string; text: string; gradient: string }
> = {
  blue: {
    bg: "bg-blue-100",
    border: "border-blue-500/30",
    text: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
  },
  green: {
    bg: "bg-green-100",
    border: "border-green-500/30",
    text: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
  },
  purple: {
    bg: "bg-purple-100",
    border: "border-purple-500/30",
    text: "text-purple-600",
    gradient: "from-purple-500 to-violet-500",
  },
  orange: {
    bg: "bg-orange-100",
    border: "border-orange-500/30",
    text: "text-orange-600",
    gradient: "from-orange-500 to-amber-500",
  },
  cyan: {
    bg: "bg-cyan-100",
    border: "border-cyan-500/30",
    text: "text-cyan-600",
    gradient: "from-cyan-500 to-teal-500",
  },
  pink: {
    bg: "bg-pink-100",
    border: "border-pink-500/30",
    text: "text-pink-600",
    gradient: "from-pink-500 to-rose-500",
  },
};

// Helper to get color styles - supports both named colors and hex colors from admin
function getColorStyles(color: string) {
  // Check if it's a hex color
  if (color?.startsWith("#")) {
    return {
      isHex: true,
      bg: color,
      border: color,
      text: color,
      gradient: `from-[${color}] to-[${color}]`,
    };
  }
  // Named color from colorClasses
  const c = colorClasses[color] || colorClasses.blue;
  return {
    isHex: false,
    ...c,
  };
}

function FeatureCard({
  title,
  desc,
  index,
  icon,
  color = "blue",
}: {
  title: string;
  desc: string;
  index: number;
  icon?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c = getColorStyles(color);
  const iconPath =
    icon || DEFAULT_FEATURES[index % DEFAULT_FEATURES.length].icon;
  const isImageIcon =
    icon &&
    (icon.startsWith("/upload/") ||
      icon.startsWith("upload/") ||
      icon.startsWith("http"));
  const isSvgPath = !isImageIcon && iconPath.startsWith("M");
  const LucideIcon =
    !isImageIcon && !isSvgPath
      ? (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<{
              className?: string;
              style?: React.CSSProperties;
            }>
          >
        )[iconPath]
      : null;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 80}ms`,
        transitionDuration: "800ms",
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: vis ? 1 : 0,
        transform: vis
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.97)",
      }}
      className="relative w-full"
    >
      {/* Glowing gradient background */}
      <div
        className={`absolute inset-0 h-64 w-full scale-[0.80] transform rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 ${!c.isHex ? `bg-gradient-to-r ${c.gradient}` : ""}`}
        style={
          c.isHex
            ? { background: `linear-gradient(to right, ${c.bg}, ${c.bg})` }
            : undefined
        }
      />

      {/* Card */}
      <div className="group relative overflow-hidden bg-white rounded-3xl p-5 border border-neutral-100/80 hover:border-accent-200 hover:shadow-2xl hover:shadow-accent-500/10 cursor-default transition-all duration-500 hover:-translate-y-2 h-64">
        {/* Icon */}
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full border relative z-10 ${!c.isHex ? `${c.border} ${c.bg}` : ""}`}
          style={
            c.isHex
              ? { borderColor: `${c.border}4d`, backgroundColor: `${c.bg}1a` }
              : undefined
          }
        >
          {isImageIcon ? (
            <img
              src={resolveMediaUrl(iconPath)}
              alt=""
              className="h-5 w-5 object-contain"
            />
          ) : LucideIcon ? (
            <LucideIcon
              className={`h-5 w-5 ${!c.isHex ? c.text : ""}`}
              style={c.isHex ? { color: c.text } : undefined}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`h-5 w-5 ${!c.isHex ? c.text : ""}`}
              style={c.isHex ? { color: c.text } : undefined}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          )}
        </div>

        {/* Meteors */}
        <div className="absolute inset-0 pointer-events-none">
          <Meteors number={20} />
        </div>

        <h3 className="text-neutral-900 font-bold text-xl mb-3 group-hover:text-accent-600 transition-colors duration-300 relative z-10">
          {title}
        </h3>
        <p className="text-neutral-500 text-[15px] leading-relaxed font-light relative z-10 whitespace-pre-wrap">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function AboutSection({
  about,
  partners = [],
}: {
  about: AboutSections["main"];
  partners?: PartnerLogo[];
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVis, setHeaderVis] = useState(false);

  // Map CMS stats to features. If no stats, use defaults.
  const displayFeatures =
    about.stats && about.stats.length > 0
      ? about.stats.map((s, i) => ({
          title: s.value,
          desc: s.label,
          icon: s.icon,
          color: s.color || DEFAULT_FEATURES[i % DEFAULT_FEATURES.length].color,
        }))
      : DEFAULT_FEATURES;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="bg-neutral-50 py-32 lg:py-44 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Animated header */}
        <div
          ref={headerRef}
          className="max-w-2xl mb-20"
          style={{
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(60px)",
            transition:
              "opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.06] text-neutral-800 mb-5">
            {about.h2Line1 || "Where technology"}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#0066CC,#2f77e8,#55a3ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {about.h2Accent || "meets elegance."}
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed font-light whitespace-pre-wrap">
            {about.p1 ||
              "Software should feel inevitable — so natural and refined that using it feels like second nature."}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayFeatures.map(
            (
              f: { title: string; desc: string; icon?: string; color?: string },
              i: number,
            ) => (
              <FeatureCard
                key={i}
                title={f.title}
                desc={f.desc}
                icon={f.icon}
                color={f.color}
                index={i}
              />
            ),
          )}
        </div>

        {/* Quote */}
        <QuoteBlock quote={about.p2} attribution={about.yearsLabel} />

        {/* Partners Slider */}
        {partners.length > 0 && (
          <div className="mt-10">
            <div className="relative w-full overflow-hidden">
              <div className="flex partner-marquee">
                {/* Quadruple the array for seamless infinite scroll */}
                {[...partners, ...partners, ...partners, ...partners].map(
                  (logo, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 mx-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-16 w-auto max-w-[200px] object-contain rounded-xl"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteBlock({
  quote,
  attribution,
}: {
  quote?: string;
  attribution?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const text =
    quote ||
    "The best interface is the one you never notice because it just works.";

  return (
    <div
      ref={ref}
      className="mt-28 text-center max-w-4xl mx-auto"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.97)",
        transition:
          "opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 leading-tight">
        <span
          style={{
            background: "linear-gradient(135deg,#0066CC,#2f77e8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {text}
        </span>
      </blockquote>
      <p className="mt-4 text-neutral-400 text-sm">
        — {attribution || "Zevtabs Design Philosophy"}
      </p>
    </div>
  );
}
