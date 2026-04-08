import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public", "catalog");
const srcDir = path.join(root, "src", "lib");

const products = [
  { slug: "nike-air-force-1-07", name: "Nike Air Force 1 '07", brand: "Nike", department: "nam", subcategory: "giay-nam", price: 3090000, compareAtPrice: 3490000, sourceUrl: "https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr/CW2288-111", colors:[['White','#f5f5f5','AF1-W'],['Black','#111111','AF1-B']], sizes:['39','40','41','42','43'], tags:['nike','air-force-1','sneaker','famous'], description:'Mẫu sneaker huyền thoại của Nike, dễ phối đồ và luôn nằm trong top bán chạy.' },
  { slug: "adidas-samba-og", name: "Adidas Samba OG", brand: "Adidas", department: "nam", subcategory: "giay-nam", price: 2790000, compareAtPrice: 3190000, sourceUrl: "https://www.adidas.com/us/samba-og-shoes/B75806.html", colors:[['Cloud White','#f3f3f3','SAMBA-W'],['Black','#111111','SAMBA-B']], sizes:['39','40','41','42','43'], tags:['adidas','samba','sneaker','famous'], description:'Adidas Samba OG là một trong những đôi giày retro nổi tiếng nhất hiện tại, hợp cả outfit casual lẫn smart-casual.' },
  { slug: "converse-chuck-taylor-all-star", name: "Converse Chuck Taylor All Star", brand: "Converse", department: "nam", subcategory: "giay-nam", price: 1890000, compareAtPrice: 2190000, sourceUrl: "https://www.converse.com/shop/p/chuck-taylor-all-star-unisex-high-top-shoe/M7650.html", colors:[['Black','#1d1d1d','CTAS-B'],['White','#f5f5f5','CTAS-W']], sizes:['39','40','41','42','43'], tags:['converse','chuck-taylor','high-top','famous'], description:'Mẫu high-top kinh điển gắn liền với lịch sử Converse, cực dễ bán vì nhận diện cao.' },
  { slug: "vans-old-skool", name: "Vans Old Skool", brand: "Vans", department: "nam", subcategory: "giay-nam", price: 1990000, compareAtPrice: 2290000, sourceUrl: "https://www.vans.com/en-us/shoes-c00081/old-skool-shoe-pvn000d3hy28", colors:[['Black / White','#222222','VANS-OW'],['Navy','#223a5e','VANS-N']], sizes:['39','40','41','42','43'], tags:['vans','old-skool','skate','famous'], description:'Old Skool là dòng sneaker đậm chất street/skate, giữ sức hút bền bỉ nhiều năm.' },
  { slug: "new-balance-530", name: "New Balance 530", brand: "New Balance", department: "nam", subcategory: "giay-nam", price: 2890000, compareAtPrice: 3290000, sourceUrl: "https://www.newbalance.com/pd/530/MR530SG-D-07.html", colors:[['Silver','#c7ccd4','NB530-S'],['White','#f0f0f0','NB530-W']], sizes:['39','40','41','42','43'], tags:['new-balance','530','dad-shoe','famous'], description:'NB 530 đang rất hot nhờ form retro runner, hợp khách thích giày êm và phối đồ dễ.' },
  { slug: "crocs-classic-clog", name: "Crocs Classic Clog", brand: "Crocs", department: "khac", subcategory: "giay-nu", price: 1490000, compareAtPrice: 1790000, sourceUrl: "https://www.crocs.com/p/classic-clog/10001.html", colors:[['Bone','#e8dcc8','CROCS-B'],['Black','#151515','CROCS-BK']], sizes:['36','37','38','39','40','41','42'], tags:['crocs','classic-clog','casual','famous'], description:'Classic Clog là item nổi tiếng nhờ cảm giác mang thoải mái và cực kỳ nhận diện thương hiệu.' },
  { slug: "levis-501-original-fit", name: "Levi's 501 Original Fit Jeans", brand: "Levi's", department: "nam", subcategory: "quan-jeans-nam", price: 2490000, compareAtPrice: 2890000, sourceUrl: "https://www.levi.com/US/en_US/clothing/men/jeans/straight/501-original-fit-mens-jeans/p/005010194", colors:[['Dark Indigo','#355273','LEVIS501-D'],['Light Wash','#7ea1c8','LEVIS501-L']], sizes:['29','30','31','32','33','34'], tags:['levis','501','jeans','famous'], description:'Levi’s 501 là chiếc jeans biểu tượng, gần như ai biết đến denim cũng biết mẫu này.' },
  { slug: "levis-trucker-jacket", name: "Levi's Trucker Jacket", brand: "Levi's", department: "nam", subcategory: "ao-khoac-nam", price: 2890000, compareAtPrice: 3290000, sourceUrl: "https://www.levi.com/US/en_US/clothing/men/outerwear/the-trucker-jacket/p/723340130", colors:[['Blue Denim','#587aa2','TRUCKER-B'],['Black','#222222','TRUCKER-BK']], sizes:['S','M','L','XL'], tags:['levis','trucker','jacket','famous'], description:'Trucker Jacket là mẫu áo khoác denim kinh điển của Levi’s, dễ phối và có tính biểu tượng cao.' },
  { slug: "lacoste-l1212-polo", name: "Lacoste L.12.12 Classic Polo", brand: "Lacoste", department: "nam", subcategory: "ao-polo-nam", price: 2790000, compareAtPrice: 3190000, sourceUrl: "https://www.lacoste.com/us/lacoste/men/clothing/polos/men-s-original-l.12.12-classic-polo/L1212-51.html", colors:[['White','#ffffff','L1212-W'],['Navy','#17324d','L1212-N']], sizes:['S','M','L','XL'], tags:['lacoste','polo','classic','famous'], description:'Lacoste L.12.12 là chiếc polo kinh điển, nhận diện mạnh và cực hợp tinh thần shop thời trang.' },
  { slug: "ralph-lauren-mesh-polo", name: "Polo Ralph Lauren Mesh Polo Shirt", brand: "Polo Ralph Lauren", department: "nam", subcategory: "ao-polo-nam", price: 3290000, compareAtPrice: 3690000, sourceUrl: "https://www.ralphlauren.com/men-clothing-polo-shirts/classic-fit-mesh-polo-shirt/710688969.html", colors:[['White','#ffffff','RLPOLO-W'],['Black','#111111','RLPOLO-B']], sizes:['S','M','L','XL'], tags:['ralph-lauren','polo','mesh','famous'], description:'Một trong những mẫu polo nổi tiếng nhất thế giới, phù hợp khách thích phong cách preppy/classic.' },
  { slug: "champion-reverse-weave-hoodie", name: "Champion Reverse Weave Hoodie", brand: "Champion", department: "nam", subcategory: "ao-khoac-nam", price: 2290000, compareAtPrice: 2690000, sourceUrl: "https://www.champion.com/reverse-weave-hoodie-gf68.html", colors:[['Grey','#9a9a9a','CHAMP-HG'],['Black','#222222','CHAMP-HB']], sizes:['S','M','L','XL'], tags:['champion','hoodie','reverse-weave','famous'], description:'Reverse Weave là dòng hoodie kinh điển của Champion, nổi tiếng vì form và độ bền.' },
  { slug: "north-face-retro-nuptse", name: "The North Face 1996 Retro Nuptse Jacket", brand: "The North Face", department: "nam", subcategory: "ao-khoac-nam", price: 6290000, compareAtPrice: 6890000, sourceUrl: "https://www.thenorthface.com/en-us/mens/mens-jackets-and-vests-c211702/mens-1996-retro-nuptse-jacket-pNF0A3C8D", colors:[['Black','#1c1c1c','TNF-NUP-B'],['Blue','#315b8d','TNF-NUP-N']], sizes:['S','M','L','XL'], tags:['north-face','nuptse','jacket','famous'], description:'Nuptse là mẫu puffer nổi tiếng nhất của The North Face, luôn tạo cảm giác premium cho catalog.' },
  { slug: "patagonia-better-sweater", name: "Patagonia Better Sweater Jacket", brand: "Patagonia", department: "nam", subcategory: "ao-khoac-nam", price: 3590000, compareAtPrice: 3990000, sourceUrl: "https://www.patagonia.com/product/mens-better-sweater-fleece-jacket/25528.html", colors:[['Stonewash','#7e8791','PATA-BS'],['Navy','#27374d','PATA-N']], sizes:['S','M','L','XL'], tags:['patagonia','fleece','better-sweater','famous'], description:'Better Sweater là dòng fleece nổi tiếng của Patagonia, hợp khách thích outdoor-casual.' },
  { slug: "adidas-gazelle-bold", name: "Adidas Gazelle Bold", brand: "Adidas", department: "nu", subcategory: "giay-nu", price: 2990000, compareAtPrice: 3390000, sourceUrl: "https://www.adidas.com/us/gazelle-bold-shoes/IE0876.html", colors:[['Pink','#e7bfd1','GAZ-B-P'],['Cream','#efe0d1','GAZ-B-C']], sizes:['36','37','38','39','40'], tags:['adidas','gazelle','women','famous'], description:'Gazelle Bold là mẫu rất hot ở phân khúc nữ, nổi bật nhờ form retro và đế platform.' },
  { slug: "nike-dunk-low-retro", name: "Nike Dunk Low Retro", brand: "Nike", department: "nu", subcategory: "giay-nu", price: 2990000, compareAtPrice: 3390000, sourceUrl: "https://www.nike.com/t/dunk-low-retro-mens-shoes-76KnBL/DD1391-100", colors:[['White / Black','#f5f5f5','DUNK-WB'],['White / Green','#edf4ea','DUNK-WG']], sizes:['36','37','38','39','40'], tags:['nike','dunk-low','women','famous'], description:'Nike Dunk Low vẫn là một trong những silhouette phổ biến nhất trên thị trường sneaker đại chúng.' },
  { slug: "converse-run-star-hike", name: "Converse Run Star Hike", brand: "Converse", department: "nu", subcategory: "giay-nu", price: 2790000, compareAtPrice: 3190000, sourceUrl: "https://www.converse.com/shop/p/run-star-hike-platform-unisex-high-top-shoe/166800C.html", colors:[['Black','#1f1f1f','RSH-B'],['White','#f5f5f5','RSH-W']], sizes:['36','37','38','39','40'], tags:['converse','run-star-hike','platform','famous'], description:'Run Star Hike nổi tiếng vì đế platform khác biệt và độ nhận diện cực cao ở nhóm khách trẻ.' },
  { slug: "new-balance-530-women", name: "New Balance 530 Women's", brand: "New Balance", department: "nu", subcategory: "giay-nu", price: 2890000, compareAtPrice: 3290000, sourceUrl: "https://www.newbalance.com/pd/530/MR530SG-D-07.html", colors:[['White / Silver','#ececec','NB530W-WS'],['Pink','#e7c5d1','NB530W-P']], sizes:['36','37','38','39','40'], tags:['new-balance','530','women','famous'], description:'Bản 530 cho nữ giữ DNA retro running và rất được chuộng vì dễ phối cùng outfit everyday.' },
  { slug: "levis-ribcage-straight-ankle", name: "Levi's Ribcage Straight Ankle Jeans", brand: "Levi's", department: "nu", subcategory: "quan-jeans-nu", price: 2690000, compareAtPrice: 3090000, sourceUrl: "https://www.levi.com/US/en_US/clothing/women/jeans/straight/ribcage-straight-ankle-womens-jeans/p/726930134", colors:[['Light Indigo','#90abc6','RIB-LI'],['Black','#222222','RIB-BK']], sizes:['24','25','26','27','28','29'], tags:['levis','ribcage','women','jeans','famous'], description:'Ribcage là mẫu jeans nữ nổi tiếng của Levi’s nhờ cạp cao và form thẳng cực tôn dáng.' },
  { slug: "ralph-lauren-cable-knit-sweater", name: "Ralph Lauren Cable-Knit Cotton Sweater", brand: "Ralph Lauren", department: "nu", subcategory: "ao-khoac-nu", price: 3790000, compareAtPrice: 4290000, sourceUrl: "https://www.ralphlauren.com/women-clothing-sweaters/cable-knit-cotton-crewneck-sweater/0044387256.html", colors:[['Cream','#efe5d3','RLCK-CR'],['Navy','#20344f','RLCK-N']], sizes:['S','M','L'], tags:['ralph-lauren','sweater','women','famous'], description:'Cable-knit sweater là item signature của Ralph Lauren, nổi bật bởi vẻ classic/preppy.' },
  { slug: "north-face-womens-denali", name: "The North Face Women's Denali Jacket", brand: "The North Face", department: "nu", subcategory: "ao-khoac-nu", price: 4290000, compareAtPrice: 4690000, sourceUrl: "https://www.thenorthface.com/en-us/womens/womens-fleece-c829791/womens-denali-jacket-pNF0A7UR2", colors:[['Black','#222222','DENALI-B'],['White Dune','#ece3d3','DENALI-C']], sizes:['S','M','L'], tags:['north-face','denali','women','famous'], description:'Denali là một trong những chiếc fleece nổi tiếng nhất của The North Face, rất hợp phân khúc nữ năng động.' },
  { slug: "ray-ban-original-wayfarer", name: "Ray-Ban Original Wayfarer Classic", brand: "Ray-Ban", department: "khac", subcategory: "non", price: 3890000, compareAtPrice: 4290000, sourceUrl: "https://www.ray-ban.com/usa/sunglasses/RB2140%20UNISEX%20original%20wayfarer%20classic-black/805289126577", colors:[['Black','#111111','RB-WAY-B'],['Tortoise','#6c4b32','RB-WAY-T']], sizes:['Free size'], tags:['ray-ban','wayfarer','sunglasses','famous'], description:'Wayfarer là mẫu kính huyền thoại của Ray-Ban, biểu tượng thời trang vượt thời gian.' },
  { slug: "fjallraven-kanken", name: "Fjällräven Kånken Backpack", brand: "Fjällräven", department: "khac", subcategory: "balo", price: 2390000, compareAtPrice: 2790000, sourceUrl: "https://www.fjallraven.com/us/en-us/bags-gear/kanken/kanken-bags/kanken/", colors:[['Ox Red','#8b3a3a','KANKEN-R'],['Royal Blue','#2e5b8a','KANKEN-B']], sizes:['Free size'], tags:['fjallraven','kanken','backpack','famous'], description:'Kånken là mẫu balo quá nổi tiếng nhờ thiết kế vuông vức, gọn và nhận diện cực cao.' },
  { slug: "herschel-little-america", name: "Herschel Little America Backpack", brand: "Herschel", department: "khac", subcategory: "balo", price: 2690000, compareAtPrice: 3090000, sourceUrl: "https://herschel.com/shop/backpacks/little-america-backpack", colors:[['Black','#1d1d1d','HLA-B'],['Tan','#b88a5a','HLA-T']], sizes:['Free size'], tags:['herschel','little-america','backpack','famous'], description:'Little America là dòng balo nổi tiếng nhất của Herschel, hợp cả đi học lẫn đi làm.' },
  { slug: "new-era-59fifty-yankees", name: "New Era 59FIFTY Yankees Cap", brand: "New Era", department: "khac", subcategory: "non", price: 1390000, compareAtPrice: 1690000, sourceUrl: "https://www.neweracap.com/products/new-york-yankees-authentic-collection-59fifty-fitted", colors:[['Navy','#1b2f4f','NY59-N'],['Black','#111111','NY59-B']], sizes:['7','7 1/8','7 1/4','7 3/8'], tags:['new-era','59fifty','cap','famous'], description:'59FIFTY Yankees là chiếc fitted cap cực kỳ phổ biến trong streetwear và sportswear.' },
  { slug: "casio-f91w", name: "Casio F91W Classic Watch", brand: "Casio", department: "khac", subcategory: "bao-tay", price: 690000, compareAtPrice: 890000, sourceUrl: "https://www.casio.com/us/watches/casio/product.F-91W-1/", colors:[['Black','#111111','F91W-B']], sizes:['Free size'], tags:['casio','f91w','watch','famous'], description:'Casio F91W là chiếc đồng hồ digital kinh điển, nhỏ gọn, siêu nhận diện và giá dễ tiếp cận.' },
];

