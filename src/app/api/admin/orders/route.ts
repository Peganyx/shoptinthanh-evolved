export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function checkAuth(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return false;
  }
  return true;
}

// PATCH /api/admin/orders - Update order status
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/admin/orders - Dashboard stats
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, pendingOrders, todayOrders, weekOrders, monthOrders, totalProducts, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.findMany({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.findMany({ where: { createdAt: { gte: weekStart } } }),
      prisma.order.findMany({ where: { createdAt: { gte: monthStart } } }),
      prisma.product.count(),
      prisma.order.findMany({
        where: { createdAt: { gte: weekStart } },
        select: { createdAt: true, total: true, status: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const todayRevenue = todayOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const weekRevenue = weekOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const monthRevenue = monthOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    // Group orders by day for chart
    const dailyData: Record<string, { orders: number; revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailyData[key] = { orders: 0, revenue: 0 };
    }
    for (const order of allOrders) {
      const key = order.createdAt.toISOString().split("T")[0];
      if (dailyData[key]) {
        dailyData[key].orders++;
        if (order.status !== "cancelled") {
          dailyData[key].revenue += order.total;
        }
      }
    }

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      todayOrderCount: todayOrders.length,
      dailyChart: Object.entries(dailyData).map(([date, data]) => ({
        date,
        ...data,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
