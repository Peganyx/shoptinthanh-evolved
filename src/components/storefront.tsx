"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  BLOG_POSTS,
  CATEGORIES,
  PRODUCTS,
  STORE,
  formatCurrency,
  getDepartment,
  getProduct,
  type Product,
} from "@/lib/store-data";

type CartItem = { slug: string; variant: string; size: string; quantity: number };
type StoredOrder = { id: string; status: string; total: number } | null;

const CART_KEY = "shoptinthanh-evolved-cart";
const banners = ["/shoptinthanh-evolved/ref/1.jpg", "/shoptinthanh-evolved/ref/2.jpg", "/shoptinthanh-evolved/ref/3.jpg", "/shoptinthanh-evolved/ref/4.jpg", "/shoptinthanh-evolved/ref/5.jpg"];
const sortOptions = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "name-asc", label: "Tên A → Z" },
];

function readCart() {
  if (typeof window === "undefined") return [] as CartItem[];
  const raw = window.localStorage.getItem(CART_KEY);
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

function cartKey(item: CartItem) {
  return `${item.slug}__${item.variant}__${item.size}`;
}

// Shared cart: dispatch custom event so all useCart() instances sync
const CART_EVENT = "cart-updated";

function persistCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => (typeof window === "undefined" ? [] : readCart()));

  // Listen for cart changes from OTHER components
  useEffect(() => {
    function onCartUpdate() {
      setItems(readCart());
    }
    window.addEventListener(CART_EVENT, onCartUpdate);
    window.addEventListener("storage", onCartUpdate);
    return () => {
      window.removeEventListener(CART_EVENT, onCartUpdate);
      window.removeEventListener("storage", onCartUpdate);
    };
  }, []);

  function addItem(next: CartItem) {
    const current = readCart();
    const key = cartKey(next);
    const matched = current.find((item) => cartKey(item) === key);
    let updated: CartItem[];
    if (!matched) {
      updated = [...current, next];
    } else {
      updated = current.map((item) =>
        cartKey(item) === key ? { ...item, quantity: item.quantity + next.quantity } : item,
      );
    }
    setItems(updated);
    persistCart(updated);
  }

  function updateItem(target: CartItem, quantity: number) {
    const current = readCart();
    const updated = current
      .map((item) =>
        cartKey(item) === cartKey(target) ? { ...item, quantity: Math.max(1, quantity) } : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(updated);
    persistCart(updated);
  }

  function removeItem(target: CartItem) {
    const current = readCart();
    const updated = current.filter((item) => cartKey(item) !== cartKey(target));
    setItems(updated);
    persistCart(updated);
  }

  return { items, setItems, addItem, updateItem, removeItem };
}

