import { Metadata } from "next";
import { getPosEaseSections } from "@/lib/getSiteContent";
import PosEaseClient from "./PosEaseClient";

export const metadata: Metadata = {
  title: "PosEase",
  description: "Ultra-modern cloud POS for retail and hospitality.",
};

export default async function PosEasePage() {
  // Fetch both languages to handle client-side switching if needed, 
  // or just fetch one and let the client handle switching by re-fetching.
  // For simplicity, we fetch the default (mn) and let the client handle the rest.
  
  const initialSectionsMn = await getPosEaseSections("mn", "posease");
  const initialSectionsEn = await getPosEaseSections("en", "posease");

  return (
    <PosEaseClient 
      initialMn={initialSectionsMn} 
      initialEn={initialSectionsEn} 
    />
  );
}
