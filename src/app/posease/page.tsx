import { Metadata } from "next";
import { getPosEaseSections, getGlobalContact } from "@/lib/getSiteContent";
import PosEaseClient from "./PosEaseClient";

export const metadata: Metadata = {
  title: "PosEase",
  description: "Ultra-modern cloud POS for retail and hospitality.",
  icons: { icon: "/posease-logo.jpg", apple: "/posease-logo.jpg" },
};

export default async function PosEasePage() {
  const [initialSectionsMn, initialSectionsEn, globalContact] = await Promise.all([
    getPosEaseSections("mn", "posease"),
    getPosEaseSections("en", "posease"),
    getGlobalContact(),
  ]);

  return (
    <PosEaseClient
      initialMn={initialSectionsMn}
      initialEn={initialSectionsEn}
      globalContact={globalContact}
    />
  );
}
