import { Metadata } from "next";
import { getAmarHomeSections, getGlobalContact } from "@/lib/getSiteContent";
import AmarHomeClient from "./AmarHomeClient";

export const metadata: Metadata = {
  title: "AmarHome",
  description: "Experience the pinnacle of modern luxury living with AmarHome.",
  icons: { icon: "/amarhome-logo.jpg", apple: "/amarhome-logo.jpg" },
};

export default async function AmarHomePage() {
  const [initialSectionsMn, globalContact] = await Promise.all([
    getAmarHomeSections("mn", "amarhome"),
    getGlobalContact(),
  ]);

  return (
    <AmarHomeClient
      data={initialSectionsMn}
      globalContact={globalContact}
    />
  );
}
