"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/store-data";

// Shape returned by /api/products (DB + BigInt serialized)
interface DbVariant {
  id: number;
  label: string;
  colorCode: string;
  sku: string;
}

interface DbProduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  department: string;
  subcategory: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  sizes: string[];
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  tags: string[];
  inStock: boolean;
  variants: DbVariant[];
}

/** Transform a DB product into the frontend Product shape */
function toProduct(db: DbProduct): Product {
  return {
    slug: db.slug,
    name: db.name,
    brand: db.brand,
    department: db.department as Product["department"],
    subcategory: db.subcategory,
    price: db.price,
    compareAtPrice: db.compareAtPrice ?? undefined,
    description: db.description,
    colors: db.variants.map((v) => ({
      label: v.label,
      code: v.colorCode,
      sku: v.sku,
    })),
    sizes: db.sizes,
    images: db.images,
    featured: db.featured,
    bestSeller: db.bestSeller,
    isNew: db.isNew,
    tags: db.tags,
  };
}

interface UseProductsParams {
  department?: string;
  subcategory?: string;
  search?: string;
  featured?: boolean;
}

/**
 * Fetch products from the API, falling back to static PRODUCTS on error.
 * Returns { products, loading, error }.
 */
export function useProducts(params?: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const department = params?.department;
  const subcategory = params?.subcategory;
  const search = params?.search;
  const featured = params?.featured;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const qp = new URLSearchParams();
        if (department) qp.set("department", department);
        if (subcategory) qp.set("subcategory", subcategory);
        if (search) qp.set("q", search);
        if (featured) qp.set("featured", "true");

        const qs = qp.toString();
        const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`);
        if (!res.ok) throw new Error(`API ${res.status}`);

        const data: DbProduct[] = await res.json();
        if (!cancelled) {
          setProducts(data.map(toProduct));
        }
      } catch (err) {
        if (!cancelled) {
          setError(String(err));
          // Fallback to static data (client-side filtering)
          let fallback = PRODUCTS;
          if (department) fallback = fallback.filter((p) => p.department === department);
          if (subcategory) fallback = fallback.filter((p) => p.subcategory === subcategory);
          if (search) {
            const q = search.toLowerCase();
            fallback = fallback.filter((p) =>
              [p.name, p.description, ...p.tags].join(" ").toLowerCase().includes(q),
            );
          }
          if (featured) fallback = fallback.filter((p) => p.featured);
          setProducts(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [department, subcategory, search, featured]);

  return { products, loading, error };
}

/**
 * Fetch a single product by slug from the API, with static fallback.
 */
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: DbProduct = await res.json();
        if (!cancelled) setProduct(toProduct(data));
      } catch {
        if (!cancelled) {
          // Fallback to static
          const found = PRODUCTS.find((p) => p.slug === slug) || null;
          setProduct(found);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading };
}

/**
 * Fetch all products (no filter) for cart/checkout lookups.
 * Caches in module-level variable to avoid refetch.
 */
let cachedAllProducts: Product[] | null = null;

export async function fetchAllProducts(): Promise<Product[]> {
  if (cachedAllProducts) return cachedAllProducts;

  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data: DbProduct[] = await res.json();
    cachedAllProducts = data.map(toProduct);
    return cachedAllProducts;
  } catch {
    return PRODUCTS; // fallback
  }
}

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
