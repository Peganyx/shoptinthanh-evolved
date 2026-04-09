import { PRODUCTS } from "@/lib/store-data";
import { ProductPage } from "@/components/storefront";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <ProductPage slug={slug} />; }

export function generateStaticParams() {
  return PRODUCTS.map((item: any) => ({ slug: item.slug }));
}
