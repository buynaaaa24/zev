"use client";

import { useState } from "react";
import Link from "next/link";
import { useParkEaseLang } from "@/contexts/ParkEaseLangContext";

const YELLOW = "#f6b414";
const YELLOW_DARK = "#d99a0e";
const YELLOW_GLOW = "rgba(246,180,20,";

type FormData = {
  orgName: string;
  contactName: string;
  phone: string;
  email: string;
  slotCount: string;
  location: string;
  message: string;
};

const T = {
  en: {
    success: {
      title: "Request Received!",
      thanks: "Thanks, ",
      fallbackOrg: "your organization",
      desc: "We'll reach out within 1–2 business days to schedule a demo and discuss setup.",
      nextStepsLabel: "What happens next",
      steps: [
        "We review your parking lot details",
        "Schedule an on-site or remote demo",
        "Provide a custom pricing quote",
        "Begin hardware setup & go live",
      ],
      back: "Back to ParkEase",
    },
    summary: {
      includedLabel: "What's included",
      pricingLabel: "Pricing tiers",
      tiers: [
        { tier: "Starter", slots: "≤30 slots" },
        { tier: "Business", slots: "31–100 slots" },
        { tier: "Enterprise", slots: "100+" },
      ],
    },
    form: {
      back: "ParkEase",
      title: "Request a Trial",
      desc: "Tell us about your organization. We'll reach out within 1–2 business days to schedule a demo and provide a custom quote.",
      fields: {
        orgName: { label: "Organization Name", placeholder: "e.g. Erdenes Mongol LLC", error: "Required" },
        contactName: { label: "Contact Person", placeholder: "Full name", error: "Required" },
        phone: { label: "Phone Number", placeholder: "+976 XXXX XXXX", error: "Required" },
        email: { label: "Email Address", placeholder: "you@company.mn", errorReq: "Required", errorInv: "Invalid email" },
        slotCount: { label: "Number of Parking Slots", error: "Required" },
        location: { label: "Parking Location / Address", placeholder: "District, street, or building name", error: "Required" },
        message: { label: "Additional Notes", optional: "(optional)", placeholder: "Any specific requirements, current setup, or questions…" },
      },
      submit: "Submit Trial Request",
      submitting: "Submitting…",
      disclaimer: "By submitting, you agree that Zevtabs may contact you about ParkEase. No spam, no obligation.",
    },
    sidebar: {
      includedLabel: "What's included",
      pricingLabel: "Pricing at a glance",
      tiers: [
        { tier: "Starter", slots: "Up to 30 slots" },
        { tier: "Business", slots: "31 – 100 slots" },
        { tier: "Enterprise", slots: "100+ slots" },
      ],
      pricingNote: "We'll send a tailored quote after reviewing your request.",
      contactLabel: "Questions? Reach us directly:",
    },
    features: [
      "All Mongolian bank payments",
      "QPay & Sticker QR support",
      "24/7 automatic barrier control",
      "Free driver registration",
      "Real-time occupancy dashboard",
      "Zero parking staff needed",
    ],
    slotOptions: [
      { value: "", label: "Select slot count…" },
      { value: "1-20", label: "1 – 20 slots  (Starter)" },
      { value: "21-50", label: "21 – 50 slots  (Business)" },
      { value: "51-100", label: "51 – 100 slots  (Business)" },
      { value: "100+", label: "100+ slots  (Enterprise)" },
    ],
  },
  mn: {
    success: {
      title: "Хүсэлт хүлээж авлаа!",
      thanks: "Баярлалаа, ",
      fallbackOrg: "танай байгууллага",
      desc: "Бид 1-2 ажлын өдрийн дотор холбогдож, демо хуваарь гарган, тохиргооны талаар ярилцах болно.",
      nextStepsLabel: "Дараа нь юу болох вэ",
      steps: [
        "Бид таны зогсоолын мэдээллийг хянана",
        "Газар дээр нь эсвэл зайнаас демо хийхээр товлоно",
        "Тусгайлан үнийн санал гаргана",
        "Тоног төхөөрөмж суурилуулж, ашиглалтад оруулна",
      ],
      back: "ParkEase руу буцах",
    },
    summary: {
      includedLabel: "Юу багтсан бэ",
      pricingLabel: "Үнэ тарифын тойм",
      tiers: [
        { tier: "Starter", slots: "≤30 зогсоол" },
        { tier: "Business", slots: "31–100 зогсоол" },
        { tier: "Enterprise", slots: "100+" },
      ],
    },
    form: {
      back: "ParkEase",
      title: "Турших хүсэлт илгээх",
      desc: "Байгууллагынхаа тухай бидэнд хэлнэ үү. Бид 1-2 ажлын өдрийн дотор холбогдож демо үзүүлэн, тусгай үнийн санал өгнө.",
      fields: {
        orgName: { label: "Байгууллагын нэр", placeholder: "Ж.нь Эрдэнэс Монгол ХХК", error: "Шаардлагатай" },
        contactName: { label: "Холбоо барих хүн", placeholder: "Бүтэн нэр", error: "Шаардлагатай" },
        phone: { label: "Утасны дугаар", placeholder: "+976 XXXX XXXX", error: "Шаардлагатай" },
        email: { label: "И-мэйл хаяг", placeholder: "you@company.mn", errorReq: "Шаардлагатай", errorInv: "Буруу и-мэйл" },
        slotCount: { label: "Зогсоолын тоо", error: "Шаардлагатай" },
        location: { label: "Зогсоолын байршил / Хаяг", placeholder: "Дүүрэг, гудамж эсвэл барилгын нэр", error: "Шаардлагатай" },
        message: { label: "Нэмэлт мэдээлэл", optional: "(заавал биш)", placeholder: "Тусгай шаардлага, одоогийн нөхцөл, эсвэл асуулт…" },
      },
      submit: "Турших хүсэлт илгээх",
      submitting: "Илгээж байна…",
      disclaimer: "Хүсэлт илгээснээр Zevtabs нь ParkEase-ийн талаар тантай холбогдохыг зөвшөөрч байгаа болно. Спам илгээхгүй.",
    },
    sidebar: {
      includedLabel: "Юу багтсан бэ",
      pricingLabel: "Үнэ тарифын тойм",
      tiers: [
        { tier: "Starter", slots: "30 хүртэл зогсоол" },
        { tier: "Business", slots: "31 – 100 зогсоол" },
        { tier: "Enterprise", slots: "100+ зогсоол" },
      ],
      pricingNote: "Бид таны хүсэлтийг хянаж үзсэний дараа тусгай үнийн санал илгээх болно.",
      contactLabel: "Асуулт байна уу? Бидэнтэй шууд холбогдох:",
    },
    features: [
      "Монголын бүх банкны төлбөр",
      "QPay болон Стикер QR дэмжлэг",
      "24/7 автомат хаалтны удирдлага",
      "Жолооч нарт үнэгүй бүртгэл",
      "Бодит цагийн эзэлхүүний самбар",
      "Зогсоолын ажилтан шаардлагагүй",
    ],
    slotOptions: [
      { value: "", label: "Зогсоолын тоог сонгоно уу…" },
      { value: "1-20", label: "1 – 20 зогсоол  (Starter)" },
      { value: "21-50", label: "21 – 50 зогсоол  (Business)" },
      { value: "51-100", label: "51 – 100 зогсоол  (Business)" },
      { value: "100+", label: "100+ зогсоол  (Enterprise)" },
    ],
  },
} as const;

