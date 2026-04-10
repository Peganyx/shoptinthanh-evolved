export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, email, phone, address, district, note, paymentMethod, items } = body;

    if (!customerName || !phone || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        email: email || null,
        phone,
        address,
        district: district || null,
        note: note || null,
        total: BigInt(Math.round(total)),
        paymentMethod: paymentMethod || "cod",
        items: {
          create: items.map((item: { productId: number; variantSku: string; size: string; quantity: number; price: number }) => ({
            productId: item.productId,
            variantSku: item.variantSku,
            size: item.size,
            quantity: item.quantity,
            price: BigInt(Math.round(item.price)),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id, total: Number(order.total) }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/orders - List orders (admin only)
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(serializeBigInt(orders));
}
