"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrderCount: number;
  dailyChart: { date: string; orders: number; revenue: number }[];
};

const fmt = (n: number) => n.toLocaleString("vi-VN") + " ₫";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "orders" | "products">("dashboard");
  const [orders, setOrders] = useState<AnyObj[]>([]);
  const [products, setProducts] = useState<AnyObj[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AnyObj | null>(null);
  const [orderFilter, setOrderFilter] = useState("all");

  const getSecret = useCallback(() => {
    return secret || (typeof window !== "undefined" ? localStorage.getItem("admin-secret") || "" : "");
  }, [secret]);

  const fetchData = useCallback(async () => {
    const s = getSecret();
    const headers = { "x-admin-secret": s };

    const [ordersRes, productsRes, statsRes] = await Promise.all([
      fetch("/api/orders", { headers }),
      fetch("/api/products"),
      fetch("/api/admin/orders", { headers }),
    ]);

    if (ordersRes.ok) setOrders(await ordersRes.json());
    if (productsRes.ok) setProducts(await productsRes.json());
    if (statsRes.ok) setStats(await statsRes.json());
  }, [getSecret]);

  async function login() {
    setLoading(true);
    const res = await fetch("/api/orders", { headers: { "x-admin-secret": secret } });
    if (res.ok) {
      localStorage.setItem("admin-secret", secret);
      setAuthed(true);
      fetchData();
    } else {
      alert("Sai mật khẩu admin");
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin-secret");
    if (saved) {
      setSecret(saved);
      fetch("/api/orders", { headers: { "x-admin-secret": saved } }).then((res) => {
        if (res.ok) {
          setAuthed(true);
          setSecret(saved);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  // ===== Order Status Update =====
  async function updateOrderStatus(orderId: number, status: string) {
    const s = getSecret();
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": s },
      body: JSON.stringify({ id: orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  }

  // ===== Product CRUD =====
  async function saveProduct(formData: AnyObj) {
    const s = getSecret();
    const method = formData.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-secret": s },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      await fetchData();
      setShowProductForm(false);
      setEditingProduct(null);
    } else {
      const err = await res.json();
      alert(err.error || "Lỗi lưu sản phẩm");
    }
  }

  async function deleteProduct(id: number, name: string) {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    const s = getSecret();
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": s },
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const s = getSecret();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-secret": s },
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    return null;
  }

  // ===== Login Screen =====
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mb-2 text-4xl">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-500">Nhập mật khẩu để truy cập</p>
          </div>
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
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  // ===== Main Admin Layout =====
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <h1 className="text-lg font-bold text-gray-900">Shop Tín Thành Admin</h1>
          </div>
          <div className="flex gap-1">
            {(["dashboard", "orders", "products"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t === "dashboard" ? "📊 Tổng quan" : t === "orders" ? `📦 Đơn (${orders.length})` : `👟 SP (${products.length})`}
              </button>
            ))}
            <Link href="/" className="ml-2 rounded-lg border px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
              ← Shop
            </Link>
            <button
              onClick={() => { localStorage.removeItem("admin-secret"); setAuthed(false); }}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ===== DASHBOARD ===== */}
        {tab === "dashboard" && stats && (
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Doanh thu hôm nay" value={fmt(stats.todayRevenue)} icon="💰" color="green" />
              <StatCard label="Doanh thu tuần" value={fmt(stats.weekRevenue)} icon="📈" color="blue" />
              <StatCard label="Doanh thu tháng" value={fmt(stats.monthRevenue)} icon="🌟" color="purple" />
              <StatCard label="Đơn chờ xử lý" value={String(stats.pendingOrders)} icon="⏳" color="yellow" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MiniStat label="Tổng đơn hàng" value={stats.totalOrders} />
              <MiniStat label="Đơn hôm nay" value={stats.todayOrderCount} />
              <MiniStat label="Sản phẩm" value={stats.totalProducts} />
            </div>

            {/* Simple bar chart */}
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Đơn hàng 7 ngày gần nhất</h3>
              <div className="flex items-end gap-2" style={{ height: 180 }}>
                {stats.dailyChart.map((d) => {
                  const maxOrders = Math.max(...stats.dailyChart.map((x) => x.orders), 1);
                  const h = (d.orders / maxOrders) * 150;
                  return (
                    <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">{d.orders}</span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                        style={{ height: Math.max(h, 4) }}
                      />
                      <span className="text-[10px] text-gray-400">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {tab === "orders" && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {["all", ...statusFlow, "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setOrderFilter(s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    orderFilter === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s === "all" ? `Tất cả (${orders.length})` : `${statusLabels[s]} (${orders.filter((o) => o.status === s).length})`}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <p className="py-12 text-center text-gray-400">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">#{order.id}</span>
                          <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">{order.customerName} • {order.phone}</p>
                        <p className="text-sm text-gray-500">{order.address}</p>
                        {order.email && <p className="text-sm text-gray-400">✉ {order.email}</p>}
                        {order.note && <p className="mt-1 text-sm text-amber-600">📝 {order.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{fmt(order.total)}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                        <p className="text-xs text-gray-400">{order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}</p>
                        {/* Status dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="mt-2 rounded-lg border border-gray-200 px-2 py-1 text-xs"
                        >
                          {[...statusFlow, "cancelled"].map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Order items */}
                    <div className="border-t px-5 py-3">
                      <div className="space-y-1">
                        {order.items?.map((item: AnyObj) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.product?.name || "SP"} • {item.size} • x{item.quantity}</span>
                            <span className="font-medium">{fmt(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {tab === "products" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sản phẩm ({products.length})</h2>
              <button
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Thêm sản phẩm
              </button>
            </div>

            {showProductForm && (
              <ProductForm
                product={editingProduct}
                onSave={saveProduct}
                onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
                onUpload={uploadImage}
              />
            )}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-gray-500">Ảnh</th>
                    <th className="px-4 py-3 text-gray-500">Tên</th>
                    <th className="px-4 py-3 text-gray-500">Thương hiệu</th>
                    <th className="px-4 py-3 text-gray-500">Giá</th>
                    <th className="px-4 py-3 text-gray-500">Tags</th>
                    <th className="px-4 py-3 text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-red-600">{fmt(p.price)}</span>
                        {p.compareAtPrice && (
                          <span className="ml-1 text-xs text-gray-400 line-through">{fmt(p.compareAtPrice)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Nổi bật</span>}
                          {p.bestSeller && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Bán chạy</span>}
                          {p.isNew && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Mới</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                            className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id, p.name)}
                            className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
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

// ===== Sub-components =====

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colors: Record<string, string> = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-amber-500 to-orange-500",
  };
  return (
    <div className={`rounded-xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
  onUpload,
}: {
  product: AnyObj | null;
  onSave: (data: AnyObj) => void;
  onCancel: () => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [form, setForm] = useState<AnyObj>(() => ({
    id: product?.id || null,
    name: product?.name || "",
    brand: product?.brand || "",
    department: product?.department || "nam",
    subcategory: product?.subcategory || "giay",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    description: product?.description || "",
    sizes: product?.sizes?.join(", ") || "",
    images: product?.images || [],
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    isNew: product?.isNew || false,
    tags: product?.tags?.join(", ") || "",
    variants: product?.variants || [{ label: "", colorCode: "#000000", sku: "" }],
  }));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(key: string, value: unknown) {
    setForm((prev: AnyObj) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const urls: string[] = [...form.images];
    for (const file of Array.from(files)) {
      const url = await onUpload(file);
      if (url) urls.push(url);
    }
    update("images", urls);
    setUploading(false);
  }

  function removeImage(idx: number) {
    update("images", form.images.filter((_: string, i: number) => i !== idx));
  }

  function updateVariant(idx: number, key: string, value: string) {
    const v = [...form.variants];
    v[idx] = { ...v[idx], [key]: value };
    setForm((prev: AnyObj) => ({ ...prev, variants: v }));
  }

  function addVariant() {
    setForm((prev: AnyObj) => ({ ...prev, variants: [...prev.variants, { label: "", colorCode: "#000000", sku: "" }] }));
  }

  function removeVariant(idx: number) {
    setForm((prev: AnyObj) => ({ ...prev, variants: prev.variants.filter((_: AnyObj, i: number) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      sizes: form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
    };
    await onSave(payload);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Thương hiệu *</label>
          <input value={form.brand} onChange={(e) => update("brand", e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Giá (VND) *</label>
          <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Giá gốc (nếu giảm)</label>
          <input type="number" value={form.compareAtPrice} onChange={(e) => update("compareAtPrice", e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Danh mục</label>
          <select value={form.department} onChange={(e) => update("department", e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
            <option value="phu-kien">Phụ kiện</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Loại</label>
          <select value={form.subcategory} onChange={(e) => update("subcategory", e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="giay">Giày</option>
            <option value="ao">Áo</option>
            <option value="quan">Quần</option>
            <option value="phu-kien">Phụ kiện</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Sizes (cách nhau bằng dấu phẩy)</label>
          <input value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="38, 39, 40, 41, 42" className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Tags (cách nhau bằng dấu phẩy)</label>
          <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="giay, nike, nam" className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="mt-4 flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="rounded" />
          Nổi bật
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.bestSeller} onChange={(e) => update("bestSeller", e.target.checked)} className="rounded" />
          Bán chạy
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} className="rounded" />
          Mới
        </label>
      </div>

      {/* Images */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Hình ảnh</label>
        <div className="flex flex-wrap gap-3">
          {form.images.map((url: string, i: number) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500">
            {uploading ? "..." : "+"}
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
        <div className="mt-2">
          <input
            placeholder="Hoặc dán URL ảnh (Enter để thêm)"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = (e.target as HTMLInputElement).value.trim();
                if (url) {
                  update("images", [...form.images, url]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
        </div>
      </div>

      {/* Variants */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Biến thể màu</label>
        {form.variants.map((v: AnyObj, i: number) => (
          <div key={i} className="mb-2 flex items-center gap-2">
            <input
              value={v.label}
              onChange={(e) => updateVariant(i, "label", e.target.value)}
              placeholder="Tên màu"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <input
              type="color"
              value={v.colorCode}
              onChange={(e) => updateVariant(i, "colorCode", e.target.value)}
              className="h-9 w-12 rounded border"
            />
            <input
              value={v.sku}
              onChange={(e) => updateVariant(i, "sku", e.target.value)}
              placeholder="SKU"
              className="w-32 rounded-lg border px-3 py-2 text-sm"
            />
            {form.variants.length > 1 && (
              <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addVariant} className="mt-1 text-sm text-blue-600 hover:text-blue-800">
          + Thêm màu
        </button>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : product ? "Cập nhật" : "Tạo sản phẩm"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border px-6 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Hủy
        </button>
      </div>
    </form>
  );
}
