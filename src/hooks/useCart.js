/**
 * useCart.js
 * Convenience hook — re-exports useCart from CartContext
 * with additional derived helpers.
 */

import { useCart as useCartContext } from "../context/CartContext";

const useCart = () => {
  const cart = useCartContext();

  /**
   * Check if a specific variant is already in the cart.
   * @param {string} variantId
   */
  const isInCart = (variantId) =>
    cart.items.some((item) => item.variantId === variantId);

  /**
   * Get quantity of a specific variant in cart.
   * @param {string} variantId
   */
  const getItemQuantity = (variantId) =>
    cart.items.find((item) => item.variantId === variantId)?.quantity || 0;

  /**
   * Format subtotal as currency string.
   */
  const formattedSubtotal = `$${cart.subtotal.toFixed(2)}`;

  return {
    ...cart,
    isInCart,
    getItemQuantity,
    formattedSubtotal,
  };
};

export default useCart;