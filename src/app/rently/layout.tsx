import type { Metadata } from "next";
import { RentlyLangProvider } from "@/contexts/RentlyLangContext";
import RentlyNavbar from "@/components/rently/RentlyNavbar";
import SmoothScroll from "@/components/SmoothScroll";
import FooterWithContent from "@/components/FooterWithContent";

export const metadata: Metadata = {
  title: "Rently",
  description: "Түрээсийн удирдлагын цогц систем.",
};

export default function RentlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RentlyLangProvider>
      <SmoothScroll>
        <RentlyNavbar />
        <div className="overflow-x-hidden">
          {children}
        </div>
        <FooterWithContent siteId="rently" />
      </SmoothScroll>
    </RentlyLangProvider>
  );
}

