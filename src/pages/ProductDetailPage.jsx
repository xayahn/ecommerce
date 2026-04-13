/**
 * ProductDetailPage.jsx
 * Full product detail: image gallery, variant selector, add to cart, related products.
 */

import { useState, useEffect }              from "react";
import { useParams, Link }                  from "react-router-dom";
import { HiHeart, HiShoppingCart,
         HiChevronLeft, HiChevronRight,
         HiShieldCheck, HiTruck, HiRefresh } from "react-icons/hi";
import ProductCard                           from "../components/ProductCard";
import Badge                                 from "../components/Badge";
import Button                                from "../components/Button";
import { productService }                    from "../services/productService";
import useCart                               from "../hooks/useCart";
import useWishlist                           from "../hooks/useWishlist";
import clsx                                  from "clsx";
import SEO                                   from "../components/SEO";
import { ProductDetailSkeleton }             from "../components/Skeleton";

const GUARANTEES = [
  { icon: HiTruck,       label: "Free shipping over $50"   },
  { icon: HiRefresh,     label: "30-day easy returns"      },
  { icon: HiShieldCheck, label: "Secure & encrypted checkout"},
];

const ProductDetailPage = () => {
  const { handle }                          = useParams();
  const { addToCart, isLoading: cartBusy }  = useCart();
  const { toggle, isInWishlist }            = useWishlist();

  const [product,       setProduct      ] = useState(null);
  const [related,       setRelated      ] = useState([]);
  const [isLoading,     setIsLoading    ] = useState(true);
  const [error,         setError        ] = useState(null);

  const [activeImage,   setActiveImage  ] = useState(0);
  const [selectedOpts,  setSelectedOpts ] = useState({});
  const [quantity,      setQuantity     ] = useState(1);
  const [adding,        setAdding       ] = useState(false);
  const [activeTab,     setActiveTab    ] = useState("description");

  // Fetch product
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    productService.getProductByHandle(handle)
      .then(({ product: p, related: r }) => {
        setProduct(p);
        setRelated(r || []);
        // Pre-select first option of each option group
        if (p?.variants?.[0]?.selectedOptions) {
          const defaults = {};
          p.variants[0].selectedOptions.forEach(({ name, value }) => {
            defaults[name] = value;
          });
          setSelectedOpts(defaults);
        }
        setActiveImage(0);
      })
      .catch((err) => setError(err.message || "Product not found"))
      .finally(() => setIsLoading(false));
  }, [handle]);

  // Find matching variant based on selected options
  const selectedVariant = product?.variants?.find((v) =>
    v.selectedOptions.every((opt) => selectedOpts[opt.name] === opt.value)
  ) || product?.variants?.[0];

  const price   = parseFloat(selectedVariant?.price || 0);
  const compare = parseFloat(selectedVariant?.compareAtPrice || 0);
  const discount = compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
  const inStock  = (selectedVariant?.inventoryQuantity || 0) > 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Get unique option names + values
  const optionGroups = product?.variants?.reduce((acc, v) => {
    v.selectedOptions.forEach(({ name, value }) => {
      if (!acc[name]) acc[name] = new Set();
      acc[name].add(value);
    });
    return acc;
  }, {}) || {};

  const handleAddToCart = async () => {
    if (!selectedVariant || !inStock) return;
    setAdding(true);
    await addToCart(product.id, selectedVariant.id, quantity, product.title);
    setAdding(false);
  };

  const prevImage = () =>
    setActiveImage((i) => (i - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
  const nextImage = () =>
    setActiveImage((i) => (i + 1) % (product?.images?.length || 1));

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) return <ProductDetailSkeleton />;

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
        <p className="text-neutral-500 mb-6">{error || "This product doesn't exist."}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-brand-600 text-white
                     font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={product.title}
        description={product.description}
        image={product.images?.[0]?.src}
        url={`/products/${product.handle}`}
        type="product"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <Link to="/"    className="hover:text-brand-600 transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-600 transition">Shop</Link>
          <span>/</span>
          <span className="text-neutral-700 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Image Gallery ───────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 group">
              {product.images?.[activeImage]?.src ? (
                <img
                  src={product.images[activeImage].src}
                  alt={product.images[activeImage].altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
              )}

              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="danger">-{discount}%</Badge>
                </div>
              )}

              {/* Nav arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90
                               rounded-full flex items-center justify-center shadow-md
                               opacity-0 group-hover:opacity-100 transition hover:bg-white"
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90
                               rounded-full flex items-center justify-center shadow-md
                               opacity-0 group-hover:opacity-100 transition hover:bg-white"
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setActiveImage(i)}
                    className={clsx(
                      "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition",
                      i === activeImage
                        ? "border-brand-600"
                        : "border-transparent hover:border-neutral-300"
                    )}
                  >
                    <img
                      src={img.src}
                      alt={img.altText || `View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <p className="text-sm text-brand-600 font-semibold uppercase tracking-wider mb-1">
              {product.vendor}
            </p>

            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-neutral-900">
                ${price.toFixed(2)}
              </span>
              {compare > price && (
                <span className="text-lg text-neutral-400 line-through">
                  ${compare.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="danger">Save {discount}%</Badge>
              )}
            </div>

            {/* Stock */}
            <div className="mb-5">
              {inStock ? (
                <Badge variant="success" dot>In Stock ({selectedVariant?.inventoryQuantity} left)</Badge>
              ) : (
                <Badge variant="danger" dot>Out of Stock</Badge>
              )}
            </div>

            {/* Option selectors */}
            {Object.entries(optionGroups).map(([name, values]) => (
              <div key={name} className="mb-5">
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  {name}:{" "}
                  <span className="font-normal text-neutral-500">
                    {selectedOpts[name]}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...values].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedOpts((prev) => ({ ...prev, [name]: val }))}
                      className={clsx(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition",
                        selectedOpts[name] === val
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-neutral-700 mb-2">Quantity</p>
              <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-50 transition text-lg"
                >
                  −
                </button>
                <span className="px-5 py-2.5 text-sm font-semibold text-neutral-900 border-x border-neutral-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.inventoryQuantity || 99, q + 1))}
                  className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-50 transition text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={adding || cartBusy}
                onClick={handleAddToCart}
                disabled={!inStock}
                leftIcon={<HiShoppingCart className="w-5 h-5" />}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <button
                onClick={() => toggle(product)}
                className={clsx(
                  "p-3 rounded-xl border-2 transition shrink-0",
                  inWishlist
                    ? "border-brand-600 bg-brand-50 text-brand-600"
                    : "border-neutral-200 text-neutral-500 hover:border-brand-400 hover:text-brand-600"
                )}
                aria-label="Toggle wishlist"
              >
                <HiHeart className="w-5 h-5" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {GUARANTEES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-neutral-500">
                  <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <hr className="border-neutral-100 mb-6" />

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-neutral-100">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium capitalize border-b-2 transition -mb-px",
                    activeTab === tab
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            )}
            {activeTab === "details" && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-50">
                  <span className="text-neutral-500">Vendor</span>
                  <span className="font-medium text-neutral-900">{product.vendor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-50">
                  <span className="text-neutral-500">Type</span>
                  <span className="font-medium text-neutral-900">{product.productType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-50">
                  <span className="text-neutral-500">SKU</span>
                  <span className="font-medium text-neutral-900">{selectedVariant?.sku}</span>
                </div>
                {product.tags?.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-500">Tags</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;