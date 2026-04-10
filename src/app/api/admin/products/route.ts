export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

function checkAuth(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return false;
  }
  return true;
}



// POST /api/admin/products - Create product
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name, brand, department, subcategory, price, compareAtPrice,
      description, sizes, images, featured, bestSeller, isNew, tags, variants,
    } = body;

    if (!name || !brand || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate price is a valid number
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: "Giá phải là số dương hợp lệ" }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check slug collision
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? slug + "-" + Date.now() : slug;

    // Filter out empty variants
    const validVariants = (variants || [])
      .filter((v: { label: string }) => v.label && v.label.trim())
      .map((v: { label: string; colorCode: string; sku: string }, i: number) => ({
        label: v.label.trim(),
        colorCode: v.colorCode || "#000000",
        sku: v.sku?.trim() || (finalSlug + "-v" + (i + 1) + "-" + Date.now()),
      }));

    const product = await prisma.product.create({
      data: {
        slug: finalSlug,
        name,
        brand,
        department: department || "nam",
        subcategory: subcategory || "giay",
        price: BigInt(Math.round(priceNum)),
        compareAtPrice: compareAtPrice ? BigInt(Math.round(Number(compareAtPrice))) : null,
        description: description || "",
        sizes: sizes || [],
        images: images || [],
        featured: featured || false,
        bestSeller: bestSeller || false,
        isNew: isNew || false,
        tags: tags || [],
        variants: validVariants.length > 0 ? {
          create: validVariants,
        } : undefined,
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, variants: newVariants, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Update product fields
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.subcategory !== undefined) updateData.subcategory = data.subcategory;
    if (data.price !== undefined) updateData.price = BigInt(Math.round(Number(data.price)));
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? BigInt(Math.round(Number(data.compareAtPrice))) : null;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sizes !== undefined) updateData.sizes = data.sizes;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.bestSeller !== undefined) updateData.bestSeller = data.bestSeller;
    if (data.isNew !== undefined) updateData.isNew = data.isNew;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.inStock !== undefined) updateData.inStock = data.inStock;

    // Re-generate slug if name changed
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
      include: { variants: true },
    });

    // If variants provided, replace them
    if (newVariants && Array.isArray(newVariants)) {
      const validVariants = newVariants.filter((v: { label: string }) => v.label && v.label.trim());
      await prisma.productVariant.deleteMany({ where: { productId: Number(id) } });
      for (let idx = 0; idx < validVariants.length; idx++) {
        const v = validVariants[idx];
        await prisma.productVariant.create({
          data: {
            productId: Number(id),
            label: v.label.trim(),
            colorCode: v.colorCode || "#000000",
            sku: v.sku?.trim() || (product.slug + "-v" + idx + "-" + Date.now()),
          },
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { variants: true },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/products - Delete product
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