/* ── Success State ────────────────────────────────────────── */
function SuccessState({ orgName }: { orgName: string }) {
  const { lang } = useParkEaseLang();
  const t = T[lang].success;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center py-16">
        <div
          className="w-18 h-18 w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-7"
          style={{ background: `linear-gradient(135deg,${YELLOW},#ffc93c)`, boxShadow: `0 16px 48px ${YELLOW_GLOW}0.3)` }}
        >
          <svg className="w-8 h-8" style={{ color: "#1a0f00" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-3">
          {t.title}
        </h1>
        <p className="text-neutral-500 text-base sm:text-lg leading-relaxed mb-2">
          {t.thanks}<strong className="text-neutral-700">{orgName || t.fallbackOrg}</strong>.
        </p>
        <p className="text-neutral-400 text-[15px] leading-relaxed mb-10">
          {t.desc}
        </p>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 p-5 sm:p-6 text-left mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">{t.nextStepsLabel}</p>
          {t.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                style={{ background: `${YELLOW_GLOW}0.12)`, color: YELLOW_DARK }}
              >
                {i + 1}
              </div>
              <p className="text-neutral-600 text-[14px] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <Link
          href="/parkease"
          className="inline-flex items-center gap-2 font-semibold text-[15px] transition-colors hover:opacity-75"
          style={{ color: YELLOW_DARK }}
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          {t.back}
        </Link>
      </div>
    </div>
  );
}

/* ── Mobile summary strip (visible on <lg only) ───────────── */
function MobileSummary() {
  const { lang } = useParkEaseLang();
  const t = T[lang].summary;
  const features = T[lang].features;

  return (
    <div className="lg:hidden mb-8 rounded-2xl border border-neutral-100 bg-white p-5 overflow-hidden">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">{t.includedLabel}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 text-[13px] text-neutral-700">
            <svg className="w-4 h-4 shrink-0" style={{ color: YELLOW }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-50 pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">{t.pricingLabel}</p>
        <div className="flex flex-wrap gap-2">
          {t.tiers.map((tierData, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100">
              <span className="text-[12px] font-bold text-neutral-800">{tierData.tier}</span>
              <span className="text-[11px] text-neutral-400">{tierData.slots}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Form Page ────────────────────────────────────────────── */
export default function TryPage() {
  const { lang } = useParkEaseLang();
  const tForm = T[lang].form;
  const tSidebar = T[lang].sidebar;
  const features = T[lang].features;
  const slotOptions = T[lang].slotOptions;

  const [form, setForm] = useState<FormData>({
    orgName: "", contactName: "", phone: "", email: "",
    slotCount: "", location: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.orgName.trim()) errs.orgName = tForm.fields.orgName.error;
    if (!form.contactName.trim()) errs.contactName = tForm.fields.contactName.error;
    if (!form.phone.trim()) errs.phone = tForm.fields.phone.error;
    if (!form.email.trim()) errs.email = tForm.fields.email.errorReq;
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = tForm.fields.email.errorInv;
    if (!form.slotCount) errs.slotCount = tForm.fields.slotCount.error;
    if (!form.location.trim()) errs.location = tForm.fields.location.error;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return <SuccessState orgName={form.orgName} />;

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl sm:rounded-2xl border bg-white text-neutral-800 text-[15px] placeholder:text-neutral-300 outline-none transition-all duration-200";

  const fieldStyle = (key: keyof FormData): React.CSSProperties =>
    errors[key] ? { borderColor: "#fca5a5" } : { borderColor: "#e5e7eb" };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = YELLOW;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${YELLOW_GLOW}0.16)`;
  };
  const onBlur = (key: keyof FormData) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = errors[key] ? "#fca5a5" : "#e5e7eb";
      e.currentTarget.style.boxShadow = "";
    };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="pt-[60px] md:pt-[68px]" />

      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-14 items-start">

          {/* ── Left: Header + Mobile Summary + Form ──── */}
          <div>
            <Link
              href="/parkease"
              className="inline-flex items-center gap-1.5 text-neutral-400 text-sm font-medium hover:text-neutral-600 transition-colors mb-6 sm:mb-8"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {tForm.back}
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 mb-3 sm:mb-4">
              {tForm.title}
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg font-light">
              {tForm.desc}
            </p>

            {/* Mobile-only summary */}
            <MobileSummary />

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">

              {/* Org Name */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                  {tForm.fields.orgName.label} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.orgName}
                  onChange={set("orgName")}
                  placeholder={tForm.fields.orgName.placeholder}
                  className={inputBase}
                  style={fieldStyle("orgName")}
                  onFocus={onFocus}
                  onBlur={onBlur("orgName")}
                />
                {errors.orgName && <p className="text-red-400 text-xs mt-1">{errors.orgName}</p>}
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                  {tForm.fields.contactName.label} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={set("contactName")}
                  placeholder={tForm.fields.contactName.placeholder}
                  className={inputBase}
                  style={fieldStyle("contactName")}
                  onFocus={onFocus}
                  onBlur={onBlur("contactName")}
                />
                {errors.contactName && <p className="text-red-400 text-xs mt-1">{errors.contactName}</p>}
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                    {tForm.fields.phone.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder={tForm.fields.phone.placeholder}
                    className={inputBase}
                    style={fieldStyle("phone")}
                    onFocus={onFocus}
                    onBlur={onBlur("phone")}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                    {tForm.fields.email.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder={tForm.fields.email.placeholder}
                    className={inputBase}
                    style={fieldStyle("email")}
                    onFocus={onFocus}
                    onBlur={onBlur("email")}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Slot Count */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                  {tForm.fields.slotCount.label} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.slotCount}
                    onChange={set("slotCount")}
                    className={`${inputBase} appearance-none pr-10 cursor-pointer`}
                    style={fieldStyle("slotCount")}
                    onFocus={onFocus}
                    onBlur={onBlur("slotCount")}
                  >
                    {slotOptions.map(o => (
                      <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.slotCount && <p className="text-red-400 text-xs mt-1">{errors.slotCount}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                  {tForm.fields.location.label} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={set("location")}
                  placeholder={tForm.fields.location.placeholder}
                  className={inputBase}
                  style={fieldStyle("location")}
                  onFocus={onFocus}
                  onBlur={onBlur("location")}
                />
                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 mb-1.5">
                  {tForm.fields.message.label}
                  <span className="text-neutral-300 font-normal ml-1">{tForm.fields.message.optional}</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder={tForm.fields.message.placeholder}
                  rows={4}
                  className={`${inputBase} resize-none`}
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={onFocus}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = ""; }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl sm:rounded-2xl text-[15px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.99]"
                style={{
                  background: loading ? YELLOW : `linear-gradient(90deg,${YELLOW},#ffc93c,${YELLOW})`,
                  backgroundSize: "200%",
                  animation: loading ? "none" : "shimmer 3s linear infinite",
                  boxShadow: `0 8px 28px ${YELLOW_GLOW}0.28)`,
                  color: "#1a0f00",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {tForm.submitting}
                  </span>
                ) : (
                  tForm.submit
                )}
              </button>

              <p className="text-neutral-400 text-xs text-center leading-relaxed pt-1">
                {tForm.disclaimer}
              </p>
            </form>
          </div>

          {/* ── Right: Desktop Sidebar ──────────────────── */}
          <div className="hidden lg:block sticky top-28 space-y-4">

            {/* What you get */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-5">{tSidebar.includedLabel}</p>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] text-neutral-700">
                    <svg className="w-4 h-4 shrink-0" style={{ color: YELLOW }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-5">{tSidebar.pricingLabel}</p>
              {tSidebar.tiers.map((t, i) => (
                <div key={i} className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-neutral-50" : ""}`}>
                  <span className="text-[14px] font-semibold text-neutral-800">{t.tier}</span>
                  <span className="text-[13px] text-neutral-400">{t.slots}</span>
                </div>
              ))}
              <p className="text-neutral-400 text-xs mt-4 leading-relaxed">
                {tSidebar.pricingNote}
              </p>
            </div>

            {/* Contact */}
            <div className="rounded-3xl p-6" style={{ background: "linear-gradient(135deg,#120d00,#1e1500)" }}>
              <p className="text-white/50 text-[13px] mb-1">{tSidebar.contactLabel}</p>
              <a href="mailto:info@zevtabs.mn" className="font-semibold text-[15px] transition-colors hover:opacity-80" style={{ color: YELLOW }}>
                info@zevtabs.mn
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
