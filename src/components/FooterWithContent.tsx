import { getFooterSections } from "@/lib/getSiteContent";
import Footer from "@/components/Footer";
import { getLanguageServer } from "@/lib/i18n-server";
import { translations } from "@/lib/translations";

export default async function FooterWithContent({ siteId = "zevtabs" }: { siteId?: string }) {
  const lang = await getLanguageServer();
  const content = await getFooterSections(lang, siteId);
  const t = translations[lang];
  let accentColor = "rgb(99, 102, 241)"; // default indigo
  let logo = "/logo.png";
  let brandName = "Zevtabs";
  let trialHref: string | undefined = undefined;

  if (siteId === "parkease") {
    accentColor = "#f6b414";
    logo = "/images/parkease.jpg";
    brandName = "ParkEase";
    trialHref = "/parkease/try";
  } else if (siteId === "posease") {
    accentColor = "rgb(255, 68, 105)";
    logo = "/posease-logo.jpg";
    brandName = "PosEase";
  } else if (siteId === "amarhome") {
    accentColor = "rgb(255, 68, 105)";
    logo = "/amarhome-logo.jpg";
    brandName = "AmarHome";
  } else if (siteId === "rently") {
    accentColor = "#10b981";
    logo = "/images/rently.png";
    brandName = "Rently";
  }


  return (
    <Footer 
      content={content} 
      t={t} 
      accentColor={accentColor} 
      logo={logo} 
      brandName={brandName} 
      trialHref={trialHref}
    />
  );
}



