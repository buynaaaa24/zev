import { getFooterSections } from "@/lib/getSiteContent";
import Footer from "@/components/Footer";
import { getLanguageServer } from "@/lib/i18n-server";
import { translations } from "@/lib/translations";

export default async function FooterWithContent({ siteId = "zevtaps" }: { siteId?: string }) {
  const lang = await getLanguageServer();
  const content = await getFooterSections(lang, siteId);
  const t = translations[lang];
  return <Footer content={content} t={t} />;
}
