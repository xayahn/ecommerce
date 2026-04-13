/**
 * CartPage.jsx
 * Full cart page with line items, promo code, and order summary.
 */

import { useState }                          from "react";
import { Link, useNavigate }                 from "react-router-dom";
import { HiTrash, HiArrowLeft,
         HiTag, HiShoppingCart }             from "react-icons/hi";
import { HiMinus, HiPlus }                   from "react-icons/hi";
import Button                                from "../components/Button";
import { cartService }                       from "../services/cartService";
import useCart                               from "../hooks/useCart";
import toast                                 from "react-hot-toast";
import SEO                                   from "../components/SEO";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items, subtotal, formattedSubtotal,
    updateQuantity, removeFromCart, isLoading,
  } = useCart();

  const [promoInput,    setPromoInput   ] = useState("");
  const [promoApplied,  setPromoApplied ] = useState(null);
  const [promoLoading,  setPromoLoading ] = useState(false);

  const discount     = promoApplied
    ? promoApplied.type === "percentage"
      ? subtotal * promoApplied.discount
      : promoApplied.discount
    : 0;
  const afterDiscount = subtotal - discount;
  const tax           = afterDiscount * 0.09;
  const total         = afterDiscount + tax;

  const handlePromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const promo = await cartService.applyPromo(promoInput);
      setPromoApplied(promo);
      toast.success(`Promo code applied! ${promo.label}`);
    } catch (err) {
      toast.error(err.message || "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  // Empty
  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <HiShoppingCart className="w-16 h-16 text-neutral-200 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop">
          <Button variant="primary" size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <SEO title="Your Cart" url="/cart" noIndex />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            Shopping Cart
            <span className="ml-2 text-base font-normal text-neutral-400">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Items ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const variant = item.product?.variants?.find((v) => v.id === item.variantId);
              const price   = parseFloat(variant?.price || 0);
              const image   = item.product?.images?.[0];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-card flex gap-5"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.product?.handle}`}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0"
                  >
                    {image?.src ? (
                      <img
                        src={image.src}
                        alt={image.altText || item.product?.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/products/${item.product?.handle}`}
                          className="font-semibold text-neutral-900 hover:text-brand-600
                                     transition line-clamp-1"
                        >
                          {item.product?.title}
                        </Link>
                        {variant?.title && variant.title !== "Default" && (
                          <p className="text-xs text-neutral-400 mt-0.5">{variant.title}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        disabled={isLoading}
                        className="p-1.5 text-neutral-400 hover:text-red-500
                                   hover:bg-red-50 rounded-lg transition shrink-0"
                        aria-label="Remove"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center
                                     justify-center hover:bg-neutral-50 transition disabled:opacity-40"
                        >
                          <HiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center
                                     justify-center hover:bg-neutral-50 transition disabled:opacity-40"
                        >
                          <HiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-bold text-neutral-900">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-neutral-900 mb-5">Order Summary</h2>

              {/* Promo code */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <HiTag className="absolute left-3 top-1/2 -translate-y-1/2
                                      w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE20"
                      disabled={!!promoApplied}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                                 disabled:bg-neutral-50 disabled:text-neutral-400"
                    />
                  </div>
                  {promoApplied ? (
                    <button
                      onClick={() => { setPromoApplied(null); setPromoInput(""); }}
                      className="px-3 py-2 text-sm text-red-600 border border-red-200
                                 rounded-lg hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={promoLoading}
                      onClick={handlePromo}
                    >
                      Apply
                    </Button>
                  )}
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-600 mt-1.5 font-medium">
                    ✓ {promoApplied.label} applied
                  </p>
                )}
                <p className="text-xs text-neutral-400 mt-1">
                  Try: SAVE10, SAVE20, or FLAT50
                </p>
              </div>

              <hr className="border-neutral-100 mb-4" />

              {/* Totals */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formattedSubtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {subtotal >= 50 ? "Free" : "$9.99"}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (9%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-neutral-100" />
                <div className="flex justify-between font-bold text-neutral-900 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button variant="primary" fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link to="/shop">
                <Button variant="ghost" fullWidth className="mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;