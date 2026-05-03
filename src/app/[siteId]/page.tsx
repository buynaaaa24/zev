import HeroSection from "../../components/sections/HeroSection";
import AboutSection from "../../components/sections/AboutSection";
import ServicesSection from "../../components/sections/ServicesSection";
import WorkSection from "../../components/sections/WorkSection";
import ContactSection from "../../components/sections/ContactSection";
import LeadFormSection from "../../components/sections/LeadFormSection";
import {
  getHomeSections,
  getAboutSections,
  getServicesSections,
  getContactSections,
  getPropertiesPageSections,
  getFooterSections,
} from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function Home({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const lang = await getLanguageServer();

  const [
    homeData,
    aboutData,
    servicesData,
    contactData,
    propertiesData,
    footerData,
  ] = await Promise.all([
    getHomeSections(lang, siteId),
    getAboutSections(lang, siteId),
    getServicesSections(lang, siteId),
    getContactSections(lang, siteId),
    getPropertiesPageSections(lang, siteId),
    getFooterSections(lang, siteId),
  ]);


  return (
    <>
      <HeroSection hero={homeData.hero} />
      <AboutSection
        about={aboutData.main}
        partners={
          aboutData.main.partners?.length
            ? aboutData.main.partners
            : footerData.partners.items
        }
      />
      <ServicesSection services={servicesData} />
      <WorkSection 
        properties={propertiesData} 
        lang={lang}
        bgImages={homeData.hero.slideImages}
      />
      {siteId === "zevtabs" ? (
        <LeadFormSection systemName="Zevtabs General" />
      ) : (
        <ContactSection contact={contactData} />
      )}
    </>
  );
}