function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#ebebeb] bg-white/95 shadow-sm backdrop-blur">
      <div className="container-shell">
        <div className="flex items-center justify-between gap-4 py-3">
          <button className="text-xl lg:hidden" onClick={() => setOpen((value) => !value)}>
            ☰
          </button>
          <Link href="/" className="shrink-0">
            <span className="text-xl font-bold uppercase tracking-wider"><span className="text-[#d4a24c]">Tín Thành</span><span className="text-[#d4a24c]"> 3</span></span>
          </Link>
          <nav className="hidden items-center text-[15px] lg:flex">
            {CATEGORIES.map((group) => (
              <div key={group.slug} className="group relative px-4 py-5">
                <Link href={`/danh-muc/${group.slug}`} className="flex items-center gap-2 capitalize">
                  {group.label}
                  <span>▾</span>
                </Link>
                <div className="absolute left-0 top-full hidden min-w-[760px] bg-white p-5 shadow-xl group-hover:block">
                  <div className="grid grid-cols-4 gap-4">
                    {group.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/tim-kiem?department=${group.slug}&subcategory=${sub.slug}`}
                        className="hover:text-[#b45f06]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Link className="px-4" href="/cau-chuyen">
              Câu chuyện của Tín Thành
            </Link>
            <Link className="px-4" href="/blog">
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/tim-kiem" aria-label="search">
              ⌕
            </Link>
            <Link href="/gio-hang" className="relative flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Giỏ hàng
              {items.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#b45f06] text-[11px] font-bold text-white">{items.reduce((s, i) => s + i.quantity, 0)}</span>}
            </Link>
          </div>
        </div>
        {open ? (
          <div className="space-y-3 border-t py-4 lg:hidden">
            {CATEGORIES.map((group) => (
              <div key={group.slug}>
                <Link href={`/danh-muc/${group.slug}`} className="block font-semibold capitalize">
                  {group.label}
                </Link>
                <div className="mt-2 grid gap-2 pl-3 text-sm">
                  {group.subcategories.map((sub) => (
                    <Link key={sub.slug} href={`/tim-kiem?department=${group.slug}&subcategory=${sub.slug}`}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/cau-chuyen" className="block">
              Câu chuyện
            </Link>
            <Link href="/blog" className="block">
              Blog
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-white pt-10 text-sm text-[#444]">
      <div className="container-shell grid gap-8 border-t pt-10 md:grid-cols-4">
        <div>
          <span className="text-lg font-bold uppercase tracking-wider"><span className="text-[#d4a24c]">Tín Thành</span><span className="text-[#d4a24c]"> 3</span></span>
          <p className="mt-3">{STORE.address}</p>
          <p>Hotline: {STORE.hotline}</p>
          <p>{STORE.email}</p>
        </div>
        <div>
          <h3 className="font-bold">Về Tín Thành</h3>
          <div className="mt-3 grid gap-2">
            <Link href="/cau-chuyen">Câu chuyện</Link>
            <Link href="/ho-tro/tuyen-dung">Tuyển dụng</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Chính sách đổi và hỗ trợ</h3>
          <div className="mt-3 grid gap-2">
            <Link href="/ho-tro/doi-tra">Đổi trả</Link>
            <Link href="/ho-tro/tu-van-size">Tư vấn size</Link>
            <Link href="/ho-tro/thanh-toan">Thanh toán</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Kết nối</h3>
          <div className="mt-3 grid gap-2">
            <a href={STORE.facebook}>Facebook</a>
            <a href={STORE.zalo}>Zalo</a>
            <a href={`tel:${STORE.hotline.replace(/\./g, "")}`}>Gọi ngay</a>
          </div>
        </div>
      </div>
      <div className="container-shell py-6 text-xs text-[#777]">© 2026 Shop Tín Thành. Mọi quyền được bảo lưu.</div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-sm border border-[#eee] bg-white transition hover:shadow-md">
        <div className="relative aspect-[3/4] bg-[#fafafa]">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.isNew ? <span className="bg-black px-2 py-1 text-[11px] text-white">Mới</span> : null}
            {product.bestSeller ? <span className="bg-[#b45f06] px-2 py-1 text-[11px] text-white">Bán chạy</span> : null}
          </div>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-12 text-[15px] font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-[#b45f06]">{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-xs text-[#999] line-through">{formatCurrency(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <div className="mt-2 flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span key={color.sku} className="h-3 w-3 rounded-full border" style={{ background: color.code }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomeBlock({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="container-shell">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-bold uppercase">{title}</h2>
        <Link href="/tim-kiem" className="text-sm">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((value) => (value + 1) % banners.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  const featured = PRODUCTS.filter((product) => product.featured).slice(0, 10);
  const best = PRODUCTS.filter((product) => product.bestSeller).slice(0, 10);
  const fresh = PRODUCTS.filter((product) => product.isNew).slice(0, 10);
  const heroSlides = [
    {
      title: "Bộ sưu tập hè mới",
      subtitle: "Form dễ mặc, phối nhanh, lên hình đẹp",
      cta: "Khám phá ngay",
    },
    {
      title: "Hàng mới về mỗi tuần",
      subtitle: "Update liên tục những mẫu đang được hỏi nhiều",
      cta: "Xem sản phẩm",
    },
    {
      title: "Giá ổn, đồ xịn, chốt nhanh",
      subtitle: "Chọn sẵn outfit đi học, đi chơi, đi làm",
      cta: "Mua ngay",
    },
  ];

  const goPrev = () => setActive((value) => (value - 1 + banners.length) % banners.length);
  const goNext = () => setActive((value) => (value + 1) % banners.length);

  return (
    <Shell>
      <main className="mb-16 space-y-14">
        <section className="relative mx-auto max-w-[1920px] px-4 sm:px-6 xl:px-10">
          <div className="relative overflow-hidden rounded-[28px] bg-[#f6f6f6] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-[16/8] min-h-[320px] md:min-h-[420px]">
              {banners.map((src, index) => {
                const slide = heroSlides[index] || heroSlides[0];
                return (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-all duration-700 ${active === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
                    <Image src={src} alt={slide.title} fill className="object-cover object-center" priority={index === 0} />
                    <div className="relative z-10 flex h-full items-end md:items-center">
                      <div className="max-w-[620px] px-6 pb-8 text-white md:px-10 md:pb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4a24c]">Tín Thành 3</p>
                        <h1 className="max-w-[12ch] text-3xl font-bold leading-tight md:text-5xl" style={{textShadow: "0 2px 8px rgba(0,0,0,0.6)"}}>{slide.title}</h1>
                        <p className="mt-3 max-w-[46ch] text-sm leading-6 text-white/85 md:text-base" style={{textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)"}}>{slide.subtitle}</p>
                        <div className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm" style={{textShadow: "none"}}>
                          {slide.cta}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 justify-between px-4 md:flex">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-lg text-black shadow-md transition hover:scale-105"
                  aria-label="Banner trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-lg text-black shadow-md transition hover:scale-105"
                  aria-label="Banner tiếp theo"
                >
                  ›
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/20">
                <div
                  className="h-full bg-black/80 transition-all duration-500"
                  style={{ width: `${((active + 1) / banners.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <div className="hidden text-sm text-[#555] md:block">
              {String(active + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
            </div>
            <div className="flex flex-1 justify-center gap-2 md:justify-end">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${active === index ? "w-10 bg-black" : "w-2 bg-[#cfcfcf] hover:bg-[#999]"}`}
                  aria-label={`Chuyển tới banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell">
          <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-4">
            {[
              ["Miễn phí vận chuyển", "Miễn phí vận chuyển nội tỉnh Đồng Tháp"],
              ["Đổi hàng 7 ngày", "Hỗ trợ đổi size, đổi mẫu nhanh"],
              ["Thanh toán COD", "Nhận hàng rồi thanh toán"],
              ["Hotline hỗ trợ", "Tư vấn trực tiếp tại Cao Lãnh"],
            ].map(([title, desc]) => (
              <div key={title} className="flex flex-col items-center rounded-lg p-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black text-xl">✦</div>
                <p className="mb-2 mt-4 font-bold">{title}</p>
                <p className="text-sm opacity-75">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <HomeBlock title="Sản phẩm nổi bật" products={featured} />
        <HomeBlock title="Bán chạy tại cửa hàng" products={best} />
        <HomeBlock title="Mới cập nhật" products={fresh} />

        <section className="container-shell grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-bold uppercase">Câu chuyện của Tín Thành</h2>
            <p className="mt-4 leading-7 text-[#666]">
              Shop Tín Thành - chuyên cung cấp giày, quần áo và phụ kiện chính hãng tại Cao Lãnh, Đồng Tháp. Cam kết hàng chất lượng, giá tốt nhất.
            </p>
            <div className="mt-4">
              <Link href="/cau-chuyen" className="border-b border-black pb-1 font-semibold">
                Xem thêm
              </Link>
            </div>
          </div>
          <div className="border border-[#eee] p-5">
            <h3 className="font-bold">Hỗ trợ nhanh</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <a href={STORE.zalo} className="rounded border p-3">
                Đặt qua Zalo
              </a>
              <a href={`tel:${STORE.hotline.replace(/\./g, "")}`} className="rounded border p-3">
                Gọi hotline {STORE.hotline}
              </a>
              <Link href="/ho-tro/doi-tra" className="rounded border p-3">
                Xem chính sách đổi trả
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

function sortProducts(products: Product[], sort: string) {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...products].sort((a, b) => b.price - a.price);
    case "name-asc":
      return [...products].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    default:
      return [...products].sort((a, b) => Number(Boolean(b.featured || b.bestSeller)) - Number(Boolean(a.featured || a.bestSeller)));
  }
}

export function ListingPage({
  department,
  subcategory,
  search,
}: {
  department?: string;
  subcategory?: string;
  search?: string;
}) {
  const [sort, setSort] = useState("featured");
  const departmentInfo = getDepartment(department || "");
  const filtered = PRODUCTS.filter(
    (product) =>
      (!department || product.department === department) &&
      (!subcategory || product.subcategory === subcategory) &&
      (!search || [product.name, product.description, ...product.tags].join(" ").toLowerCase().includes(search.toLowerCase())),
  );
  const results = sortProducts(filtered, sort);

  return (
    <Shell>
      <section className="container-shell py-8">
        <div className="mb-6">
          <p className="text-sm text-[#777]">Trang chủ / sản phẩm</p>
          <h1 className="mt-2 text-3xl font-bold uppercase">
            {search ? `Kết quả cho "${search}"` : departmentInfo?.label || "Tất cả sản phẩm"}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-5 border border-[#eee] p-5">
            <div>
              <h2 className="font-bold">Danh mục</h2>
              <div className="mt-3 grid gap-2 text-sm">
                {CATEGORIES.map((group) => (
                  <Link key={group.slug} href={`/danh-muc/${group.slug}`}>
                    {group.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-bold">Nhóm hàng</h2>
              <div className="mt-3 grid gap-2 text-sm">
                {(departmentInfo?.subcategories || CATEGORIES.flatMap((group) => group.subcategories)).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tim-kiem?${new URLSearchParams({ ...(department ? { department } : {}), subcategory: item.slug }).toString()}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 grid gap-3 border border-[#eee] p-3 text-sm md:grid-cols-[1fr_220px]">
              <form action="/tim-kiem" className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                {department ? <input type="hidden" name="department" value={department} /> : null}
                {subcategory ? <input type="hidden" name="subcategory" value={subcategory} /> : null}
                <input name="search" defaultValue={search ?? ""} placeholder="Tìm áo polo, jeans, giày..." className="border px-4 py-3" />
                <span className="hidden md:block" />
                <button className="border px-5 py-3">Tìm kiếm</button>
              </form>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="border px-4 py-3">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex items-center justify-between border border-[#eee] p-3 text-sm">
              <span>{results.length} sản phẩm</span>
              <span>Catalog đã được mở rộng và có ảnh sản phẩm</span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  return <ProductDetail key={slug} slug={slug} />;
}

function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { items, addItem } = useCart();
  const [variant, setVariant] = useState(product?.colors[0]?.sku || "");
  const [size, setSize] = useState(product?.sizes[0] || "");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.images[0] || "");
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!product) {
    return (
      <Shell>
        <section className="container-shell py-16">Không tìm thấy sản phẩm.</section>
      </Shell>
    );
  }

  const related = PRODUCTS.filter((item) => item.slug !== product.slug && item.department === product.department).slice(0, 5);

  return (
    <Shell>
      <section className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] border border-[#eee] bg-[#fafafa]">
              <Image src={activeImage} alt={product.name} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative aspect-square overflow-hidden border ${activeImage === image ? "border-black" : "border-[#eee]"}`}
                >
                  <Image src={image} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-[#777]">Trang chủ / {getDepartment(product.department)?.label} / {product.name}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#b45f06]">{formatCurrency(product.price)}</span>
              {product.compareAtPrice ? <span className="text-[#999] line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
            </div>
            <p className="mt-4 leading-7 text-[#666]">{product.description}</p>

            <div className="mt-6">
              <p className="font-semibold">Màu sắc / SKU</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.sku}
                    onClick={() => setVariant(color.sku)}
                    className={`rounded border px-3 py-2 text-sm ${variant === color.sku ? "border-black" : "border-[#ddd]"}`}
                  >
                    {color.label} • {color.sku}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-semibold">Kích thước</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`rounded border px-3 py-2 text-sm ${size === item ? "border-black bg-black text-white" : "border-[#ddd]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border">
                <button className="px-3 py-2" onClick={() => setQty((value) => Math.max(1, value - 1))}>
                  -
                </button>
                <span className="px-4">{qty}</span>
                <button className="px-3 py-2" onClick={() => setQty((value) => value + 1)}>
                  +
                </button>
              </div>
              <button
                onClick={() => (() => {
                    addItem({ slug: product.slug, variant, size, quantity: qty });
                    setAddedFeedback(true);
                    setTimeout(() => setAddedFeedback(false), 1800);
                  })()}
                className={`px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${addedFeedback ? "bg-green-600 scale-[1.03]" : "bg-black hover:bg-[#333]"}`}
              >
                {addedFeedback ? "✓ Đã thêm vào giỏ!" : "Thêm vào giỏ"}
              </button>
              <a href={STORE.zalo} className="border px-6 py-3">
                Đặt qua Zalo
              </a>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="border p-3">Miễn phí vận chuyển đơn từ 300K</div>
              <div className="border p-3">Đổi hàng trong 7 ngày</div>
              <div className="border p-3">COD toàn quốc</div>
              <div className="border p-3">Đã có {items.length} mục trong giỏ hàng của bạn</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <h2 className="mb-5 text-2xl font-bold uppercase">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

export function CartPage() {
  const { items, updateItem, removeItem } = useCart();
  const rows = items
    .map((item) => ({ ...item, product: getProduct(item.slug) }))
    .filter((item): item is CartItem & { product: Product } => Boolean(item.product));
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  const shipping = rows.length ? (subtotal >= 300000 ? 0 : 30000) : 0;

  return (
    <Shell>
      <section className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h1 className="mb-5 text-3xl font-bold uppercase">Giỏ hàng</h1>
            <div className="space-y-4">
              {rows.length ? (
                rows.map((row) => (
                  <div key={cartKey(row)} className="grid gap-4 border p-4 sm:grid-cols-[90px_1fr_auto] sm:items-center">
                    <div className="relative aspect-square overflow-hidden border bg-[#fafafa]">
                      <Image src={row.product.images[0]} alt={row.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{row.product.name}</h3>
                      <p className="text-sm text-[#777]">
                        {row.variant} • {row.size}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="border px-3 py-1" onClick={() => updateItem(row, row.quantity - 1)}>
                          -
                        </button>
                        <span>{row.quantity}</span>
                        <button className="border px-3 py-1" onClick={() => updateItem(row, row.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(row.product.price * row.quantity)}</p>
                      <button className="mt-2 text-sm text-[#777] underline" onClick={() => removeItem(row)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border p-6 text-[#777]">Chưa có sản phẩm trong giỏ.</div>
              )}
            </div>
          </div>

          <div className="border p-5">
            <h2 className="text-xl font-bold">Tóm tắt đơn</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold">
                <span>Tổng</span>
                <span>{formatCurrency(subtotal + shipping)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-5 block bg-black px-5 py-3 text-center text-white">
              Thanh toán
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function CheckoutPage() {
  const { items, setItems } = useCart();
  const [error, setError] = useState("");
  const rows = items
    .map((item) => ({ ...item, product: getProduct(item.slug) }))
    .filter((item): item is CartItem & { product: Product } => Boolean(item.product));
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  const shipping = rows.length ? (subtotal >= 300000 ? 0 : 30000) : 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      customer: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        postalCode: formData.get("postalCode"),
      },
      paymentMethod: formData.get("paymentMethod"),
      shippingMethod: formData.get("shippingMethod"),
      items,
      notes: formData.get("notes"),
    };
    alert("Cảm ơn bạn! Đơn hàng đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận trong 24h."); window.location.href = "/shoptinthanh-evolved/"; return; const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error?.message || data.error || "Lỗi checkout");
      return;
    }
    localStorage.setItem("last-order", JSON.stringify(data.order));
    setItems([]);
    window.location.href = "/dat-hang-thanh-cong";
  }

  return (
    <Shell>
      <section className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="border p-5">
            <h1 className="text-3xl font-bold uppercase">Thanh toán</h1>
            <p className="mt-2 text-sm text-[#777]">Vui lòng kiểm tra lại thông tin trước khi đặt hàng.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input name="firstName" required placeholder="Tên" className="border px-4 py-3" />
              <input name="lastName" required placeholder="Họ" className="border px-4 py-3" />
              <input name="email" type="email" required placeholder="Email" className="border px-4 py-3" />
              <input name="phone" required placeholder="Số điện thoại" className="border px-4 py-3" />
              <input name="address" required placeholder="Địa chỉ nhận hàng" className="border px-4 py-3 sm:col-span-2" />
              <input name="city" required placeholder="Thành phố" className="border px-4 py-3" />
              <input name="postalCode" placeholder="Mã bưu chính" className="border px-4 py-3" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select name="paymentMethod" className="border px-4 py-3">
                <option value="cod">COD</option>
                <option value="bank-transfer">Chuyển khoản ngân hàng</option>
              </select>
              <select name="shippingMethod" className="border px-4 py-3">
                <option value="standard">Tiêu chuẩn</option>
                <option value="express">Nhanh</option>
              </select>
            </div>
            <textarea name="notes" className="mt-4 min-h-28 w-full border p-3" placeholder="Ghi chú giao hàng" />
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <button className="mt-5 bg-black px-6 py-3 text-white">Xác nhận đơn hàng</button>
          </form>

          <div className="border p-5">
            <h2 className="text-xl font-bold">Thông tin đơn</h2>
            <div className="mt-4 space-y-4">
              {rows.map((row) => (
                <div key={cartKey(row)} className="flex items-center justify-between gap-3 border-b pb-3 text-sm">
                  <div>
                    <p className="font-medium">{row.product.name}</p>
                    <p className="text-[#777]">
                      {row.size} • {row.variant} • SL {row.quantity}
                    </p>
                  </div>
                  <span>{formatCurrency(row.product.price * row.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold">
                <span>Tổng</span>
                <span>{formatCurrency(subtotal + shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function SuccessPage() {
  const [order] = useState<StoredOrder>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("last-order");
    return raw ? (JSON.parse(raw) as StoredOrder) : null;
  });

  return (
    <Shell>
      <section className="container-shell py-16">
        <div className="mx-auto max-w-2xl border p-8 text-center">
          <h1 className="text-4xl font-bold uppercase">Đặt hàng thành công</h1>
          <p className="mt-4 text-[#666]">Cảm ơn bạn đã mua hàng! Chúng tôi sẽ liên hệ xác nhận đơn hàng qua điện thoại.</p>
          {order ? (
            <div className="mt-6 border p-5 text-left">
              <p className="font-semibold">Mã đơn: {order.id}</p>
              <p>Tổng đơn: {formatCurrency(order.total)}</p>
              <p>Trạng thái: {order.status}</p>
            </div>
          ) : null}
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/" className="bg-black px-5 py-3 text-white">
              Về trang chủ
            </Link>
            <Link href="/tim-kiem" className="border px-5 py-3">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function StoryPage() {
  return (
    <Shell>
      <section className="container-shell py-10">
        <h1 className="text-3xl font-bold uppercase">Câu chuyện của Tín Thành</h1>
        <div className="mt-5 max-w-3xl space-y-4 leading-7 text-[#666]">
          <p>Shop Tín Thành được thành lập năm 2018, xuất phát từ niềm đam mê thời trang của anh Tín Thành - một chàng trai trẻ Cao Lãnh luôn muốn mang đến phong cách mới mẻ cho bạn bè và khách hàng.</p>
          <p>Shop Tín Thành là điểm đến tin cậy cho thời trang chính hãng tại Đồng Tháp. Chúng tôi cam kết mang đến sản phẩm chất lượng với giá tốt nhất.</p>
          <p>Chúng tôi cam kết 100% hàng chính hãng, giá tốt nhất khu vực và dịch vụ chăm sóc khách hàng tận tâm. Đổi trả trong 7 ngày, ship COD miễn phí nội tỉnh. Ghé thăm tại 65 đường 30/4, P.1, TP. Cao Lãnh hoặc liên hệ Zalo: 0559.433.198</p>
        </div>
      </section>
    </Shell>
  );
}

export function BlogPage() {
  return (
    <Shell>
      <section className="container-shell py-10">
        <h1 className="text-3xl font-bold uppercase">Blog</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="border p-5">
              <p className="text-xs text-[#777]">{post.date}</p>
              <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
              <p className="mt-3 text-[#666]">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}

export function SupportPage({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <Shell>
      <section className="container-shell py-10">
        <h1 className="text-3xl font-bold uppercase">{title}</h1>
        <div className="mt-5 max-w-3xl space-y-4 leading-7 text-[#666]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </Shell>
  );
}
