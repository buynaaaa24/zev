import Properties from "@/components/Menu";
import { getPropertiesPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function PropertiesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const content = await getPropertiesPageSections(lang, siteId);
  return <Properties content={content} />;
}
