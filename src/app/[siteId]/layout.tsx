import { Suspense } from "react";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import FooterWithContent from "@/components/FooterWithContent";
import PageWrapper from "@/components/PageWrapper";
import ChatBotLoader from "@/components/ChatBotLoader";

function FooterFallback() {
  return (
    <footer
      className="min-h-[12rem] border-t border-neutral-100 bg-neutral-50"
      aria-hidden
    />
  );
}

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}>) {
  const { siteId } = await params;
  
  return (
    <Providers>
      <Navbar siteId={siteId} />
      <PageWrapper>
        <main className="flex-1">{children}</main>
      </PageWrapper>
      <Suspense fallback={<FooterFallback />}>
        <FooterWithContent siteId={siteId} />
      </Suspense>
      <ChatBotLoader />
    </Providers>
  );
}
