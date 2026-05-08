"use client";

import { useRef, useEffect } from "react";

const FEATURES = [
  {
    title: "Modular Architecture",
    desc: "Every component is built to be composable, scalable, and replaceable — so your platform grows with you.",
  },
  {
    title: "Blazing Performance",
    desc: "Sub-second load times and silky 60fps animations. We obsess over every millisecond so your users don't have to wait.",
  },
  {
    title: "Precision Design",
    desc: "Pixel-perfect interfaces crafted with the same rigor Apple applies to hardware — because details define quality.",
  },
  {
    title: "Enterprise Security",
    desc: "End-to-end encryption, role-based access control, and audit logs built into every layer of the stack.",
  },
  {
    title: "Global Ready",
    desc: "Multi-language, multi-tenant, and multi-region. Zevtabs scales to wherever your business needs to go.",
  },
  {
    title: "Always Evolving",
    desc: "Continuous delivery means your platform improves automatically — no downtime, no disruptive migrations.",
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
            <h2 className="reveal reveal-delay-2 display-md text-neutral-800 mb-5">
              Where technology
              <br />
              <span className="gradient-text-blue">meets elegance.</span>
            </h2>
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
              <p className="mt-3 text-neutral-400 text-sm">
                — Zevtabs Design Philosophy
              </p>
            </div>
          </div>

          {/* Right column — feature grid */}
          <div className="xl:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`reveal reveal-delay-${Math.min(i + 1, 6)} card-hover bg-white rounded-2xl p-6 border border-neutral-100 group`}
                >
                  <h3 className="text-neutral-800 font-bold text-base mb-2">
                    {f.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
