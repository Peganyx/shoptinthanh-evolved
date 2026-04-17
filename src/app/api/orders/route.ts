export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

type IncomingOrderItem = {
  productId: number;
  variantSku: string;
  size: string;
  quantity: number;
};

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function parseItems(value: unknown): IncomingOrderItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    return null;
  }

  const parsed: IncomingOrderItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") {
      return null;
    }

    const item = raw as Record<string, unknown>;
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const variantSku = normalizeText(item.variantSku, 120);
    const size = normalizeText(item.size, 20);

    if (!Number.isInteger(productId) || productId <= 0) {
      return null;
    }
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
      return null;
    }
    if (!variantSku || !size) {
      return null;
    }

    parsed.push({
      productId,
      quantity,
      variantSku,
      size,
    });
  }

  return parsed;
}

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const customerName = normalizeText(body.customerName, 120);
    const phone = normalizeText(body.phone, 30);
    const address = normalizeText(body.address, 250);
    const email = normalizeText(body.email, 120);
    const district = normalizeText(body.district, 120);
    const note = normalizeText(body.note, 500);
    const paymentMethod = normalizeText(body.paymentMethod, 32);
    const items = parseItems(body.items);

    if (!customerName || !phone || !address || !items) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        inStock: true,
      },
      select: {
        id: true,
        price: true,
        sizes: true,
        variants: {
          select: { sku: true },
        },
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    let total = 0n;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (!product.sizes.includes(item.size)) {
        throw new Error("INVALID_SIZE");
      }

      const hasVariant = product.variants.some((variant) => variant.sku === item.variantSku);
      if (!hasVariant) {
        throw new Error("INVALID_VARIANT");
      }

      total += product.price * BigInt(item.quantity);
      return {
        productId: item.productId,
        variantSku: item.variantSku,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      };
    });

    if (total <= 0n) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        email: email || null,
        phone,
        address,
        district: district || null,
        note: note || null,
        total,
        paymentMethod: paymentMethod || "cod",
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id, total: Number(order.total) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (["PRODUCT_NOT_FOUND", "INVALID_SIZE", "INVALID_VARIANT"].includes(message)) {
      return NextResponse.json({ error: "Order items are invalid" }, { status: 400 });
    }

    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/orders - List orders (admin only)
export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(serializeBigInt(orders));
}
