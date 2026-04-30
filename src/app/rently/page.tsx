import { Metadata } from "next";
import { getRentlySections } from "@/lib/getSiteContent";
import RentlyClient from "./RentlyClient";

export const metadata: Metadata = {
  title: "Rently",
  description: "Түрээсийн удирдлагын цогц систем",
};

export default async function RentlyPage() {
  const initialSectionsMn = await getRentlySections("mn", "rently");
  
  return (
    <RentlyClient 
      initialData={initialSectionsMn} 
    />
  );
}
