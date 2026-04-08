import { ListingPage } from "@/components/storefront";
export default async function Page({ searchParams }: { searchParams: Promise<{ department?: string; subcategory?: string; search?: string }> }) { const params = await searchParams; return <ListingPage department={params.department} subcategory={params.subcategory} search={params.search} />; }
