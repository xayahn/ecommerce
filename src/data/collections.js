/**
 * collections.js
 * Mock Shopify Storefront API collection shapes.
 * Used as fallback / SSR placeholder before API responds.
 */

export const collections = [
  { id: "col-1", title: "Electronics",   handle: "electronics",   description: "Latest gadgets and tech",        imageSrc: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800", imageAlt: "Electronics",   productCount: 3 },
  { id: "col-2", title: "Fashion",       handle: "fashion",       description: "Trending apparel for everyone",   imageSrc: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800", imageAlt: "Fashion",       productCount: 2 },
  { id: "col-3", title: "Home & Living", handle: "home-living",   description: "Elevate your living space",       imageSrc: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", imageAlt: "Home & Living", productCount: 2 },
  { id: "col-4", title: "Sports",        handle: "sports",        description: "Gear up for peak performance",    imageSrc: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800", imageAlt: "Sports",        productCount: 1 },
  { id: "col-5", title: "Beauty",        handle: "beauty",        description: "Premium skincare and cosmetics",  imageSrc: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", imageAlt: "Beauty",        productCount: 1 },
  { id: "col-6", title: "Books",         handle: "books",         description: "Expand your mind and your shelf", imageSrc: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800", imageAlt: "Books",         productCount: 1 },
];

export const getCollectionByHandle = (handle) =>
  collections.find((c) => c.handle === handle) ?? null;