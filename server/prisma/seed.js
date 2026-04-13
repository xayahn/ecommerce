/**
 * seed.js
 * Seeds the PostgreSQL database with mock Shopify-structured data.
 * Run: node prisma/seed.js
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Collections ──────────────────────────────────────────────────────────────
const collectionsData = [
  { title: "Electronics",   handle: "electronics",   description: "Latest gadgets and tech",         imageSrc: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800", imageAlt: "Electronics" },
  { title: "Fashion",       handle: "fashion",       description: "Trending apparel for everyone",    imageSrc: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800", imageAlt: "Fashion" },
  { title: "Home & Living", handle: "home-living",   description: "Elevate your living space",        imageSrc: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", imageAlt: "Home and Living" },
  { title: "Sports",        handle: "sports",        description: "Gear up for peak performance",     imageSrc: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800", imageAlt: "Sports" },
  { title: "Beauty",        handle: "beauty",        description: "Premium skincare and cosmetics",   imageSrc: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", imageAlt: "Beauty" },
  { title: "Books",         handle: "books",         description: "Expand your mind and your shelf",  imageSrc: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800", imageAlt: "Books" },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const productsData = [
  // Electronics
  {
    title: "Pro Wireless Headphones", handle: "pro-wireless-headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life and premium sound quality. Perfect for audiophiles and remote workers.",
    vendor: "SoundTech", productType: "Electronics", tags: ["audio", "wireless", "noise-cancelling"],
    collection: "electronics",
    images: [
      { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", altText: "Pro Wireless Headphones front", position: 0 },
      { src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", altText: "Pro Wireless Headphones side", position: 1 },
    ],
    variants: [
      { title: "Black",  price: 299.99, compareAtPrice: 349.99, sku: "PWH-BLK-001", inventoryQuantity: 45, selectedOptions: [{ name: "Color", value: "Black" }] },
      { title: "White",  price: 299.99, compareAtPrice: 349.99, sku: "PWH-WHT-001", inventoryQuantity: 30, selectedOptions: [{ name: "Color", value: "White" }] },
      { title: "Silver", price: 319.99, compareAtPrice: 369.99, sku: "PWH-SLV-001", inventoryQuantity: 20, selectedOptions: [{ name: "Color", value: "Silver" }] },
    ],
  },
  {
    title: "Smart Watch Series X", handle: "smart-watch-series-x",
    description: "Advanced health monitoring, GPS tracking, and seamless smartphone integration in a sleek design.",
    vendor: "TechWear", productType: "Electronics", tags: ["wearable", "smartwatch", "fitness"],
    collection: "electronics",
    images: [
      { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", altText: "Smart Watch front", position: 0 },
      { src: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800", altText: "Smart Watch side", position: 1 },
    ],
    variants: [
      { title: "40mm / Black", price: 399.99, compareAtPrice: 449.99, sku: "SWX-40-BLK", inventoryQuantity: 25, selectedOptions: [{ name: "Size", value: "40mm" }, { name: "Color", value: "Black" }] },
      { title: "44mm / Black", price: 429.99, compareAtPrice: 479.99, sku: "SWX-44-BLK", inventoryQuantity: 20, selectedOptions: [{ name: "Size", value: "44mm" }, { name: "Color", value: "Black" }] },
      { title: "44mm / Silver", price: 429.99, compareAtPrice: 479.99, sku: "SWX-44-SLV", inventoryQuantity: 18, selectedOptions: [{ name: "Size", value: "44mm" }, { name: "Color", value: "Silver" }] },
    ],
  },
  {
    title: "4K Mirrorless Camera", handle: "4k-mirrorless-camera",
    description: "Professional-grade 24MP mirrorless camera with 4K video, in-body stabilization, and weather sealing.",
    vendor: "OpticPro", productType: "Electronics", tags: ["camera", "photography", "4k"],
    collection: "electronics",
    images: [
      { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800", altText: "Mirrorless Camera", position: 0 },
    ],
    variants: [
      { title: "Body Only",      price: 1299.99, compareAtPrice: 1499.99, sku: "CAM-BODY-001", inventoryQuantity: 12, selectedOptions: [{ name: "Bundle", value: "Body Only" }] },
      { title: "With 24-70mm Lens", price: 1899.99, compareAtPrice: 2199.99, sku: "CAM-KIT-001", inventoryQuantity: 8, selectedOptions: [{ name: "Bundle", value: "With 24-70mm Lens" }] },
    ],
  },

  // Fashion
  {
    title: "Classic Denim Jacket", handle: "classic-denim-jacket",
    description: "Timeless denim jacket crafted from 100% organic cotton. A wardrobe staple that never goes out of style.",
    vendor: "UrbanThread", productType: "Fashion", tags: ["jacket", "denim", "casual"],
    collection: "fashion",
    images: [
      { src: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800", altText: "Classic Denim Jacket front", position: 0 },
      { src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", altText: "Classic Denim Jacket back", position: 1 },
    ],
    variants: [
      { title: "XS / Light Blue", price: 89.99, compareAtPrice: 119.99, sku: "DJ-XS-LB", inventoryQuantity: 15, selectedOptions: [{ name: "Size", value: "XS" }, { name: "Color", value: "Light Blue" }] },
      { title: "S / Light Blue",  price: 89.99, compareAtPrice: 119.99, sku: "DJ-S-LB",  inventoryQuantity: 20, selectedOptions: [{ name: "Size", value: "S" },  { name: "Color", value: "Light Blue" }] },
      { title: "M / Light Blue",  price: 89.99, compareAtPrice: 119.99, sku: "DJ-M-LB",  inventoryQuantity: 25, selectedOptions: [{ name: "Size", value: "M" },  { name: "Color", value: "Light Blue" }] },
      { title: "L / Light Blue",  price: 89.99, compareAtPrice: 119.99, sku: "DJ-L-LB",  inventoryQuantity: 20, selectedOptions: [{ name: "Size", value: "L" },  { name: "Color", value: "Light Blue" }] },
      { title: "XL / Light Blue", price: 89.99, compareAtPrice: 119.99, sku: "DJ-XL-LB", inventoryQuantity: 10, selectedOptions: [{ name: "Size", value: "XL" }, { name: "Color", value: "Light Blue" }] },
    ],
  },
  {
    title: "Premium Running Sneakers", handle: "premium-running-sneakers",
    description: "Engineered for performance with responsive foam, breathable mesh upper, and durable outsole.",
    vendor: "StridePro", productType: "Fashion", tags: ["shoes", "running", "sports"],
    collection: "fashion",
    images: [
      { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", altText: "Running Sneakers", position: 0 },
      { src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800", altText: "Running Sneakers side", position: 1 },
    ],
    variants: [
      { title: "US 7 / White",  price: 129.99, compareAtPrice: 159.99, sku: "RS-7-WHT",  inventoryQuantity: 10, selectedOptions: [{ name: "Size", value: "US 7" },  { name: "Color", value: "White" }] },
      { title: "US 8 / White",  price: 129.99, compareAtPrice: 159.99, sku: "RS-8-WHT",  inventoryQuantity: 15, selectedOptions: [{ name: "Size", value: "US 8" },  { name: "Color", value: "White" }] },
      { title: "US 9 / White",  price: 129.99, compareAtPrice: 159.99, sku: "RS-9-WHT",  inventoryQuantity: 20, selectedOptions: [{ name: "Size", value: "US 9" },  { name: "Color", value: "White" }] },
      { title: "US 10 / White", price: 129.99, compareAtPrice: 159.99, sku: "RS-10-WHT", inventoryQuantity: 18, selectedOptions: [{ name: "Size", value: "US 10" }, { name: "Color", value: "White" }] },
      { title: "US 11 / White", price: 129.99, compareAtPrice: 159.99, sku: "RS-11-WHT", inventoryQuantity: 12, selectedOptions: [{ name: "Size", value: "US 11" }, { name: "Color", value: "White" }] },
    ],
  },

  // Home & Living
  {
    title: "Ergonomic Office Chair", handle: "ergonomic-office-chair",
    description: "Full lumbar support, adjustable armrests, and breathable mesh back for all-day comfort.",
    vendor: "WorkSmart", productType: "Furniture", tags: ["chair", "office", "ergonomic"],
    collection: "home-living",
    images: [
      { src: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800", altText: "Ergonomic Office Chair", position: 0 },
    ],
    variants: [
      { title: "Black", price: 449.99, compareAtPrice: 599.99, sku: "EOC-BLK-001", inventoryQuantity: 20, selectedOptions: [{ name: "Color", value: "Black" }] },
      { title: "Gray",  price: 449.99, compareAtPrice: 599.99, sku: "EOC-GRY-001", inventoryQuantity: 15, selectedOptions: [{ name: "Color", value: "Gray" }] },
    ],
  },
  {
    title: "Minimalist Desk Lamp", handle: "minimalist-desk-lamp",
    description: "Touch-controlled LED desk lamp with 5 brightness levels, USB charging port, and eye-care technology.",
    vendor: "LumiHome", productType: "Home Decor", tags: ["lamp", "led", "desk"],
    collection: "home-living",
    images: [
      { src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800", altText: "Desk Lamp", position: 0 },
    ],
    variants: [
      { title: "White", price: 59.99, compareAtPrice: 79.99, sku: "DL-WHT-001", inventoryQuantity: 40, selectedOptions: [{ name: "Color", value: "White" }] },
      { title: "Black", price: 59.99, compareAtPrice: 79.99, sku: "DL-BLK-001", inventoryQuantity: 35, selectedOptions: [{ name: "Color", value: "Black" }] },
    ],
  },

  // Sports
  {
    title: "Yoga Mat Pro", handle: "yoga-mat-pro",
    description: "6mm thick non-slip yoga mat with alignment lines, carrying strap, and sweat-resistant surface.",
    vendor: "ZenFit", productType: "Sports", tags: ["yoga", "fitness", "mat"],
    collection: "sports",
    images: [
      { src: "https://images.unsplash.com/photo-1601925228522-3b49b8b64f86?w=800", altText: "Yoga Mat", position: 0 },
    ],
    variants: [
      { title: "Purple", price: 49.99, compareAtPrice: 69.99, sku: "YM-PRP-001", inventoryQuantity: 50, selectedOptions: [{ name: "Color", value: "Purple" }] },
      { title: "Blue",   price: 49.99, compareAtPrice: 69.99, sku: "YM-BLU-001", inventoryQuantity: 45, selectedOptions: [{ name: "Color", value: "Blue" }] },
      { title: "Black",  price: 49.99, compareAtPrice: 69.99, sku: "YM-BLK-001", inventoryQuantity: 30, selectedOptions: [{ name: "Color", value: "Black" }] },
    ],
  },

  // Beauty
  {
    title: "Vitamin C Serum", handle: "vitamin-c-serum",
    description: "20% Vitamin C with hyaluronic acid and vitamin E. Brightens skin, reduces fine lines, and evens skin tone.",
    vendor: "GlowLab", productType: "Skincare", tags: ["serum", "vitamin-c", "skincare"],
    collection: "beauty",
    images: [
      { src: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800", altText: "Vitamin C Serum", position: 0 },
    ],
    variants: [
      { title: "30ml", price: 39.99, compareAtPrice: 54.99, sku: "VCS-30-001", inventoryQuantity: 60, selectedOptions: [{ name: "Size", value: "30ml" }] },
      { title: "50ml", price: 59.99, compareAtPrice: 79.99, sku: "VCS-50-001", inventoryQuantity: 40, selectedOptions: [{ name: "Size", value: "50ml" }] },
    ],
  },

  // Books
  {
    title: "The Art of Clean Code", handle: "the-art-of-clean-code",
    description: "A practical guide for developers who want to write elegant, maintainable, and efficient code.",
    vendor: "DevPress", productType: "Books", tags: ["programming", "coding", "software"],
    collection: "books",
    images: [
      { src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800", altText: "Programming Book", position: 0 },
    ],
    variants: [
      { title: "Paperback", price: 34.99, compareAtPrice: 44.99, sku: "ACB-PB-001", inventoryQuantity: 80, selectedOptions: [{ name: "Format", value: "Paperback" }] },
      { title: "Hardcover", price: 49.99, compareAtPrice: 59.99, sku: "ACB-HC-001", inventoryQuantity: 40, selectedOptions: [{ name: "Format", value: "Hardcover" }] },
      { title: "eBook",     price: 19.99, compareAtPrice: null,  sku: "ACB-EB-001", inventoryQuantity: 999, selectedOptions: [{ name: "Format", value: "eBook" }] },
    ],
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding database...\n");

  // 1. Clean existing data (in order to respect FK constraints)
  await prisma.wishlistItem.deleteMany();
  await prisma.orderLineItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data");

  // 2. Seed collections
  const collections = {};
  for (const col of collectionsData) {
    const created = await prisma.collection.create({ data: col });
    collections[col.handle] = created;
  }
  console.log(`✅ Seeded ${collectionsData.length} collections`);

  // 3. Seed products
  let productCount = 0;
  for (const p of productsData) {
    const { collection: collectionHandle, images, variants, ...productFields } = p;

    const product = await prisma.product.create({
      data: {
        ...productFields,
        images:   { create: images },
        variants: { create: variants },
      },
    });

    // Link to collection
    await prisma.collectionProduct.create({
      data: {
        collectionId: collections[collectionHandle].id,
        productId:    product.id,
      },
    });

    productCount++;
  }
  console.log(`✅ Seeded ${productCount} products`);

  // 4. Seed admin user
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.create({
    data: {
      email:        "admin@shopstore.com",
      passwordHash,
      firstName:    "Admin",
      lastName:     "User",
      role:         "ADMIN",
    },
  });

  // 5. Seed demo customer
  const customerHash = await bcrypt.hash("Customer@123", 12);
  await prisma.user.create({
    data: {
      email:        "customer@shopstore.com",
      passwordHash: customerHash,
      firstName:    "Jane",
      lastName:     "Doe",
      role:         "CUSTOMER",
    },
  });
  console.log("✅ Seeded admin + demo customer");

  console.log("\n🎉 Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });