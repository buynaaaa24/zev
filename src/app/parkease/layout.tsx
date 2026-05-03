import type { Metadata } from "next";
import { ParkEaseLangProvider } from "@/contexts/ParkEaseLangContext";
import ParkEaseNavbar from "@/components/parkease/ParkEaseNavbar";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "ParkEase – Smart Automated Parking",
  description:
    "ParkEase is a 24/7 automated parking system with no staff required. Supports all Mongolian banks, QPay, and sticker QR payments. Free driver registration.",
};

export default function ParkEaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ParkEaseLangProvider>
      <SmoothScroll>
        <ParkEaseNavbar />
        {children}
      </SmoothScroll>
    </ParkEaseLangProvider>
  );
}
