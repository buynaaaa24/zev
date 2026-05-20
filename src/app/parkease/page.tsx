import { Metadata } from "next";
import { getParkEaseSections } from "@/lib/getSiteContent";
import ParkEaseClient from "./ParkEaseClient";

export const metadata: Metadata = {
  title: "ParkEase — Automated Parking System",
  description: "ParkEase runs your parking lot around the clock without a single employee.",
};

export default async function ParkEasePage() {
  const [initialMn, initialEn] = await Promise.all([
    getParkEaseSections("mn", "parkease"),
    getParkEaseSections("en", "parkease"),
  ]);

  return <ParkEaseClient initialMn={initialMn} initialEn={initialEn} />;
}