function extractImage(html) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    /"image"\s*:\s*"(https:[^"]+)"/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].replace(/\\u002F/g, "/").replace(/&amp;/g, "&");
  }
  return null;
}

function svgFallback(product) {
  const title = product.name.replaceAll("&", "&amp;");
  const brand = product.brand.replaceAll("&", "&amp;");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1500" viewBox="0 0 1200 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="80" y1="80" x2="1120" y2="1420" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f7f1ea"/>
      <stop offset="1" stop-color="#e7d7c4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" rx="48" fill="url(#bg)"/>
  <rect x="70" y="70" width="1060" height="1360" rx="40" fill="white" stroke="#d7c3ac"/>
  <rect x="130" y="140" width="320" height="62" rx="31" fill="#1c1c1c"/>
  <text x="170" y="182" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="white">${brand}</text>
  <text x="130" y="290" font-size="66" font-family="Arial, Helvetica, sans-serif" font-weight="800" fill="#1c1c1c">${title}</text>
  <rect x="190" y="380" width="820" height="780" rx="44" fill="#f8f5f0" stroke="#d7c3ac"/>
  <path d="M380 930 C420 610 760 610 820 930" stroke="#1c1c1c" stroke-width="24" stroke-linecap="round"/>
  <circle cx="450" cy="870" r="42" fill="#1c1c1c"/>
  <circle cx="750" cy="870" r="42" fill="#1c1c1c"/>
  <text x="130" y="1290" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="600" fill="#5a4b40">Famous product • catalog refresh • local image fallback</text>
</svg>`;
}

await fs.mkdir(publicDir, { recursive: true });

for (const product of products) {
  const baseName = product.slug;
  let localPath = `/catalog/${baseName}.jpg`;
  try {
    const response = await fetch(product.sourceUrl, { headers: { "user-agent": "Mozilla/5.0" } });
    const html = await response.text();
    const imageUrl = extractImage(html);
    if (!imageUrl) throw new Error("No og:image found");
    const imageResponse = await fetch(imageUrl, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.status}`);
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : contentType.includes("svg") ? "svg" : "jpg";
    localPath = `/catalog/${baseName}.${ext}`;
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    await fs.writeFile(path.join(publicDir, `${baseName}.${ext}`), buffer);
  } catch {
    localPath = `/catalog/${baseName}.svg`;
    await fs.writeFile(path.join(publicDir, `${baseName}.svg`), svgFallback(product));
  }
  product.images = [localPath, localPath, localPath];
}

