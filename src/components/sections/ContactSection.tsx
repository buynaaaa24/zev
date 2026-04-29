"use client";

import { useEffect, useRef, useState } from "react";
import { ContactSections } from "@/lib/site-content-types";

export default function ContactSection({ contact }: { contact: ContactSections }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" className="bg-black py-32 lg:py-44 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div 
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
          style={{ 
            opacity: vis ? 1 : 0, 
            transform: vis ? "translateY(0)" : "translateY(60px)", 
            transition: "opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94)" 
          }}
        >
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-[64px] font-black tracking-tight leading-[1.04] text-white mb-8">
              {contact.hero.badge || "Let's build the"}<br />
              <span className="text-accent-400">{contact.hero.h2Accent || "next big thing."}</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed max-w-md mb-12 font-light">
              {contact.hero.intro || "Have a vision? We have the engineering and design expertise to bring it to life."}
            </p>

            <div className="space-y-8">
              {contact.items.map((item, i) => (
                <div key={i}>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">{item.title}</p>
                  <p className="text-white text-xl font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Agent Card */}
            {(contact.agent?.name || contact.agent?.initials) && (
              <div className="mt-16 flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 max-w-sm">
                <div className="w-14 h-14 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {contact.agent?.initials || "ZT"}
                </div>
                <div>
                  <p className="text-white font-bold">{contact.agent?.name || "Zevtabs Representative"}</p>
                  <p className="text-white/40 text-sm mb-1">{contact.agent?.telLabel || "Ready to assist you"}</p>
                  {contact.agent?.telHref && (
                    <a href={contact.agent.telHref} className="text-accent-400 text-sm font-medium hover:text-accent-300 transition-colors">
                      {contact.agent.telLabel || contact.agent.telHref}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/10">
            <h3 className="text-white text-2xl font-bold mb-8">{contact.formTitle || "Send a message"}</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">
                    {contact.formLabels?.name || "Name"}
                  </label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">
                    {contact.formLabels?.email || "Email"}
                  </label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold ml-1">
                  {contact.formLabels?.message || "Message"}
                </label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors resize-none" />
              </div>
              <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-accent-500 hover:text-white transition-all duration-300 active:scale-[0.98]">
                {contact.agent?.role || "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
