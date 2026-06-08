import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { getLanguageServer } from "@/lib/i18n-server";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zevtabs",
  description:
    "Zevtabs delivers cutting-edge digital solutions with an uncompromising commitment to design, performance, and user experience.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = await getLanguageServer();
  return (
    <html lang={lang} className={cn("h-full", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-neutral-0 text-neutral-800">
        {children}
      </body>
    </html>
  )
}
