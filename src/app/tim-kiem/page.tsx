"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ListingPage } from "@/components/storefront";

function SearchContent() {
  const searchParams = useSearchParams();
  return (
    <ListingPage
      department={searchParams.get("department") || undefined}
      subcategory={searchParams.get("subcategory") || undefined}
      search={searchParams.get("search") || undefined}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
