import AjluudGallery from "@/components/sections/AjluudGallery";
import { getAjluudSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ажлууд | Zevtabs",
  description: "Бидний хийсэн шилдэг төслүүдийн галерей",
};

export default async function AjluudPage() {
  const lang = await getLanguageServer();
  const ajluudData = await getAjluudSections(lang, "zevtabs");

  return (
    <div className="pt-[60px] md:pt-[68px]">
      <AjluudGallery data={ajluudData} />
    </div>
  );
}
