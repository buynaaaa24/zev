import Services from "@/components/Services";

export default async function ServicesPage({ params }: { params: Promise<{ siteId: string }> }) {
  await params;
  return <Services />;
}
