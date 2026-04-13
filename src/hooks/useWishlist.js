/**
 * useWishlist.js
 * Convenience hook — re-exports useWishlist from WishlistContext
 * with additional derived helpers.
 */

import { useWishlist as useWishlistContext } from "../context/WishlistContext";

const useWishlist = () => {
  const wishlist = useWishlistContext();

  /**
   * Format a product object for wishlist storage.
   * @param {object} product - full product from API
   */
  const formatForWishlist = (product) => ({
    id:       product.id,
    title:    product.title,
    handle:   product.handle,
    price:    product.variants?.[0]?.price || "0.00",
    imageSrc: product.images?.[0]?.src     || "",
    imageAlt: product.images?.[0]?.altText || product.title,
    vendor:   product.vendor,
  });

  const toggle = (product) =>
    wishlist.toggleWishlist(formatForWishlist(product));

  const add = (product) =>
    wishlist.addToWishlist(formatForWishlist(product));

  return {
    ...wishlist,
    toggle,
    add,
    formatForWishlist,
  };
};

export default useWishlist;