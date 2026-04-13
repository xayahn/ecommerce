/**
 * CartDrawer.jsx
 * Polished slide-in cart panel.
 */

import { Link }                         from "react-router-dom";
import { HiX, HiShoppingCart }          from "react-icons/hi";
import { HiMinus, HiPlus, HiTrash }     from "react-icons/hi";
import { HiArrowRight }                 from "react-icons/hi";
import clsx                             from "clsx";
import useCart                          from "../hooks/useCart";
import useScrollLock                    from "../hooks/useScrollLock";

const CartDrawer = () => {
  const {
    isOpen, closeDrawer,
    items, itemCount, formattedSubtotal,
    updateQuantity, removeFromCart, isLoading,
  } = useCart();

  useScrollLock(isOpen);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "shadow-[−8px_0_32px_rgba(0,0,0,0.12)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center
                            justify-center">
              <HiShoppingCart className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Your Cart</h2>
              <p className="text-xs text-neutral-400">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                       transition-all duration-200"
            aria-label="Close cart"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center
                          px-8 text-center gap-5">
            <div className="w-24 h-24 bg-neutral-50 rounded-3xl flex items-center
                            justify-center border-2 border-dashed border-neutral-200">
              <span className="text-4xl">🛒</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Looks like you haven't added anything yet.
                Start exploring our products!
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white
                         font-semibold rounded-xl transition-all duration-200
                         active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
            {items.map((item, index) => {
              const variant = item.product?.variants?.find(
                (v) => v.id === item.variantId
              );
              const price   = parseFloat(variant?.price || 0);
              const image   = item.product?.images?.[0];

              return (
                <div
                  key={item.id}
                  className={clsx(
                    "flex gap-4 py-4",
                    index < items.length - 1 && "border-b border-neutral-50"
                  )}
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.product?.handle}`}
                    onClick={closeDrawer}
                    className="w-[72px] h-[72px] rounded-xl overflow-hidden
                               bg-neutral-100 shrink-0 group"
                  >
                    {image?.src ? (
                      <img
                        src={image.src}
                        alt={image.altText || item.product?.title}
                        className="w-full h-full object-cover
                                   group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🛍️</span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product?.handle}`}
                          onClick={closeDrawer}
                          className="text-sm font-semibold text-neutral-900
                                     hover:text-brand-600 transition-colors
                                     line-clamp-1 block"
                        >
                          {item.product?.title}
                        </Link>
                        {variant?.title && variant.title !== "Default" && (
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {variant.title}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        disabled={isLoading}
                        className="p-1.5 text-neutral-300 hover:text-red-500
                                   hover:bg-red-50 rounded-lg transition-all
                                   duration-200 shrink-0 disabled:opacity-40"
                        aria-label="Remove item"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Qty controls */}
                      <div className="flex items-center border border-neutral-200
                                      rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center
                                     text-neutral-500 hover:bg-neutral-50
                                     transition disabled:opacity-40"
                        >
                          <HiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold
                                         text-neutral-900 border-x border-neutral-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center
                                     text-neutral-500 hover:bg-neutral-50
                                     transition disabled:opacity-40"
                        >
                          <HiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-neutral-900">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 bg-neutral-50/80 px-6 py-5 space-y-4">
            {/* Free shipping progress */}
            {parseFloat(formattedSubtotal.replace("$", "")) < 50 && (
              <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                  <span>Add ${(50 - parseFloat(formattedSubtotal.replace("$", ""))).toFixed(2)} more for free shipping</span>
                  <span>🚚</span>
                </div>
                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400
                               rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((parseFloat(formattedSubtotal.replace("$", "")) / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {parseFloat(formattedSubtotal.replace("$", "")) >= 50 && (
              <p className="text-xs text-green-600 font-medium text-center">
                🎉 You've unlocked free shipping!
              </p>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Subtotal</span>
              <span className="text-xl font-bold text-neutral-900">
                {formattedSubtotal}
              </span>
            </div>

            <p className="text-xs text-neutral-400 text-center">
              Taxes and shipping calculated at checkout
            </p>

            {/* CTAs */}
            <Link to="/checkout" onClick={closeDrawer}>
              <button className="w-full flex items-center justify-center gap-2
                                 bg-brand-600 hover:bg-brand-700 text-white
                                 font-bold py-4 rounded-xl transition-all duration-200
                                 active:scale-[0.98] shadow-lg shadow-brand-200">
                Checkout
                <HiArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link to="/cart" onClick={closeDrawer}>
              <button className="w-full text-sm font-medium text-neutral-600
                                 hover:text-brand-600 py-2 transition-colors">
                View full cart →
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;