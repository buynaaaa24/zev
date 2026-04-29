import Hero from "@/components/Hero";
import { getHomeSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function Home({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const { hero } = await getHomeSections(lang, siteId);
  return <Hero hero={hero} />;
}
