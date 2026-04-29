import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";

export default async function ContactPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const content = await getContactSections("mn", siteId);
  return <Contact content={content} />;
}
