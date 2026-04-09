import { CATEGORIES } from "@/lib/store-data";
import { ListingPage } from "@/components/storefront";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <ListingPage department={slug} />; }

export function generateStaticParams() {
  return CATEGORIES.map((item: any) => ({ slug: item.slug }));
}
