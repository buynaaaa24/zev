import About from "@/components/About";

export default async function AboutPage({ params }: { params: Promise<{ siteId: string }> }) {
  // siteId available for future CMS-driven content per site
  await params;
  return <About />;
}
