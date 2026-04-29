import Team from "@/components/Testimonials";
import { getTeamPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function TeamPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const lang = await getLanguageServer();
  const content = await getTeamPageSections(lang, siteId);
  return <Team content={content} />;
}
