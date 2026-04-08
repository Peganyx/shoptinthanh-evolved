export type Department = "nu" | "nam" | "khac";

export interface CategoryGroup { slug: Department; label: string; subcategories: { slug: string; label: string }[]; }
export interface Product { slug: string; name: string; brand: string; department: Department; subcategory: string; price: number; compareAtPrice?: number; description: string; colors: { label: string; code: string; sku: string }[]; sizes: string[]; images: string[]; featured?: boolean; bestSeller?: boolean; isNew?: boolean; tags: string[]; }

export const STORE = {
  "name": "Shop Tín Thành",
  "hotline": "0559.433.198",
  "address": "65 đường 30/4, Cao Lãnh, Đồng Tháp",
  "zalo": "https://zalo.me/0559433198",
  "facebook": "https://facebook.com/shoptinthanh",
  "email": "cskh@shoptinthanh.vn"
} as const;

export const CATEGORIES: CategoryGroup[] = [
  {
    "slug": "nu",
    "label": "Thời trang nữ",
    "subcategories": [
      {
        "slug": "giay-nu",
        "label": "Giày nữ"
      },
      {
        "slug": "ao-polo-nu",
        "label": "Áo polo nữ"
      },
      {
        "slug": "ao-khoac-nu",
        "label": "Áo khoác nữ"
      },
      {
        "slug": "quan-jeans-nu",
        "label": "Quần jeans nữ"
      }
    ]
  },
  {
    "slug": "nam",
    "label": "Thời trang nam",
    "subcategories": [
      {
        "slug": "giay-nam",
        "label": "Giày nam"
      },
      {
        "slug": "ao-polo-nam",
        "label": "Áo polo nam"
      },
      {
        "slug": "ao-khoac-nam",
        "label": "Áo khoác nam"
      },
      {
        "slug": "quan-jeans-nam",
        "label": "Quần jeans nam"
      }
    ]
  },
  {
    "slug": "khac",
    "label": "Khác",
    "subcategories": [
      {
        "slug": "balo",
        "label": "Balo"
      },
      {
        "slug": "non",
        "label": "Nón & kính"
      },
      {
        "slug": "bao-tay",
        "label": "Phụ kiện"
      },
      {
        "slug": "giay-nu",
        "label": "Lifestyle"
      }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    "slug": "nike-air-force-1-07",
    "name": "Nike Air Force 1 '07",
    "brand": "Nike",
    "department": "nam",
    "subcategory": "giay-nam",
    "price": 3090000,
    "compareAtPrice": 3490000,
    "description": "Mẫu sneaker huyền thoại của Nike, dễ phối đồ và luôn nằm trong top bán chạy.",
    "colors": [
      {
        "label": "White",
        "code": "#f5f5f5",
        "sku": "AF1-W"
      },
      {
        "label": "Black",
        "code": "#111111",
        "sku": "AF1-B"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "images": [
      "/catalog/nike-air-force-1-07.png",
      "/catalog/nike-air-force-1-07.png",
      "/catalog/nike-air-force-1-07.png"
    ],
    "featured": true,
    "bestSeller": true,
    "isNew": true,
    "tags": [
      "nike",
      "air-force-1",
      "sneaker",
      "famous"
    ]
  },
  {
    "slug": "adidas-samba-og",
    "name": "Adidas Samba OG",
    "brand": "Adidas",
    "department": "nam",
    "subcategory": "giay-nam",
    "price": 2790000,
    "compareAtPrice": 3190000,
    "description": "Adidas Samba OG là một trong những đôi giày retro nổi tiếng nhất hiện tại, hợp cả outfit casual lẫn smart-casual.",
    "colors": [
      {
        "label": "Cloud White",
        "code": "#f3f3f3",
        "sku": "SAMBA-W"
      },
      {
        "label": "Black",
        "code": "#111111",
        "sku": "SAMBA-B"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "images": [
      "/catalog/adidas-samba-og.svg",
      "/catalog/adidas-samba-og.svg",
      "/catalog/adidas-samba-og.svg"
    ],
    "featured": true,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "adidas",
      "samba",
      "sneaker",
      "famous"
    ]
  },
  {
    "slug": "converse-chuck-taylor-all-star",
    "name": "Converse Chuck Taylor All Star",
    "brand": "Converse",
    "department": "nam",
    "subcategory": "giay-nam",
    "price": 1890000,
    "compareAtPrice": 2190000,
    "description": "Mẫu high-top kinh điển gắn liền với lịch sử Converse, cực dễ bán vì nhận diện cao.",
    "colors": [
      {
        "label": "Black",
        "code": "#1d1d1d",
        "sku": "CTAS-B"
      },
      {
        "label": "White",
        "code": "#f5f5f5",
        "sku": "CTAS-W"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "images": [
      "/catalog/converse-chuck-taylor-all-star.jpg",
      "/catalog/converse-chuck-taylor-all-star.jpg",
      "/catalog/converse-chuck-taylor-all-star.jpg"
    ],
    "featured": true,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "converse",
      "chuck-taylor",
      "high-top",
      "famous"
    ]
  },
  {
    "slug": "vans-old-skool",
    "name": "Vans Old Skool",
    "brand": "Vans",
    "department": "nam",
    "subcategory": "giay-nam",
    "price": 1990000,
    "compareAtPrice": 2290000,
    "description": "Old Skool là dòng sneaker đậm chất street/skate, giữ sức hút bền bỉ nhiều năm.",
    "colors": [
      {
        "label": "Black / White",
        "code": "#222222",
        "sku": "VANS-OW"
      },
      {
        "label": "Navy",
        "code": "#223a5e",
        "sku": "VANS-N"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "images": [
      "/catalog/vans-old-skool.svg",
      "/catalog/vans-old-skool.svg",
      "/catalog/vans-old-skool.svg"
    ],
    "featured": true,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "vans",
      "old-skool",
      "skate",
      "famous"
    ]
  },
  {
    "slug": "new-balance-530",
    "name": "New Balance 530",
    "brand": "New Balance",
    "department": "nam",
    "subcategory": "giay-nam",
    "price": 2890000,
    "compareAtPrice": 3290000,
    "description": "NB 530 đang rất hot nhờ form retro runner, hợp khách thích giày êm và phối đồ dễ.",
    "colors": [
      {
        "label": "Silver",
        "code": "#c7ccd4",
        "sku": "NB530-S"
      },
      {
        "label": "White",
        "code": "#f0f0f0",
        "sku": "NB530-W"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "images": [
      "/catalog/new-balance-530.svg",
      "/catalog/new-balance-530.svg",
      "/catalog/new-balance-530.svg"
    ],
    "featured": true,
    "bestSeller": false,
    "isNew": true,
    "tags": [
      "new-balance",
      "530",
      "dad-shoe",
      "famous"
    ]
  },
  {
    "slug": "crocs-classic-clog",
    "name": "Crocs Classic Clog",
    "brand": "Crocs",
    "department": "khac",
    "subcategory": "giay-nu",
    "price": 1490000,
    "compareAtPrice": 1790000,
    "description": "Classic Clog là item nổi tiếng nhờ cảm giác mang thoải mái và cực kỳ nhận diện thương hiệu.",
    "colors": [
      {
        "label": "Bone",
        "code": "#e8dcc8",
        "sku": "CROCS-B"
      },
      {
        "label": "Black",
        "code": "#151515",
        "sku": "CROCS-BK"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42"
    ],
    "images": [
      "/catalog/crocs-classic-clog.svg",
      "/catalog/crocs-classic-clog.svg",
      "/catalog/crocs-classic-clog.svg"
    ],
    "featured": true,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "crocs",
      "classic-clog",
      "casual",
      "famous"
    ]
  },
  {
    "slug": "levis-501-original-fit",
    "name": "Levi's 501 Original Fit Jeans",
    "brand": "Levi's",
    "department": "nam",
    "subcategory": "quan-jeans-nam",
    "price": 2490000,
    "compareAtPrice": 2890000,
    "description": "Levi’s 501 là chiếc jeans biểu tượng, gần như ai biết đến denim cũng biết mẫu này.",
    "colors": [
      {
        "label": "Dark Indigo",
        "code": "#355273",
        "sku": "LEVIS501-D"
      },
      {
        "label": "Light Wash",
        "code": "#7ea1c8",
        "sku": "LEVIS501-L"
      }
    ],
    "sizes": [
      "29",
      "30",
      "31",
      "32",
      "33",
      "34"
    ],
    "images": [
      "/catalog/levis-501-original-fit.svg",
      "/catalog/levis-501-original-fit.svg",
      "/catalog/levis-501-original-fit.svg"
    ],
    "featured": true,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "levis",
      "501",
      "jeans",
      "famous"
    ]
  },
  {
    "slug": "levis-trucker-jacket",
    "name": "Levi's Trucker Jacket",
    "brand": "Levi's",
    "department": "nam",
    "subcategory": "ao-khoac-nam",
    "price": 2890000,
    "compareAtPrice": 3290000,
    "description": "Trucker Jacket là mẫu áo khoác denim kinh điển của Levi’s, dễ phối và có tính biểu tượng cao.",
    "colors": [
      {
        "label": "Blue Denim",
        "code": "#587aa2",
        "sku": "TRUCKER-B"
      },
      {
        "label": "Black",
        "code": "#222222",
        "sku": "TRUCKER-BK"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/levis-trucker-jacket.svg",
      "/catalog/levis-trucker-jacket.svg",
      "/catalog/levis-trucker-jacket.svg"
    ],
    "featured": true,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "levis",
      "trucker",
      "jacket",
      "famous"
    ]
  },
  {
    "slug": "lacoste-l1212-polo",
    "name": "Lacoste L.12.12 Classic Polo",
    "brand": "Lacoste",
    "department": "nam",
    "subcategory": "ao-polo-nam",
    "price": 2790000,
    "compareAtPrice": 3190000,
    "description": "Lacoste L.12.12 là chiếc polo kinh điển, nhận diện mạnh và cực hợp tinh thần shop thời trang.",
    "colors": [
      {
        "label": "White",
        "code": "#ffffff",
        "sku": "L1212-W"
      },
      {
        "label": "Navy",
        "code": "#17324d",
        "sku": "L1212-N"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/lacoste-l1212-polo.jpg",
      "/catalog/lacoste-l1212-polo.jpg",
      "/catalog/lacoste-l1212-polo.jpg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": true,
    "tags": [
      "lacoste",
      "polo",
      "classic",
      "famous"
    ]
  },
  {
    "slug": "ralph-lauren-mesh-polo",
    "name": "Polo Ralph Lauren Mesh Polo Shirt",
    "brand": "Polo Ralph Lauren",
    "department": "nam",
    "subcategory": "ao-polo-nam",
    "price": 3290000,
    "compareAtPrice": 3690000,
    "description": "Một trong những mẫu polo nổi tiếng nhất thế giới, phù hợp khách thích phong cách preppy/classic.",
    "colors": [
      {
        "label": "White",
        "code": "#ffffff",
        "sku": "RLPOLO-W"
      },
      {
        "label": "Black",
        "code": "#111111",
        "sku": "RLPOLO-B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/ralph-lauren-mesh-polo.jpg",
      "/catalog/ralph-lauren-mesh-polo.jpg",
      "/catalog/ralph-lauren-mesh-polo.jpg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "ralph-lauren",
      "polo",
      "mesh",
      "famous"
    ]
  },
  {
    "slug": "champion-reverse-weave-hoodie",
    "name": "Champion Reverse Weave Hoodie",
    "brand": "Champion",
    "department": "nam",
    "subcategory": "ao-khoac-nam",
    "price": 2290000,
    "compareAtPrice": 2690000,
    "description": "Reverse Weave là dòng hoodie kinh điển của Champion, nổi tiếng vì form và độ bền.",
    "colors": [
      {
        "label": "Grey",
        "code": "#9a9a9a",
        "sku": "CHAMP-HG"
      },
      {
        "label": "Black",
        "code": "#222222",
        "sku": "CHAMP-HB"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/champion-reverse-weave-hoodie.jpg",
      "/catalog/champion-reverse-weave-hoodie.jpg",
      "/catalog/champion-reverse-weave-hoodie.jpg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "champion",
      "hoodie",
      "reverse-weave",
      "famous"
    ]
  },
  {
    "slug": "north-face-retro-nuptse",
    "name": "The North Face 1996 Retro Nuptse Jacket",
    "brand": "The North Face",
    "department": "nam",
    "subcategory": "ao-khoac-nam",
    "price": 6290000,
    "compareAtPrice": 6890000,
    "description": "Nuptse là mẫu puffer nổi tiếng nhất của The North Face, luôn tạo cảm giác premium cho catalog.",
    "colors": [
      {
        "label": "Black",
        "code": "#1c1c1c",
        "sku": "TNF-NUP-B"
      },
      {
        "label": "Blue",
        "code": "#315b8d",
        "sku": "TNF-NUP-N"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/north-face-retro-nuptse.svg",
      "/catalog/north-face-retro-nuptse.svg",
      "/catalog/north-face-retro-nuptse.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "north-face",
      "nuptse",
      "jacket",
      "famous"
    ]
  },
  {
    "slug": "patagonia-better-sweater",
    "name": "Patagonia Better Sweater Jacket",
    "brand": "Patagonia",
    "department": "nam",
    "subcategory": "ao-khoac-nam",
    "price": 3590000,
    "compareAtPrice": 3990000,
    "description": "Better Sweater là dòng fleece nổi tiếng của Patagonia, hợp khách thích outdoor-casual.",
    "colors": [
      {
        "label": "Stonewash",
        "code": "#7e8791",
        "sku": "PATA-BS"
      },
      {
        "label": "Navy",
        "code": "#27374d",
        "sku": "PATA-N"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/catalog/patagonia-better-sweater.jpg",
      "/catalog/patagonia-better-sweater.jpg",
      "/catalog/patagonia-better-sweater.jpg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": true,
    "tags": [
      "patagonia",
      "fleece",
      "better-sweater",
      "famous"
    ]
  },
  {
    "slug": "adidas-gazelle-bold",
    "name": "Adidas Gazelle Bold",
    "brand": "Adidas",
    "department": "nu",
    "subcategory": "giay-nu",
    "price": 2990000,
    "compareAtPrice": 3390000,
    "description": "Gazelle Bold là mẫu rất hot ở phân khúc nữ, nổi bật nhờ form retro và đế platform.",
    "colors": [
      {
        "label": "Pink",
        "code": "#e7bfd1",
        "sku": "GAZ-B-P"
      },
      {
        "label": "Cream",
        "code": "#efe0d1",
        "sku": "GAZ-B-C"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "images": [
      "/catalog/adidas-gazelle-bold.svg",
      "/catalog/adidas-gazelle-bold.svg",
      "/catalog/adidas-gazelle-bold.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "adidas",
      "gazelle",
      "women",
      "famous"
    ]
  },
  {
    "slug": "nike-dunk-low-retro",
    "name": "Nike Dunk Low Retro",
    "brand": "Nike",
    "department": "nu",
    "subcategory": "giay-nu",
    "price": 2990000,
    "compareAtPrice": 3390000,
    "description": "Nike Dunk Low vẫn là một trong những silhouette phổ biến nhất trên thị trường sneaker đại chúng.",
    "colors": [
      {
        "label": "White / Black",
        "code": "#f5f5f5",
        "sku": "DUNK-WB"
      },
      {
        "label": "White / Green",
        "code": "#edf4ea",
        "sku": "DUNK-WG"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "images": [
      "/catalog/nike-dunk-low-retro.png",
      "/catalog/nike-dunk-low-retro.png",
      "/catalog/nike-dunk-low-retro.png"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "nike",
      "dunk-low",
      "women",
      "famous"
    ]
  },
  {
    "slug": "converse-run-star-hike",
    "name": "Converse Run Star Hike",
    "brand": "Converse",
    "department": "nu",
    "subcategory": "giay-nu",
    "price": 2790000,
    "compareAtPrice": 3190000,
    "description": "Run Star Hike nổi tiếng vì đế platform khác biệt và độ nhận diện cực cao ở nhóm khách trẻ.",
    "colors": [
      {
        "label": "Black",
        "code": "#1f1f1f",
        "sku": "RSH-B"
      },
      {
        "label": "White",
        "code": "#f5f5f5",
        "sku": "RSH-W"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "images": [
      "/catalog/converse-run-star-hike.jpg",
      "/catalog/converse-run-star-hike.jpg",
      "/catalog/converse-run-star-hike.jpg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "converse",
      "run-star-hike",
      "platform",
      "famous"
    ]
  },
  {
    "slug": "new-balance-530-women",
    "name": "New Balance 530 Women's",
    "brand": "New Balance",
    "department": "nu",
    "subcategory": "giay-nu",
    "price": 2890000,
    "compareAtPrice": 3290000,
    "description": "Bản 530 cho nữ giữ DNA retro running và rất được chuộng vì dễ phối cùng outfit everyday.",
    "colors": [
      {
        "label": "White / Silver",
        "code": "#ececec",
        "sku": "NB530W-WS"
      },
      {
        "label": "Pink",
        "code": "#e7c5d1",
        "sku": "NB530W-P"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "images": [
      "/catalog/new-balance-530-women.svg",
      "/catalog/new-balance-530-women.svg",
      "/catalog/new-balance-530-women.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": true,
    "tags": [
      "new-balance",
      "530",
      "women",
      "famous"
    ]
  },
  {
    "slug": "levis-ribcage-straight-ankle",
    "name": "Levi's Ribcage Straight Ankle Jeans",
    "brand": "Levi's",
    "department": "nu",
    "subcategory": "quan-jeans-nu",
    "price": 2690000,
    "compareAtPrice": 3090000,
    "description": "Ribcage là mẫu jeans nữ nổi tiếng của Levi’s nhờ cạp cao và form thẳng cực tôn dáng.",
    "colors": [
      {
        "label": "Light Indigo",
        "code": "#90abc6",
        "sku": "RIB-LI"
      },
      {
        "label": "Black",
        "code": "#222222",
        "sku": "RIB-BK"
      }
    ],
    "sizes": [
      "24",
      "25",
      "26",
      "27",
      "28",
      "29"
    ],
    "images": [
      "/catalog/levis-ribcage-straight-ankle.svg",
      "/catalog/levis-ribcage-straight-ankle.svg",
      "/catalog/levis-ribcage-straight-ankle.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "levis",
      "ribcage",
      "women",
      "jeans",
      "famous"
    ]
  },
  {
    "slug": "ralph-lauren-cable-knit-sweater",
    "name": "Ralph Lauren Cable-Knit Cotton Sweater",
    "brand": "Ralph Lauren",
    "department": "nu",
    "subcategory": "ao-khoac-nu",
    "price": 3790000,
    "compareAtPrice": 4290000,
    "description": "Cable-knit sweater là item signature của Ralph Lauren, nổi bật bởi vẻ classic/preppy.",
    "colors": [
      {
        "label": "Cream",
        "code": "#efe5d3",
        "sku": "RLCK-CR"
      },
      {
        "label": "Navy",
        "code": "#20344f",
        "sku": "RLCK-N"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "images": [
      "/catalog/ralph-lauren-cable-knit-sweater.jpg",
      "/catalog/ralph-lauren-cable-knit-sweater.jpg",
      "/catalog/ralph-lauren-cable-knit-sweater.jpg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "ralph-lauren",
      "sweater",
      "women",
      "famous"
    ]
  },
  {
    "slug": "north-face-womens-denali",
    "name": "The North Face Women's Denali Jacket",
    "brand": "The North Face",
    "department": "nu",
    "subcategory": "ao-khoac-nu",
    "price": 4290000,
    "compareAtPrice": 4690000,
    "description": "Denali là một trong những chiếc fleece nổi tiếng nhất của The North Face, rất hợp phân khúc nữ năng động.",
    "colors": [
      {
        "label": "Black",
        "code": "#222222",
        "sku": "DENALI-B"
      },
      {
        "label": "White Dune",
        "code": "#ece3d3",
        "sku": "DENALI-C"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "images": [
      "/catalog/north-face-womens-denali.svg",
      "/catalog/north-face-womens-denali.svg",
      "/catalog/north-face-womens-denali.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "north-face",
      "denali",
      "women",
      "famous"
    ]
  },
  {
    "slug": "ray-ban-original-wayfarer",
    "name": "Ray-Ban Original Wayfarer Classic",
    "brand": "Ray-Ban",
    "department": "khac",
    "subcategory": "non",
    "price": 3890000,
    "compareAtPrice": 4290000,
    "description": "Wayfarer là mẫu kính huyền thoại của Ray-Ban, biểu tượng thời trang vượt thời gian.",
    "colors": [
      {
        "label": "Black",
        "code": "#111111",
        "sku": "RB-WAY-B"
      },
      {
        "label": "Tortoise",
        "code": "#6c4b32",
        "sku": "RB-WAY-T"
      }
    ],
    "sizes": [
      "Free size"
    ],
    "images": [
      "/catalog/ray-ban-original-wayfarer.svg",
      "/catalog/ray-ban-original-wayfarer.svg",
      "/catalog/ray-ban-original-wayfarer.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": true,
    "tags": [
      "ray-ban",
      "wayfarer",
      "sunglasses",
      "famous"
    ]
  },
  {
    "slug": "fjallraven-kanken",
    "name": "Fjällräven Kånken Backpack",
    "brand": "Fjällräven",
    "department": "khac",
    "subcategory": "balo",
    "price": 2390000,
    "compareAtPrice": 2790000,
    "description": "Kånken là mẫu balo quá nổi tiếng nhờ thiết kế vuông vức, gọn và nhận diện cực cao.",
    "colors": [
      {
        "label": "Ox Red",
        "code": "#8b3a3a",
        "sku": "KANKEN-R"
      },
      {
        "label": "Royal Blue",
        "code": "#2e5b8a",
        "sku": "KANKEN-B"
      }
    ],
    "sizes": [
      "Free size"
    ],
    "images": [
      "/catalog/fjallraven-kanken.svg",
      "/catalog/fjallraven-kanken.svg",
      "/catalog/fjallraven-kanken.svg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": false,
    "tags": [
      "fjallraven",
      "kanken",
      "backpack",
      "famous"
    ]
  },
  {
    "slug": "herschel-little-america",
    "name": "Herschel Little America Backpack",
    "brand": "Herschel",
    "department": "khac",
    "subcategory": "balo",
    "price": 2690000,
    "compareAtPrice": 3090000,
    "description": "Little America là dòng balo nổi tiếng nhất của Herschel, hợp cả đi học lẫn đi làm.",
    "colors": [
      {
        "label": "Black",
        "code": "#1d1d1d",
        "sku": "HLA-B"
      },
      {
        "label": "Tan",
        "code": "#b88a5a",
        "sku": "HLA-T"
      }
    ],
    "sizes": [
      "Free size"
    ],
    "images": [
      "/catalog/herschel-little-america.svg",
      "/catalog/herschel-little-america.svg",
      "/catalog/herschel-little-america.svg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "herschel",
      "little-america",
      "backpack",
      "famous"
    ]
  },
  {
    "slug": "new-era-59fifty-yankees",
    "name": "New Era 59FIFTY Yankees Cap",
    "brand": "New Era",
    "department": "khac",
    "subcategory": "non",
    "price": 1390000,
    "compareAtPrice": 1690000,
    "description": "59FIFTY Yankees là chiếc fitted cap cực kỳ phổ biến trong streetwear và sportswear.",
    "colors": [
      {
        "label": "Navy",
        "code": "#1b2f4f",
        "sku": "NY59-N"
      },
      {
        "label": "Black",
        "code": "#111111",
        "sku": "NY59-B"
      }
    ],
    "sizes": [
      "7",
      "7 1/8",
      "7 1/4",
      "7 3/8"
    ],
    "images": [
      "/catalog/new-era-59fifty-yankees.jpg",
      "/catalog/new-era-59fifty-yankees.jpg",
      "/catalog/new-era-59fifty-yankees.jpg"
    ],
    "featured": false,
    "bestSeller": false,
    "isNew": false,
    "tags": [
      "new-era",
      "59fifty",
      "cap",
      "famous"
    ]
  },
  {
    "slug": "casio-f91w",
    "name": "Casio F91W Classic Watch",
    "brand": "Casio",
    "department": "khac",
    "subcategory": "bao-tay",
    "price": 690000,
    "compareAtPrice": 890000,
    "description": "Casio F91W là chiếc đồng hồ digital kinh điển, nhỏ gọn, siêu nhận diện và giá dễ tiếp cận.",
    "colors": [
      {
        "label": "Black",
        "code": "#111111",
        "sku": "F91W-B"
      }
    ],
    "sizes": [
      "Free size"
    ],
    "images": [
      "/catalog/casio-f91w.svg",
      "/catalog/casio-f91w.svg",
      "/catalog/casio-f91w.svg"
    ],
    "featured": false,
    "bestSeller": true,
    "isNew": true,
    "tags": [
      "casio",
      "f91w",
      "watch",
      "famous"
    ]
  }
];

export const BLOG_POSTS = [
  {
    "slug": "famous-items-2026",
    "title": "Những item nổi tiếng đang giữ nhiệt tốt nhất 2026",
    "excerpt": "Từ Samba, AF1 đến 501 và Nuptse, đây là nhóm sản phẩm dễ lên shop nhất.",
    "date": "30/03/2026"
  },
  {
    "slug": "mix-famous-products",
    "title": "Mix sản phẩm nổi tiếng sao cho vẫn dễ bán ở shop địa phương",
    "excerpt": "Giữ tinh thần shop phổ thông nhưng catalog nhìn mạnh và tin cậy hơn.",
    "date": "28/03/2026"
  },
  {
    "slug": "catalog-refresh",
    "title": "Vì sao catalog có ảnh thật quan trọng hơn placeholder",
    "excerpt": "Ảnh thật và tên sản phẩm thật giúp khách tin shop hơn ngay từ cái nhìn đầu.",
    "date": "24/03/2026"
  }
];

export function formatCurrency(value: number) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value); }
export function getProduct(slug: string) { return PRODUCTS.find((p) => p.slug === slug); }
export function getDepartment(slug: string) { return CATEGORIES.find((c) => c.slug === slug); }