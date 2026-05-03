"use client";

import { useEffect, useRef, useState } from "react";
import { ContactSections } from "@/lib/site-content-types";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactSection({ contact }: { contact: ContactSections }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="bg-white py-24 lg:py-40 relative overflow-hidden scroll-mt-20"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-50/50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-50/50 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ 
          backgroundImage: "linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)", 
          backgroundSize: "60px 60px" 
        }} 
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-32">
          
          {/* Left Column: Content */}
          <div className={`transition-all duration-[800ms] ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
              {contact.hero.badge || "Get in Touch"}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-neutral-900 leading-[0.9] mb-8">
              {contact.hero.h2Line1 || "Transforming ideas"}<br />
              <span className="text-neutral-200 italic">{contact.hero.h2Accent || "into reality."}</span>
            </h2>
            <p className="text-neutral-400 text-lg sm:text-xl font-light max-w-md border-l-2 border-neutral-100 pl-8 mb-16 italic">
              "{contact.hero.intro || "Have a vision? We have the engineering and design expertise to bring it to life."}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {contact.items.map((item, i) => (
                <div key={i} className="group">
                  <p className="text-neutral-300 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-neutral-900 text-lg font-bold tracking-tight">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Premium Agent Card */}
            {(contact.agent?.name || contact.agent?.initials) && (
              <div className="mt-20 relative group max-w-sm">
                <div className="absolute inset-0 bg-indigo-600/5 blur-2xl rounded-[32px] group-hover:bg-indigo-600/10 transition-colors" />
                <div className="relative flex items-center gap-6 p-6 rounded-[32px] bg-white/40 backdrop-blur-xl border border-neutral-100 shadow-sm transition-transform group-hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xl shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                    {contact.agent?.initials || "ZT"}
                  </div>
                  <div>
                    <p className="text-neutral-900 font-black tracking-tight">{contact.agent?.name || "Zevtabs Team"}</p>
                    <p className="text-neutral-400 text-xs font-medium mb-2">{contact.agent?.telLabel || "Lead Strategist"}</p>
                    {contact.agent?.telHref && (
                      <a href={contact.agent.telHref} className="flex items-center gap-2 text-indigo-600 text-sm font-black hover:gap-3 transition-all">
                        {contact.agent.telHref} <Send size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className={`transition-all duration-[800ms] delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-neutral-900 text-2xl font-black tracking-tight">
                  {contact.formTitle || "Start a Conversation"}
                </h3>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-[10px] uppercase tracking-[0.2em] font-black ml-1">
                      {contact.formLabels?.name || "Full Name"}
                    </label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all placeholder:text-neutral-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-[10px] uppercase tracking-[0.2em] font-black ml-1">
                      {contact.formLabels?.email || "Email Address"}
                    </label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all placeholder:text-neutral-200" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-neutral-300 text-[10px] uppercase tracking-[0.2em] font-black ml-1">
                    {contact.formLabels?.message || "Project Details"}
                  </label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell us about your vision..."
                    className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all resize-none placeholder:text-neutral-200" 
                  />
                </div>
                <button 
                  className="group relative w-full bg-black text-white font-black py-5 rounded-2xl overflow-hidden shadow-2xl transition-all active:scale-[0.98] hover:shadow-indigo-600/20"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {contact.agent?.role || "Send Message"}
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
