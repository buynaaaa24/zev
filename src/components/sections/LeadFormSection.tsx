"use client";

import React, { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { encrypt } from "@/utils/encrypt";
import { CheckCircle2, AlertCircle, Send, ArrowRight } from "lucide-react";

const montserrat = Montserrat({ subsets: ["latin-ext"] });

interface LeadFormSectionProps {
  systemName: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  contactEmail?: string;
}

export default function LeadFormSection({ 
  systemName, 
  accentColor = "#6366f1", // Default Indigo
  title = "Санаагаа бодит болгон хувиргацгаая",
  subtitle = "Холбоо барих",
  contactEmail = "contact@zevtabs.mn"
}: LeadFormSectionProps) {
  const [form, setForm] = useState({
    utas: "",
    ner: "",
    mail: "",
    tailbar: "",
  });
  const [error, setError] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (error[name]) {
      setError((prev: any) => ({ ...prev, [name]: false }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.ner.trim()) newErrors.ner = true;
    if (form.utas.length !== 8) newErrors.utas = true;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.mail)) newErrors.mail = true;
    if (!form.tailbar.trim()) newErrors.tailbar = true;
    
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: any = { ...form, systemiinNer: systemName };
      const encryptedData = encrypt(JSON.stringify(payload));
      
      const response = await axios.post(
        "https://admin.zevtabs.mn/api/kholbooBarikhKhadgalya",
        encryptedData
      );

      if (response.data === "Amjilttai") {
        setStatus("success");
        setForm({ utas: "", ner: "", mail: "", tailbar: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kholbooBarikh" className={`relative py-24 lg:py-32 overflow-hidden bg-black ${montserrat.className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: accentColor }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full opacity-10 blur-[100px]" style={{ backgroundColor: accentColor }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
              {subtitle}
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] text-white mb-8">
              {title.split(' ').slice(0, 2).join(' ')}<br />
              <span style={{ color: accentColor }}>
                {title.split(' ').slice(2).join(' ')}
              </span>
            </h2>
            <p className="text-white/40 text-lg font-medium max-w-md leading-relaxed mb-10">
              Бид таны санааг бодит болгоход бэлэн байна. Мэдээллээ үлдээгээрэй, бид тантай удахгүй холбогдох болно.
            </p>

            <div className="flex flex-col gap-6">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Send size={20} style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-0.5">Email Us</p>
                  <p className="text-white font-bold tracking-tight group-hover:text-white/80 transition-colors">{contactEmail}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Side: Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow beneath the card */}
            <div className="absolute inset-0 rounded-[40px] opacity-20 blur-[40px] pointer-events-none" style={{ backgroundColor: accentColor }} />
            
            <div className="relative bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[40px] shadow-2xl">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h3 className="text-white text-2xl font-black mb-4">Амжилттай илгээгдлээ!</h3>
                    <p className="text-white/40 mb-8 font-medium">Бид 1-2 ажлын өдрийн дотор тантай холбогдох болно.</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="px-8 py-3 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all"
                    >
                      Буцах
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Нэр</label>
                      <input 
                        name="ner"
                        value={form.ner}
                        onChange={handleChange}
                        placeholder="Таны нэр"
                        className={`w-full bg-white/5 border ${error.ner ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-all`}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Утас</label>
                        <input 
                          name="utas"
                          maxLength={8}
                          value={form.utas}
                          onChange={handleChange}
                          placeholder="8 оронтой дугаар"
                          className={`w-full bg-white/5 border ${error.utas ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-all`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">И-мэйл</label>
                        <input 
                          name="mail"
                          value={form.mail}
                          onChange={handleChange}
                          placeholder="example@mail.mn"
                          className={`w-full bg-white/5 border ${error.mail ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-all`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Тайлбар</label>
                      <textarea 
                        name="tailbar"
                        value={form.tailbar}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Талбай, байршил, зогсоолын тоо гэх мэт..."
                        className={`w-full bg-white/5 border ${error.tailbar ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-all resize-none`}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full relative group py-5 rounded-2xl font-black text-lg transition-all overflow-hidden"
                      style={{ backgroundColor: accentColor, color: '#fff' }}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? "Илгээж байна..." : "Илгээх"} 
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                        <AlertCircle size={16} />
                        <span>Илгээхэд алдаа гарлаа. Дахин оролдоно уу.</span>
                      </div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
