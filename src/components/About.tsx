"use client";

import { useRef, useEffect } from "react";
import { Meteors } from "@/components/ui/meteor";

const FEATURES = [
  {
    title: "Modular Architecture",
    desc: "Every component is built to be composable, scalable, and replaceable — so your platform grows with you.",
    color: "blue",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    title: "Blazing Performance",
    desc: "Sub-second load times and silky 60fps animations. We obsess over every millisecond so your users don't have to wait.",
    color: "green",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Precision Design",
    desc: "Pixel-perfect interfaces crafted with the same rigor Apple applies to hardware — because details define quality.",
    color: "purple",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    title: "Enterprise Security",
    desc: "End-to-end encryption, role-based access control, and audit logs built into every layer of the stack.",
    color: "orange",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Global Ready",
    desc: "Multi-language, multi-tenant, and multi-region. Zevtabs scales to wherever your business needs to go.",
    color: "cyan",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Always Evolving",
    desc: "Continuous delivery means your platform improves automatically — no downtime, no disruptive migrations.",
    color: "pink",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-neutral-50 min-h-screen flex items-center"
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 py-16 lg:py-0">
        {/* Landscape two-column layout */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:gap-16 gap-12">
          {/* Left column — header + quote */}
          <div className="xl:w-[38%] xl:flex-shrink-0 flex flex-col justify-center">
            <div className="reveal reveal-delay-1 inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-accent-50 border border-accent-100 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <span className="text-accent-600 text-xs font-semibold uppercase tracking-widest">
                About Zevtabs
              </span>
            </div>

            <p className="reveal reveal-delay-3 body-lg text-neutral-500 mb-10">
              We believe software should feel inevitable — so natural and
              refined that using it feels like second nature.
            </p>

            {/* Quote moved into left column */}
            <div className="reveal reveal-delay-4 border-l-4 border-accent-500 pl-5">
              <blockquote className="text-lg sm:text-xl font-bold text-neutral-800 leading-snug">
                &ldquo;The best interface is the one{" "}
                <span className="gradient-text-blue">you never notice</span>{" "}
                because it just works.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Right column — feature grid */}
          <div className="xl:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => {
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
                const c = colorClasses[f.color];
                return (
                  <div key={f.title} className="relative w-full">
                    {/* Gradient blur background */}
                    <div
                      className={`absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r ${c.gradient} blur-3xl opacity-50`}
                    />
                    {/* Card */}
                    <div
                      className={`reveal reveal-delay-${Math.min(i + 1, 6)} relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 py-5 shadow-xl`}
                    >
                      {/* Icon */}
                      <div
                        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full border ${c.border} ${c.bg}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className={`h-4 w-4 ${c.text}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={f.icon}
                          />
                        </svg>
                      </div>
                      {/* Title */}
                      <h3 className="relative z-10 mb-1 text-base font-bold text-neutral-800">
                        {f.title}
                      </h3>
                      {/* Description */}
                      <p className="relative z-10 text-sm font-normal text-neutral-500">
                        {f.desc}
                      </p>
                      {/* Meteors */}
                      <div className="absolute inset-0 pointer-events-none">
                        <Meteors number={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
