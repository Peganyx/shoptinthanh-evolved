export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products - List products with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const subcategory = searchParams.get("subcategory");
  const featured = searchParams.get("featured");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = {};

  if (department) where.department = department;
  if (subcategory) where.subcategory = subcategory;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
