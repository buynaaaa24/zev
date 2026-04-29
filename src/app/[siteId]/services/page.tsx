import Services from "@/components/Services";
import { getServicesSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function ServicesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const content = await getServicesSections(lang, siteId);
  return <Services content={content} />;
}
