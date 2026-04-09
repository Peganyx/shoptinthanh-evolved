import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/lib/store-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        department: p.department,
        subcategory: p.subcategory,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        description: p.description,
        sizes: p.sizes,
        images: p.images,
        featured: p.featured || false,
        bestSeller: p.bestSeller || false,
        isNew: p.isNew || false,
        tags: p.tags,
        variants: {
          create: p.colors.map((c) => ({
            label: c.label,
            colorCode: c.code,
            sku: c.sku,
          })),
        },
      },
    });
    console.log(`  ✓ ${product.name}`);
  }

  const count = await prisma.product.count();
  console.log(`\n✅ Seeded ${count} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
