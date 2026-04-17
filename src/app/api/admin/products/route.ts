export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "product";
}

async function makeUniqueSlug(baseSlug: string, excludeId?: number) {
  let candidate = baseSlug;
  let index = 2;

  while (true) {
    const exists = await prisma.product.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function toPositiveBigInt(value: unknown) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return null;
  }
  return BigInt(Math.round(numberValue));
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

function buildVariants(rawVariants: unknown, slug: string) {
  const variants = Array.isArray(rawVariants) ? rawVariants : [];
  const seen = new Set<string>();

  return variants
    .map((raw, idx) => {
      const variant = (raw || {}) as Record<string, unknown>;
      const label = text(variant.label, "Default") || "Default";
      const colorCode = /^#[0-9a-fA-F]{6}$/.test(text(variant.colorCode)) ? text(variant.colorCode) : "#000000";
      let sku = text(variant.sku, "");

      if (!sku || seen.has(sku)) {
        sku = `${slug}-v${idx + 1}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      seen.add(sku);
      return { label, colorCode, sku };
    })
    .filter((variant) => Boolean(variant.sku));
}

// POST /api/admin/products - Create product
export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;

    const name = text(body.name);
    const brand = text(body.brand);
    const price = toPositiveBigInt(body.price);

    if (!name || !brand || price === null) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    let compareAtPrice: bigint | null = null;
    if (!isEmpty(body.compareAtPrice)) {
      compareAtPrice = toPositiveBigInt(body.compareAtPrice);
      if (compareAtPrice === null) {
        return NextResponse.json({ error: "Invalid compareAtPrice" }, { status: 400 });
      }
    }

    const baseSlug = slugify(name);
    const finalSlug = await makeUniqueSlug(baseSlug);
    const variants = buildVariants(body.variants, finalSlug);

    const product = await prisma.product.create({
      data: {
        slug: finalSlug,
        name,
        brand,
        department: text(body.department, "nam") || "nam",
        subcategory: text(body.subcategory, "giay") || "giay",
        price,
        compareAtPrice,
        description: text(body.description),
        sizes: stringArray(body.sizes),
        images: stringArray(body.images),
        featured: bool(body.featured),
        bestSeller: bool(body.bestSeller),
        isNew: bool(body.isNew),
        tags: stringArray(body.tags),
        variants: variants.length
          ? {
              create: variants,
            }
          : undefined,
      },
      include: { variants: true },
    });

    return NextResponse.json(serializeBigInt(product), { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/products - Update product
export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const id = Number(body.id);
    const newVariants = body.variants;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = text(body.name);
      if (!name) {
        return NextResponse.json({ error: "Invalid product name" }, { status: 400 });
      }
      updateData.name = name;
      updateData.slug = await makeUniqueSlug(slugify(name), id);
    }

    if (body.brand !== undefined) updateData.brand = text(body.brand);
    if (body.department !== undefined) updateData.department = text(body.department, "nam") || "nam";
    if (body.subcategory !== undefined) updateData.subcategory = text(body.subcategory, "giay") || "giay";

    if (body.price !== undefined) {
      const price = toPositiveBigInt(body.price);
      if (price === null) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      updateData.price = price;
    }

    if (body.compareAtPrice !== undefined) {
      if (isEmpty(body.compareAtPrice)) {
        updateData.compareAtPrice = null;
      } else {
        const compareAtPrice = toPositiveBigInt(body.compareAtPrice);
        if (compareAtPrice === null) {
          return NextResponse.json({ error: "Invalid compareAtPrice" }, { status: 400 });
        }
        updateData.compareAtPrice = compareAtPrice;
      }
    }

    if (body.description !== undefined) updateData.description = text(body.description);
    if (body.sizes !== undefined) updateData.sizes = stringArray(body.sizes);
    if (body.images !== undefined) updateData.images = stringArray(body.images);
    if (body.featured !== undefined) updateData.featured = bool(body.featured);
    if (body.bestSeller !== undefined) updateData.bestSeller = bool(body.bestSeller);
    if (body.isNew !== undefined) updateData.isNew = bool(body.isNew);
    if (body.tags !== undefined) updateData.tags = stringArray(body.tags);
    if (body.inStock !== undefined) updateData.inStock = bool(body.inStock, true);

    const updated = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: updateData,
        include: { variants: true },
      });

      if (Array.isArray(newVariants)) {
        await tx.productVariant.deleteMany({ where: { productId: id } });

        const variantData = buildVariants(newVariants, product.slug);
        if (variantData.length > 0) {
          await tx.productVariant.createMany({
            data: variantData.map((variant) => ({
              productId: id,
              ...variant,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { variants: true },
      });
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/products - Delete product
export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
