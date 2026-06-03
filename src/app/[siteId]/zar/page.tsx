import { getApiBaseUrl } from "@/lib/api";
import { fetchWithTimeout } from "@/lib/server-fetch";
import { getLanguageServer } from "@/lib/i18n-server";
import ZarClient from "@/app/[siteId]/zar/ZarClient";
import type { JobItem } from "../jobs/JobsClient";
import type { SalesAdItem } from "@/components/sales/SalesAdsClient";

async function loadJobs(lang: string, siteId: string): Promise<JobItem[]> {
  try {
    const base = getApiBaseUrl();
    const res = await fetchWithTimeout(`${base}/api/v1/jobs?lang=${lang}&siteId=${siteId}`, {
      next: { revalidate: 1 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: JobItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function loadAds(lang: string, siteId: string): Promise<SalesAdItem[]> {
  try {
    const base = getApiBaseUrl();
    const res = await fetchWithTimeout(`${base}/api/v1/sales-ads?lang=${lang}&siteId=${siteId}`, {
      next: { revalidate: 1 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: SalesAdItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function ZarPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const [jobs, ads] = await Promise.all([
    loadJobs(lang, siteId),
    loadAds(lang, siteId),
  ]);

  return <ZarClient jobs={jobs} ads={ads} lang={lang} />;
}
