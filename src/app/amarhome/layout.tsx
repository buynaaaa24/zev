import type { Metadata } from "next";
import { AmarHomeLangProvider } from "@/contexts/AmarHomeLangContext";
import AmarHomeNavbar from "@/components/amarhome/AmarHomeNavbar";
import SmoothScroll from "@/components/SmoothScroll";
import FooterWithContent from "@/components/FooterWithContent";

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
        <AmarHomeNavbar />
        <div className="overflow-x-hidden">
          {children}
        </div>
        <FooterWithContent siteId="amarhome" />
      </SmoothScroll>
    </AmarHomeLangProvider>
  );
}

