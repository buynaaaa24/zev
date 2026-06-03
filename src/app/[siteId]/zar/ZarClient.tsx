"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  CalendarDays,
  MapPin,
  X,
  Banknote,
  Mail,
  Megaphone,
  ExternalLink,
  Search,
  ArrowRight
} from "lucide-react";
import { resolvePublicMediaUrl } from "@/lib/api";

export type JobItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contactEmail?: string;
  imageUrl?: string;
  createdAt?: string;
  postedByDisplayName?: string;
};

export type SalesAdItem = {
  id: string;
  title: string;
  summary?: string;
  body: string;
  imageUrl?: string;
  externalUrl?: string;
  validFrom?: string;
  validTo?: string;
  createdAt?: string;
  postedByDisplayName?: string;
};

interface ZarClientProps {
  jobs: JobItem[];
  ads: SalesAdItem[];
  lang: string;
  header?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
  };
}

const texts = {
  mn: {
    title: "Зар мэдээний нэгдсэн төв",
    subtitle: "Ажлын байр болон борлуулалтын заруудын мэдээлэлтэй нэг дороос танилцаарай.",
    jobsTab: "Ажлын зар",
    salesTab: "Борлуулалтын зар",
    noJobs: "Одоогоор идэвхтэй ажлын зар байхгүй байна.",
    noSales: "Одоогоор идэвхтэй борлуулалтын зар байхгүй байна.",
    searchPlaceholder: "Зар хайх...",
    salary: "Цалин",
    location: "Байршил",
    company: "Байгууллага",
    viewDetails: "Дэлгэрэнгүй үзэх",
    close: "Хаах",
    published: "Нийтлэгдсэн",
    validPeriod: "Хүчинтэй хугацаа",
    sendEmail: "Имэйл илгээх",
    externalLink: "Холбоосоор зочлох",
    jobDetails: "Ажлын байрны дэлгэрэнгүй",
    saleDetails: "Зар мэдээний дэлгэрэнгүй",
    publisher: "Нийтлэгч",
    emailHint: "Таны имэйл програмыг нээж, анхны захиалгыг бөглөх болно."
  },
  en: {
    title: "Unified Ads Center",
    subtitle: "Explore job vacancies and sales announcements in one place.",
    jobsTab: "Job Vacancies",
    salesTab: "Sales Announcements",
    noJobs: "No active job openings at the moment.",
    noSales: "No active sales announcements at the moment.",
    searchPlaceholder: "Search ads...",
    salary: "Salary",
    location: "Location",
    company: "Company",
    viewDetails: "View Details",
    close: "Close",
    published: "Published",
    validPeriod: "Valid Period",
    sendEmail: "Send Email",
    externalLink: "Visit Link",
    jobDetails: "Job Details",
    saleDetails: "Announcement Details",
    publisher: "Publisher",
    emailHint: "This will open your email application to draft an inquiry."
  }
};

function formatDate(iso?: string, lang = "mn"): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(lang === "mn" ? "mn-MN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return null;
  }
}

