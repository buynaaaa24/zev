"use client";

import React from "react";

type Discount = { label: string; color?: string };

export type PricingCardProps = {
  name: string;
  value: string;
  desc?: string;
  features?: string[];
  discounts?: Discount[];
  hideButton?: boolean;
  buttonLabel: string;
  buttonHref: string;
  buttonTarget?: string;
  buttonRel?: string;
  onButtonClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isMiddle: boolean;
  mostPopularLabel?: string;
  visible: boolean;
  delay: number;
  accent: string;
  accentGlow: string;
  accentOnDark?: string;
  dark?: boolean;
};

export function PricingCard({
  name,
  value,
  desc,
  features,
  discounts,
  hideButton,
  buttonLabel,
  buttonHref,
  buttonTarget,
  buttonRel,
  onButtonClick,
  isMiddle,
  mostPopularLabel,
  visible,
  delay,
  accent,
  accentGlow,
  accentOnDark = "white",
  dark = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col h-full rounded-[32px] sm:rounded-[40px] md:rounded-[48px] p-6 sm:p-8 md:p-10 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${
        isMiddle
          ? "bg-neutral-900 md:scale-[1.10] z-10"
          : dark
            ? "bg-white/5"
            : "bg-neutral-50 border border-neutral-150"
      }`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        border: isMiddle
          ? `2px solid ${accentGlow}0.45)`
          : dark
            ? "1px solid rgba(255,255,255,0.08)"
            : undefined,
        boxShadow: isMiddle ? `0 20px 60px ${accentGlow}0.12)` : undefined,
      }}
    >
      {/* Discount badges */}
      {discounts && discounts.length > 0 && (
        <div className="absolute -top-3 -right-3 flex flex-col items-end gap-1.5 z-20">
          {discounts.map((d, di) => (
            <div
              key={di}
              className="px-3 py-1.5 rounded-full text-white text-[10px] font-black shadow-lg uppercase whitespace-nowrap"
              style={{
                backgroundColor: d.color
                  ? d.color.startsWith("#")
                    ? d.color
                    : `#${d.color}`
                  : "#7c3aed",
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}

      {/* Most popular badge */}
      {isMiddle && mostPopularLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide whitespace-nowrap"
            style={{
              background: accent,
              color: accentOnDark,
              boxShadow: `0 4px 14px ${accentGlow}0.4)`,
            }}
          >
            {mostPopularLabel}
          </span>
        </div>
      )}

      {/* Name + Value */}
      <div className="mb-5 sm:mb-8 text-center">
        <p
          className="text-sm font-black uppercase tracking-[0.3em] mb-1"
          style={{ color: isMiddle || dark ? accent : "#888" }}
        >
          {name}
        </p>
        <p
          className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-3 break-all w-full ${
            isMiddle || dark ? "text-white" : "text-neutral-800"
          }`}
        >
          {value}
        </p>
      </div>

      {/* Features bullet list */}
      {features && features.length > 0 && (
        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
          {features.map((f, j) => (
            <li
              key={j}
              className={`flex items-start gap-2.5 text-sm sm:text-base ${
                isMiddle || dark ? "text-white/70" : "text-neutral-600"
              }`}
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: accent }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Multiline desc */}
      {desc !== undefined && (
        <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8 font-medium leading-relaxed text-left flex-1 whitespace-pre-wrap">
          {desc}
        </p>
      )}

      {/* Button */}
      {!hideButton && (
        <a
          href={buttonHref}
          target={buttonTarget}
          rel={buttonRel}
          onClick={onButtonClick}
          className="block text-center text-base sm:text-lg font-black py-3 sm:py-5 rounded-2xl sm:rounded-[24px] transition-all duration-300"
          style={
            isMiddle
              ? {
                  background: accent,
                  color: accentOnDark,
                  boxShadow: `0 8px 24px ${accentGlow}0.3)`,
                }
              : dark
                ? {
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }
                : {
                    background: "white",
                    color: "#1a1a1a",
                    border: "1px solid #e5e5e5",
                  }
          }
        >
          {buttonLabel}
        </a>
      )}
    </div>
  );
}
