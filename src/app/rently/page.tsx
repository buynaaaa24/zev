import { Metadata } from "next";
import { getRentlySections, getGlobalContact } from "@/lib/getSiteContent";
import RentlyClient from "./RentlyClient";

export const metadata: Metadata = {
  title: "Rently",
  description: "Түрээсийн удирдлагын цогц систем",
  icons: { icon: "/images/rently.png", apple: "/images/rently.png" },
};

export default async function RentlyPage() {
  const [initialSectionsMn, globalContact] = await Promise.all([
    getRentlySections("mn", "rently"),
    getGlobalContact(),
  ]);

  return (
    <RentlyClient
      initialData={initialSectionsMn}
      globalContact={globalContact}
    />
  );
}
