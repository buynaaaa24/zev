import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLanguageServer } from "@/lib/i18n-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zevtabs — Premium Digital Solutions",
  description:
    "Zevtabs delivers cutting-edge digital solutions with an uncompromising commitment to design, performance, and user experience.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = await getLanguageServer();
  return (
    <html lang={lang} className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-neutral-0 text-neutral-800">
        {children}
      </body>
    </html>
  )
}
