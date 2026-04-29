import About from "@/components/About";
import { getAboutSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function AboutPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const { main } = await getAboutSections(lang, siteId);
  return <About main={main} />;
}
