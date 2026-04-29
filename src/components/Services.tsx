"use client";

import { useRef, useEffect } from "react";

const SERVICES = [
  {
    number: "01",
    title: "Digital Platform",
    desc: "End-to-end platform design and development. From architecture to deployment, we build the digital backbone your business runs on.",
    tags: ["Architecture", "APIs", "Cloud"],
  },
  {
    number: "02",
    title: "Product Design",
    desc: "User experience research, interface design, and interactive prototyping. We craft experiences people love using.",
    tags: ["UX Research", "UI Design", "Prototyping"],
  },
  {
    number: "03",
    title: "Data & Analytics",
    desc: "Real-time dashboards, business intelligence, and predictive analytics. Turn your data into your competitive edge.",
    tags: ["Dashboards", "BI", "ML"],
  },
  {
    number: "04",
    title: "Content Management",
    desc: "Headless CMS, multi-site management, and content workflows. Put your team in control without touching code.",
    tags: ["CMS", "Workflows", "Multi-site"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="bg-neutral-0 section-pad">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="reveal inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">Our Services</span>
            </div>
            <h2 className="reveal reveal-delay-1 display-md text-neutral-800">
              Everything you need.<br />
              <span className="gradient-text-blue">Nothing you don&apos;t.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 body-lg text-neutral-400 max-w-sm lg:text-right">
            Focused, opinionated solutions built to move fast and last long.
          </p>
        </div>

        {/* Service list */}
        <div className="divide-y divide-neutral-100">
          {SERVICES.map((s, i) => (
            <div
              key={s.number}
              className={`reveal reveal-delay-${i + 1} group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 py-10 hover:bg-neutral-50 -mx-6 px-6 rounded-2xl transition-colors duration-300 cursor-default`}
            >
              {/* Number */}
              <span className="text-neutral-200 font-black text-4xl md:text-5xl shrink-0 w-16 group-hover:text-accent-500 transition-colors duration-500">
                {s.number}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-neutral-800 font-bold text-xl mb-2 group-hover:text-accent-600 transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">
                  {s.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="shrink-0 w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:border-accent-500 group-hover:text-accent-500 group-hover:translate-x-1 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
