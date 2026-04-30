import type { Metadata } from "next";
import { PosEaseLangProvider } from "@/contexts/PosEaseLangContext";
import PosEaseNavbar from "@/components/posease/PosEaseNavbar";

export const metadata: Metadata = {
  title: "PosEase",
  description:
    "PosEase is a modern, cloud-based POS system for retail and hospitality. Manage inventory, sales, and payments seamlessly across all your devices.",
};

export default function PosEaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PosEaseLangProvider>
      <PosEaseNavbar />
      {children}
    </PosEaseLangProvider>
  );
}
