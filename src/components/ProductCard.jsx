/**
 * ProductCard.jsx
 * Polished product card with smooth interactions and refined typography.
 */

import { useState }                    from "react";
import { Link }                        from "react-router-dom";
import { HiHeart, HiShoppingCart,
         HiEye }                       from "react-icons/hi";
import clsx                            from "clsx";
import Badge                           from "./Badge";
import useCart                         from "../hooks/useCart";
import useWishlist                     from "../hooks/useWishlist";

const ProductCard = ({ product, isLoading = false }) => {
  const { addToCart, isLoading: cartLoading } = useCart();
  const { toggle, isInWishlist }              = useWishlist();
  const [imgError, setImgError]               = useState(false);
  const [adding,   setAdding  ]               = useState(false);
  const [imgLoaded, setImgLoaded]             = useState(false);

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-card">
        <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-3 bg-neutral-100 rounded-full w-1/3 animate-pulse" />
          <div className="h-4 bg-neutral-100 rounded-full w-3/4 animate-pulse" />
          <div className="h-4 bg-neutral-100 rounded-full w-1/2 animate-pulse" />
          <div className="h-10 bg-neutral-100 rounded-xl mt-3 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const image    = product.images?.[0];
  const variant  = product.variants?.[0];
  const price    = parseFloat(variant?.price    || 0);
  const compare  = parseFloat(variant?.compareAtPrice || 0);
  const discount = compare > price
    ? Math.round(((compare - price) / compare) * 100) : 0;
  const outOfStock  = (variant?.inventoryQuantity || 0) === 0;
  const inWishlist  = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || outOfStock) return;
    setAdding(true);
    await addToCart(product.id, variant.id, 1, product.title);
    setAdding(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group relative bg-white rounded-2xl overflow-hidden
                 shadow-card hover:shadow-card-hover
                 transition-all duration-300 ease-out flex flex-col
                 hover:-translate-y-1"
    >
      {/* ── Image ────────────────────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        {/* Shimmer while loading */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100
                          to-neutral-200 animate-pulse" />
        )}

        {!imgError && image?.src ? (
          <img
            src={image.src}
            alt={image.altText || product.title}
            onLoad={()  => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
            className={clsx(
              "w-full h-full object-cover transition-all duration-500",
              "group-hover:scale-[1.06]",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-5xl opacity-40">🛍️</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent
                        to-transparent opacity-0 group-hover:opacity-100 transition-opacity
                        duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="danger" size="sm">−{discount}%</Badge>
          )}
          {outOfStock && (
            <Badge variant="neutral" size="sm">Sold Out</Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2
                        translate-x-10 group-hover:translate-x-0
                        transition-transform duration-300">
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-md",
              "transition-all duration-200 active:scale-90",
              inWishlist
                ? "bg-brand-600 text-white"
                : "bg-white/95 text-neutral-500 hover:text-brand-600 hover:bg-white"
            )}
          >
            <HiHeart className={clsx("w-4 h-4", inWishlist && "fill-current")} />
          </button>

          {/* Quick view */}
          <Link
            to={`/products/${product.handle}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white
                       flex items-center justify-center shadow-md
                       text-neutral-500 hover:text-brand-600
                       transition-all duration-200 active:scale-90"
            aria-label="Quick view"
          >
            <HiEye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to cart — slides up from bottom */}
        {!outOfStock && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full
                          group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={adding || cartLoading}
              className="w-full flex items-center justify-center gap-2 py-3
                         bg-neutral-900/95 hover:bg-brand-600 backdrop-blur-sm
                         text-white text-sm font-semibold
                         transition-colors duration-200 disabled:opacity-60"
            >
              <HiShoppingCart className="w-4 h-4 shrink-0" />
              {adding ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* ── Info ─────────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-neutral-400 font-semibold uppercase
                      tracking-widest mb-1 truncate">
          {product.vendor}
        </p>

        <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2
                       flex-1 mb-3 leading-snug group-hover:text-brand-700
                       transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-neutral-900">
              ${price.toFixed(2)}
            </span>
            {compare > price && (
              <span className="text-xs text-neutral-400 line-through">
                ${compare.toFixed(2)}
              </span>
            )}
          </div>

          {/* Mobile add button (always visible) */}
          <button
            onClick={handleAddToCart}
            disabled={adding || cartLoading || outOfStock}
            className={clsx(
              "sm:hidden w-8 h-8 rounded-xl flex items-center justify-center",
              "transition-all duration-200 active:scale-90",
              outOfStock
                ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
            aria-label="Add to cart"
          >
            <HiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;