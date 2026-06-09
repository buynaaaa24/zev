import { getFooterSections } from "@/lib/getSiteContent";
import Footer from "@/components/Footer";
import { getLanguageServer } from "@/lib/i18n-server";
import { translations } from "@/lib/translations";

export default async function FooterWithContent({ siteId = "zevtabs" }: { siteId?: string }) {
  const lang = await getLanguageServer();
  const content = await getFooterSections(lang, siteId);
  const t = translations[lang];
  let accentColor = "rgb(99, 102, 241)"; // default indigo
  let trialHref: string | undefined = undefined;

  if (siteId === "parkease") {
    accentColor = "#f6b414";
    trialHref = "/parkease/try";
  } else if (siteId === "posease") {
    accentColor = "rgb(255, 68, 105)";
    trialHref = "/posease/try";
  } else if (siteId === "amarhome") {
    accentColor = "#10b981";
    trialHref = "/amarhome/try";
  } else if (siteId === "rently") {
    accentColor = "#10b981";
    trialHref = "/rently/try";
  }


  return (
    <Footer 
      content={content} 
      t={t} 
      accentColor={accentColor} 
      trialHref={trialHref}
    />
  );
}



