import { Metadata } from "next";
import { getAmarHomeSections } from "@/lib/getSiteContent";
import AmarHomeClient from "./AmarHomeClient";

export const metadata: Metadata = {
  title: "AmarHome",
  description: "Experience the pinnacle of modern luxury living with AmarHome.",
};

export default async function AmarHomePage() {
  const initialSectionsMn = await getAmarHomeSections("mn", "amarhome");
  
  return (
    <AmarHomeClient 
      data={initialSectionsMn} 
    />
  );
}
