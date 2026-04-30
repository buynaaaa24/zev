import type { Metadata } from "next";
import { AmarHomeLangProvider } from "@/contexts/AmarHomeLangContext";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "AmarHome",
  description: "Modern, premium, high-end residential solutions.",
  icons: {
    icon: "/amarhome-logo.jpg",
  },
};

export default function AmarHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmarHomeLangProvider>
      <SmoothScroll>
        <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-[#064e3b] selection:text-white">
          {children}
        </div>
      </SmoothScroll>
    </AmarHomeLangProvider>
  );
}