export default function ZarClient({ jobs, ads, lang, header }: ZarClientProps) {
  const t = lang === "en" ? texts.en : texts.mn;
  const [activeTab, setActiveTab] = useState<"jobs" | "sales">("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [selectedAd, setSelectedAd] = useState<SalesAdItem | null>(null);

  // Reset page of search query on tab switch
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    });
  }, [jobs, searchQuery]);

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        ad.title.toLowerCase().includes(query) ||
        (ad.summary ?? "").toLowerCase().includes(query) ||
        ad.body.toLowerCase().includes(query)
      );
    });
  }, [ads, searchQuery]);

  const handleCloseModal = useCallback(() => {
    setSelectedJob(null);
    setSelectedAd(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    if (selectedJob || selectedAd) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedJob, selectedAd, handleCloseModal]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Premium Header */}
      <section className="relative overflow-hidden hero-gradient pt-32 pb-20 text-white sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 hero-glow opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
            {activeTab === "jobs" ? <Briefcase className="h-3.5 w-3.5" /> : <Megaphone className="h-3.5 w-3.5" />}
            {header?.eyebrow || (activeTab === "jobs" ? t.jobsTab : t.salesTab)}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">{header?.title || t.title}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            {header?.intro || t.subtitle}
          </p>
        </div>
      </section>

      {/* Control Panel (Tabs & Search) */}
      <div className="mx-auto -mt-8 max-w-6xl px-4 relative z-10">
        <div className="glass rounded-2xl border border-slate-200/80 p-4 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tab Switcher */}
          <div className="flex w-full md:w-auto p-1 bg-slate-100/80 rounded-xl border border-slate-200/30">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "jobs"
                  ? "bg-white text-neutral-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              {t.jobsTab}
              {jobs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-bold">
                  {jobs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "sales"
                  ? "bg-white text-neutral-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Megaphone className="h-4 w-4" />
              {t.salesTab}
              {ads.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-bold">
                  {ads.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto mt-12 max-w-6xl px-4">
        {activeTab === "jobs" ? (
          filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
              <p className="mt-4 text-slate-500 font-medium">{t.noJobs}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="group flex flex-col h-full rounded-2xl border border-slate-100 bg-white text-left card-hover focus:outline-none focus:ring-2 focus:ring-accent-500/30 overflow-hidden"
                >
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                    {job.imageUrl ? (
                      <img
                        src={resolvePublicMediaUrl(job.imageUrl) ?? job.imageUrl}
                        alt={job.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950">
                        <Briefcase className="h-10 w-10 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-brand-900 group-hover:text-accent-500 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{job.company}</span>
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{job.location}</span>
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                      {job.salary ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-100">
                          <Banknote className="h-3.5 w-3.5" />
                          {job.salary}
                        </span>
                      ) : (
                        <div />
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-600 group-hover:gap-2 transition-all">
                        {t.viewDetails}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Megaphone className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <p className="mt-4 text-slate-500 font-medium">{t.noSales}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <button
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className="group flex flex-col h-full rounded-2xl border border-slate-100 bg-white text-left card-hover focus:outline-none focus:ring-2 focus:ring-accent-500/30 overflow-hidden"
              >
                <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                  {ad.imageUrl ? (
                    <img
                      src={resolvePublicMediaUrl(ad.imageUrl) ?? ad.imageUrl}
                      alt={ad.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950">
                      <Megaphone className="h-10 w-10 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-900 group-hover:text-accent-500 transition-colors line-clamp-1">
                      {ad.title}
                    </h3>
                    {ad.summary && (
                      <p className="mt-1.5 text-sm font-semibold text-accent-600 line-clamp-1">
                        {ad.summary}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">
                      {ad.body}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{formatDate(ad.createdAt, lang)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-600 group-hover:gap-2 transition-all">
                      {t.viewDetails}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail view */}
      {typeof document !== "undefined" && (selectedJob || selectedAd) &&
        createPortal(
          <div className="fixed inset-0 z-[1100] flex items-end justify-center overflow-hidden sm:items-center sm:p-5">
            {/* Backdrop */}
            <button
              type="button"
              className="absolute inset-0 bg-brand-950/75 backdrop-blur-[3px] transition-opacity duration-300"
              onClick={handleCloseModal}
              aria-label={t.close}
            />

            {/* Modal Body */}
            <div className="relative z-[1101] flex h-[min(92dvh,900px)] w-[min(100vw-1rem,1000px)] flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-black/[0.04] sm:rounded-2xl transition-all duration-300">
              {/* Modal Header */}
              <header className="relative shrink-0 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                <div className="absolute inset-y-3 left-0 w-1 rounded-full bg-accent-500" />
                <div className="flex items-start justify-between gap-4 pl-3">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {selectedJob ? <Briefcase className="h-3 w-3" /> : <Megaphone className="h-3 w-3" />}
                      {selectedJob ? t.jobDetails : t.saleDetails}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl break-words">
                      {selectedJob ? selectedJob.title : selectedAd?.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-neutral-900 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </header>

              {/* Modal Content Scrollable */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/20">
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-stretch lg:gap-8">
                  {/* Left Column: Image placeholder or media */}
                  <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 lg:sticky lg:top-0 lg:w-[40%] lg:self-start">
                    {(selectedJob?.imageUrl || selectedAd?.imageUrl) ? (
                      <div className="aspect-[16/10] w-full lg:aspect-auto lg:max-h-[350px]">
                        <img
                          src={resolvePublicMediaUrl(selectedJob ? selectedJob.imageUrl : selectedAd?.imageUrl) ?? (selectedJob ? selectedJob.imageUrl : selectedAd?.imageUrl)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] min-h-[180px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-10 lg:aspect-auto lg:min-h-[260px]">
                        {selectedJob ? (
                          <Briefcase className="h-12 w-12 text-white/30" />
                        ) : (
                          <Megaphone className="h-12 w-12 text-white/30" />
                        )}
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">ZEV</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Metadata & Detailed Body */}
                  <div className="min-w-0 flex-1 space-y-6">
                    {/* Metadata Card */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4">
                      {selectedJob ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.company}</span>
                            <span className="text-sm font-semibold text-neutral-800 mt-1 block break-words">{selectedJob.company}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.location}</span>
                            <span className="text-sm font-semibold text-neutral-800 mt-1 block break-words">{selectedJob.location}</span>
                          </div>
                          {selectedJob.salary && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.salary}</span>
                              <span className="text-sm font-bold text-emerald-800 mt-1 block">{selectedJob.salary}</span>
                            </div>
                          )}
                          {selectedJob.createdAt && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.published}</span>
                              <span className="text-sm font-semibold text-neutral-800 mt-1 block">{formatDate(selectedJob.createdAt, lang)}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        selectedAd && (
                          <div className="grid grid-cols-2 gap-4">
                            {selectedAd.validFrom && (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.validPeriod}</span>
                                <span className="text-sm font-semibold text-neutral-800 mt-1 block">
                                  {formatDate(selectedAd.validFrom, lang)} - {formatDate(selectedAd.validTo, lang) || "..."}
                                </span>
                              </div>
                            )}
                            {selectedAd.createdAt && (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.published}</span>
                                <span className="text-sm font-semibold text-neutral-800 mt-1 block">{formatDate(selectedAd.createdAt, lang)}</span>
                              </div>
                            )}
                            {selectedAd.postedByDisplayName && (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t.publisher}</span>
                                <span className="text-sm font-semibold text-neutral-800 mt-1 block">{selectedAd.postedByDisplayName}</span>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {/* Detailed Body Text */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                        {t.viewDetails}
                      </h3>
                      <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                        {selectedJob ? selectedJob.description : selectedAd?.body}
                      </div>
                    </div>

                    {/* Interaction Buttons (Email for Jobs, Link for Ads) */}
                    {selectedJob?.contactEmail && (
                      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-3">
                        <a
                          href={`mailto:${selectedJob.contactEmail}?subject=Inquiry: ${encodeURIComponent(selectedJob.title)}`}
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent-500 text-white font-bold text-sm px-5 py-3 hover:bg-accent-600 transition"
                        >
                          <Mail className="h-4 w-4" />
                          {t.sendEmail}: {selectedJob.contactEmail}
                        </a>
                        <p className="text-xs text-slate-400 text-center">{t.emailHint}</p>
                      </div>
                    )}

                    {selectedAd?.externalUrl && (
                      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <a
                          href={selectedAd.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent-500 text-white font-bold text-sm px-5 py-3 hover:bg-accent-600 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t.externalLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <footer className="flex shrink-0 items-center justify-end border-t border-slate-200/80 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {t.close}
                </button>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
