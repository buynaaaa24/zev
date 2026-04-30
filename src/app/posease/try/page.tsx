"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePosEaseLang } from "@/contexts/PosEaseLangContext";

const PINK = "#ec4899";
const PINK_GLOW = "rgba(236,72,153,";

type FormData = {
  orgName: string;
  contactName: string;
  phone: string;
  email: string;
  businessType: string;
  locationCount: string;
  message: string;
};

const T = {
  en: {
    success: {
      title: "Request Received!",
      thanks: "Thanks, ",
      fallbackOrg: "your business",
      desc: "We'll reach out within 1–2 business days to schedule a demo and discuss your POS setup.",
      back: "Return to Experience",
    },
    form: {
      title: "Start your journey.",
      desc: "Tell us about your business. Our experts will reach out to design your custom POS solution.",
      fields: {
        orgName: { label: "Business Name", placeholder: "e.g. Rose Cafe" },
        contactName: { label: "Full Name", placeholder: "Alex Johnson" },
        phone: { label: "Phone", placeholder: "+976" },
        email: { label: "Email", placeholder: "alex@business.com" },
        businessType: { label: "Type", options: ["Retail", "Restaurant", "Service", "Other"] },
        locationCount: { label: "Scale", options: ["1 Location", "2-5 Locations", "5-10 Locations", "10+ Locations"] },
        message: { label: "Notes", placeholder: "Anything else?" },
      },
      submit: "Submit Request",
      submitting: "Syncing...",
    }
  },
  mn: {
    success: {
      title: "Хүсэлт хүлээж авлаа!",
      thanks: "Баярлалаа, ",
      fallbackOrg: "танай бизнес",
      desc: "Бид 1-2 ажлын өдрийн дотор холбогдож, таны бизнест тохирох POS шийдлийг танилцуулах болно.",
      back: "Буцах",
    },
    form: {
      title: "Бизнесээ эхлүүл.",
      desc: "Бизнесийнхээ тухай мэдээллийг илгээснээр манай мэргэжилтнүүд танд хамгийн шилдэг шийдлийг санал болгоно.",
      fields: {
        orgName: { label: "Бизнесийн нэр", placeholder: "Ж.нь Роуз Кафэ" },
        contactName: { label: "Бүтэн нэр", placeholder: "Болдбаатар" },
        phone: { label: "Утас", placeholder: "+976" },
        email: { label: "И-мэйл", placeholder: "bold@business.mn" },
        businessType: { label: "Төрөл", options: ["Худалдаа", "Ресторан", "Үйлчилгээ", "Бусад"] },
        locationCount: { label: "Хэмжээ", options: ["1 Байршил", "2-5 Байршил", "5-10 Байршил", "10+ Байршил"] },
        message: { label: "Тэмдэглэл", placeholder: "Нэмэлт мэдээлэл бий юу?" },
      },
      submit: "Хүсэлт илгээх",
      submitting: "Илгээж байна...",
    }
  }
} as const;

export default function PosTryPage() {
  const { lang } = usePosEaseLang();
  const t = T[lang];
  
  const [form, setForm] = useState<FormData>({
    orgName: "", contactName: "", phone: "", email: "",
    businessType: "", locationCount: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const set = (key: keyof FormData) => (e: any) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.contactName,
          phone: form.phone,
          email: form.email,
          address: form.orgName,
          notes: `POS Trial Request\nBusiness Type: ${form.businessType}\nLocations: ${form.locationCount}\nNotes: ${form.message}`,
          language: lang,
          items: [{ productName: "PosEase Demo Request", quantity: 1, unitPrice: 0 }]
        }),
      });
      if (response.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-[fade-in_0.8s_ease-out]">
          <div className="w-24 h-24 rounded-[32px] bg-pink-500 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.4)]">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">{t.success.title}</h1>
          <p className="text-white/40 text-xl font-medium">{t.success.desc}</p>
          <Link href="/posease" className="inline-block pt-10 text-pink-500 font-bold hover:opacity-80 transition-opacity">
            {t.success.back} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        <div className="space-y-8">
           <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-[fade-in-up_0.8s_ease-out]">
              {t.form.title}
           </h1>
           <p className="text-white/40 text-xl sm:text-2xl font-medium max-w-md animate-[fade-in-up_1s_ease-out]">
              {t.form.desc}
           </p>
           
           <div className="pt-10 flex flex-wrap gap-4">
              {["Hardware included", "24/7 Support", "Zero Setup Fee"].map((badge, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
                   {badge}
                </span>
              ))}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[48px] p-8 sm:p-12 space-y-6 shadow-2xl animate-[fade-in-up_1.2s_ease-out]">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.orgName.label}</label>
                 <input 
                    required type="text" value={form.orgName} onChange={set("orgName")}
                    placeholder={t.form.fields.orgName.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 outline-none transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.contactName.label}</label>
                 <input 
                    required type="text" value={form.contactName} onChange={set("contactName")}
                    placeholder={t.form.fields.contactName.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 outline-none transition-all"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.phone.label}</label>
                 <input 
                    required type="tel" value={form.phone} onChange={set("phone")}
                    placeholder={t.form.fields.phone.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 outline-none transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.email.label}</label>
                 <input 
                    required type="email" value={form.email} onChange={set("email")}
                    placeholder={t.form.fields.email.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 outline-none transition-all"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.businessType.label}</label>
                 <select 
                    required value={form.businessType} onChange={set("businessType")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white/60 focus:border-pink-500/50 outline-none transition-all appearance-none"
                 >
                    <option value="" className="bg-neutral-900">Select</option>
                    {t.form.fields.businessType.options.map(o => <option key={o} value={o} className="bg-neutral-900">{o}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.locationCount.label}</label>
                 <select 
                    required value={form.locationCount} onChange={set("locationCount")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white/60 focus:border-pink-500/50 outline-none transition-all appearance-none"
                 >
                    <option value="" className="bg-neutral-900">Select</option>
                    {t.form.fields.locationCount.options.map(o => <option key={o} value={o} className="bg-neutral-900">{o}</option>)}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t.form.fields.message.label}</label>
              <textarea 
                 value={form.message} onChange={set("message")}
                 placeholder={t.form.fields.message.placeholder}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 outline-none transition-all h-32 resize-none"
              />
           </div>

           <button 
              disabled={loading}
              className="w-full py-5 rounded-3xl bg-pink-500 text-white font-black text-lg shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
           >
              {loading ? t.form.submitting : t.form.submit}
           </button>
        </form>
      </div>
    </div>
  );
}