const categories = {
  nu: [
    ["giay-nu", "Giày nữ"],
    ["ao-polo-nu", "Áo polo nữ"],
    ["ao-khoac-nu", "Áo khoác nữ"],
    ["quan-jeans-nu", "Quần jeans nữ"],
  ],
  nam: [
    ["giay-nam", "Giày nam"],
    ["ao-polo-nam", "Áo polo nam"],
    ["ao-khoac-nam", "Áo khoác nam"],
    ["quan-jeans-nam", "Quần jeans nam"],
  ],
  khac: [
    ["balo", "Balo"],
    ["non", "Nón & kính"],
    ["bao-tay", "Phụ kiện"],
    ["giay-nu", "Lifestyle"],
  ],
};

const lines = [];
lines.push('export type Department = "nu" | "nam" | "khac";');
lines.push('');
lines.push('export interface CategoryGroup { slug: Department; label: string; subcategories: { slug: string; label: string }[]; }');
lines.push('export interface Product { slug: string; name: string; brand: string; department: Department; subcategory: string; price: number; compareAtPrice?: number; description: string; colors: { label: string; code: string; sku: string }[]; sizes: string[]; images: string[]; featured?: boolean; bestSeller?: boolean; isNew?: boolean; tags: string[]; }');
lines.push('');
lines.push('export const STORE = ' + JSON.stringify({ name:'Shop Tín Thành', hotline:'0559.433.198', address:'65 đường 30/4, Cao Lãnh, Đồng Tháp', zalo:'https://zalo.me/0559433198', facebook:'https://facebook.com/shoptinthanh', email:'cskh@shoptinthanh.vn' }, null, 2) + ' as const;');
lines.push('');
lines.push('export const CATEGORIES: CategoryGroup[] = ' + JSON.stringify([
  { slug:'nu', label:'Thời trang nữ', subcategories: categories.nu.map(([slug,label]) => ({slug,label})) },
  { slug:'nam', label:'Thời trang nam', subcategories: categories.nam.map(([slug,label]) => ({slug,label})) },
  { slug:'khac', label:'Khác', subcategories: categories.khac.map(([slug,label]) => ({slug,label})) },
], null, 2) + ';');
lines.push('');
const typedProducts = products.map((product, index) => ({
  slug: product.slug,
  name: product.name,
  brand: product.brand,
  department: product.department,
  subcategory: product.subcategory,
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  description: product.description,
  colors: product.colors.map(([label, code, sku]) => ({ label, code, sku })),
  sizes: product.sizes,
  images: product.images,
  featured: index < 8,
  bestSeller: index % 3 === 0,
  isNew: index % 4 === 0,
  tags: product.tags,
}));
lines.push('export const PRODUCTS: Product[] = ' + JSON.stringify(typedProducts, null, 2) + ';');
lines.push('');
lines.push('export const BLOG_POSTS = ' + JSON.stringify([
  { slug:'famous-items-2026', title:'Những item nổi tiếng đang giữ nhiệt tốt nhất 2026', excerpt:'Từ Samba, AF1 đến 501 và Nuptse, đây là nhóm sản phẩm dễ lên shop nhất.', date:'30/03/2026' },
  { slug:'mix-famous-products', title:'Mix sản phẩm nổi tiếng sao cho vẫn dễ bán ở shop địa phương', excerpt:'Giữ tinh thần shop phổ thông nhưng catalog nhìn mạnh và tin cậy hơn.', date:'28/03/2026' },
  { slug:'catalog-refresh', title:'Vì sao catalog có ảnh thật quan trọng hơn placeholder', excerpt:'Ảnh thật và tên sản phẩm thật giúp khách tin shop hơn ngay từ cái nhìn đầu.', date:'24/03/2026' }
], null, 2) + ';');
lines.push('');
lines.push('export function formatCurrency(value: number) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value); }');
lines.push('export function getProduct(slug: string) { return PRODUCTS.find((p) => p.slug === slug); }');
lines.push('export function getDepartment(slug: string) { return CATEGORIES.find((c) => c.slug === slug); }');

await fs.mkdir(srcDir, { recursive: true });
await fs.writeFile(path.join(srcDir, 'store-data.ts'), lines.join('\n'));
console.log(`catalog refreshed: ${products.length} products`);
