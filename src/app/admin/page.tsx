"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  department: string;
  price: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  images: string[];
  variants: { id: number; label: string; sku: string }[];
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  size: string;
  variantSku: string;
  product: { name: string };
}

interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  note?: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-secret": secret } });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setAuthed(true);
        localStorage.setItem("admin_secret", secret);

        // Also fetch products
        const pRes = await fetch("/api/products");
        if (pRes.ok) setProducts(await pRes.json());
      } else {
        alert("Sai mật khẩu admin");
      }
    } catch {
      alert("Lỗi kết nối");
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin_secret");
    if (saved) {
      setSecret(saved);
    }
  }, []);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">🔐 Admin Panel</h1>
          <p className="mb-4 text-sm text-gray-500">Nhập mật khẩu admin để truy cập</p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Admin secret..."
            className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={login}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">🛍️ Shop Tín Thành Admin</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("orders")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "orders" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Đơn hàng ({orders.length})
            </button>
            <button
              onClick={() => setTab("products")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "products" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Sản phẩm ({products.length})
            </button>
            <Link href="/" className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200">
              ← Về shop
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === "orders" && (
          <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">#{order.id}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{order.customerName} • {order.phone}</p>
                        <p className="text-sm text-gray-500">{order.address}</p>
                        {order.note && <p className="mt-1 text-sm text-amber-600">📝 {order.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{order.total.toLocaleString("vi-VN")} ₫</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                        <p className="text-xs text-gray-400">{order.paymentMethod === "cod" ? "COD" : order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="pb-2">Sản phẩm</th>
                            <th className="pb-2">SKU</th>
                            <th className="pb-2">Size</th>
                            <th className="pb-2 text-right">SL</th>
                            <th className="pb-2 text-right">Giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="py-2">{item.product.name}</td>
                              <td className="py-2 text-gray-500">{item.variantSku}</td>
                              <td className="py-2">{item.size}</td>
                              <td className="py-2 text-right">{item.quantity}</td>
                              <td className="py-2 text-right">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "products" && (
          <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Sản phẩm</h2>
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-gray-500">Ảnh</th>
                    <th className="px-6 py-3 text-gray-500">Tên</th>
                    <th className="px-6 py-3 text-gray-500">Thương hiệu</th>
                    <th className="px-6 py-3 text-gray-500">Giá</th>
                    <th className="px-6 py-3 text-gray-500">Tags</th>
                    <th className="px-6 py-3 text-gray-500">Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">
                        {p.images[0] && (
                          <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-3 text-gray-600">{p.brand}</td>
                      <td className="px-6 py-3 text-red-600 font-semibold">{p.price.toLocaleString("vi-VN")} ₫</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Nổi bật</span>}
                          {p.bestSeller && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Bán chạy</span>}
                          {p.isNew && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Mới</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{p.variants.length} màu</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
