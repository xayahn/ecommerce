/**
 * CheckoutPage.jsx
 * Multi-step checkout: Shipping → Payment → Review → Place Order
 */

import { useState }          from "react";
import { useNavigate }       from "react-router-dom";
import { HiCheck }           from "react-icons/hi";
import Button                from "../components/Button";
import { orderService }      from "../services/orderService";
import { useAuth }           from "../context/AuthContext";
import useCart               from "../hooks/useCart";
import clsx                  from "clsx";
import toast                 from "react-hot-toast";
import SEO                   from "../components/SEO";

const STEPS = ["Shipping", "Payment", "Review"];

// ─── Field component ──────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputClass = "w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent " +
  "placeholder:text-neutral-400 transition";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user }    = useAuth();
  const { items, subtotal, itemCount, clearCart } = useCart();

  const [step,     setStep    ] = useState(0);
  const [placing,  setPlacing ] = useState(false);

  // Shipping form
  const [shipping, setShipping] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    address1:  "",
    address2:  "",
    city:      "",
    province:  "",
    zip:       "",
    country:   "US",
    phone:     "",
    email:     user?.email || "",
  });

  // Payment form (mock — no real payment)
  const [payment, setPayment] = useState({
    cardName:   "",
    cardNumber: "",
    expiry:     "",
    cvv:        "",
  });

  const [errors, setErrors] = useState({});

  // Totals
  const tax   = subtotal * 0.09;
  const total = subtotal + tax;

  // ── Validators ──────────────────────────────────────────────────────────
  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim())  e.lastName  = "Required";
    if (!shipping.address1.trim())  e.address1  = "Required";
    if (!shipping.city.trim())      e.city      = "Required";
    if (!shipping.province.trim())  e.province  = "Required";
    if (!shipping.zip.trim())       e.zip       = "Required";
    if (!shipping.email.trim())     e.email     = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!payment.cardName.trim())                       e.cardName   = "Required";
    if (payment.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter 16 digits";
    if (!payment.expiry.trim())                         e.expiry     = "Required";
    if (payment.cvv.length < 3)                         e.cvv        = "Enter 3-4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment())  return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const token = localStorage.getItem("cart_token");
      const order = await orderService.placeOrder({
        cartToken:       token,
        email:           shipping.email,
        shippingAddress: shipping,
        paymentMethod:   "mock_card",
        discountCode:    null,
      });
      await clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleShippingChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    if (name === "expiry")     value = value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
    if (name === "cvv")        value = value.replace(/\D/g, "").slice(0, 4);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <SEO title="Checkout" url="/checkout" noIndex />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition",
                    i < step  ? "bg-brand-600 text-white" :
                    i === step ? "bg-brand-600 text-white ring-4 ring-brand-100" :
                                 "bg-neutral-200 text-neutral-500"
                  )}
                >
                  {i < step ? <HiCheck className="w-5 h-5" /> : i + 1}
                </div>
                <span className={clsx(
                  "text-xs mt-1 font-medium",
                  i === step ? "text-brand-600" : "text-neutral-400"
                )}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx(
                  "h-0.5 w-16 sm:w-24 mx-2 mb-4 transition-colors",
                  i < step ? "bg-brand-600" : "bg-neutral-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Form ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">

              {/* Step 0: Shipping */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name *" error={errors.firstName}>
                      <input name="firstName" value={shipping.firstName} onChange={handleShippingChange}
                        placeholder="Jane" className={inputClass} />
                    </Field>
                    <Field label="Last Name *" error={errors.lastName}>
                      <input name="lastName" value={shipping.lastName} onChange={handleShippingChange}
                        placeholder="Doe" className={inputClass} />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                      <input name="email" type="email" value={shipping.email} onChange={handleShippingChange}
                        placeholder="you@example.com" className={inputClass} />
                    </Field>
                    <Field label="Phone">
                      <input name="phone" value={shipping.phone} onChange={handleShippingChange}
                        placeholder="+1 (555) 000-0000" className={inputClass} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Address *" error={errors.address1}>
                        <input name="address1" value={shipping.address1} onChange={handleShippingChange}
                          placeholder="123 Main St" className={inputClass} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Apt, Suite, etc.">
                        <input name="address2" value={shipping.address2} onChange={handleShippingChange}
                          placeholder="Optional" className={inputClass} />
                      </Field>
                    </div>
                    <Field label="City *" error={errors.city}>
                      <input name="city" value={shipping.city} onChange={handleShippingChange}
                        placeholder="San Francisco" className={inputClass} />
                    </Field>
                    <Field label="State / Province *" error={errors.province}>
                      <input name="province" value={shipping.province} onChange={handleShippingChange}
                        placeholder="CA" className={inputClass} />
                    </Field>
                    <Field label="ZIP / Postal Code *" error={errors.zip}>
                      <input name="zip" value={shipping.zip} onChange={handleShippingChange}
                        placeholder="94101" className={inputClass} />
                    </Field>
                    <Field label="Country">
                      <select name="country" value={shipping.country} onChange={handleShippingChange}
                        className={inputClass}>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="PH">Philippines</option>
                        <option value="AU">Australia</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    Payment Details
                  </h2>
                  <p className="text-sm text-neutral-400 mb-6">
                    🔒 This is a mock checkout — no real charge will be made.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Name on Card *" error={errors.cardName}>
                        <input name="cardName" value={payment.cardName} onChange={handlePaymentChange}
                          placeholder="Jane Doe" className={inputClass} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Card Number *" error={errors.cardNumber}>
                        <input name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456" className={inputClass} maxLength={19} />
                      </Field>
                    </div>
                    <Field label="Expiry (MM/YY) *" error={errors.expiry}>
                      <input name="expiry" value={payment.expiry} onChange={handlePaymentChange}
                        placeholder="MM/YY" className={inputClass} maxLength={5} />
                    </Field>
                    <Field label="CVV *" error={errors.cvv}>
                      <input name="cvv" value={payment.cvv} onChange={handlePaymentChange}
                        placeholder="123" className={inputClass} maxLength={4} />
                    </Field>
                  </div>

                  {/* Mock card helper */}
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-500 font-medium mb-1">
                      Use any test values:
                    </p>
                    <p className="text-xs text-neutral-400">
                      Card: 4242 4242 4242 4242 · Exp: 12/28 · CVV: 123
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping summary */}
                  <div className="mb-5 p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-neutral-900">Shipping to</p>
                      <button
                        onClick={() => setStep(0)}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {shipping.firstName} {shipping.lastName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ""}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {shipping.city}, {shipping.province} {shipping.zip}, {shipping.country}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => {
                      const variant = item.product?.variants?.find((v) => v.id === item.variantId);
                      const price   = parseFloat(variant?.price || 0);
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                            {item.product?.images?.[0]?.src ? (
                              <img src={item.product.images[0].src}
                                   alt={item.product.title}
                                   className="w-full h-full object-cover" />
                            ) : <span className="text-xl flex items-center justify-center h-full">🛍️</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                              {item.product?.title}
                            </p>
                            <p className="text-xs text-neutral-400">
                              Qty: {item.quantity}
                              {variant?.title && variant.title !== "Default" && ` · ${variant.title}`}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900 shrink-0">
                            ${(price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    Back
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button variant="primary" fullWidth onClick={handleNext}>
                    Continue to {STEPS[step + 1]}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={placing}
                    onClick={handlePlaceOrder}
                  >
                    Place Order · ${total.toFixed(2)}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Summary sidebar ─────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-bold text-neutral-900 mb-4">
                Order Summary ({itemCount} items)
              </h3>
              <div className="space-y-3 text-sm text-neutral-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (9%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-neutral-100" />
                <div className="flex justify-between font-bold text-neutral-900 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Mini item list */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                {items.map((item) => {
                  const image = item.product?.images?.[0];
                  return (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                        {image?.src
                          ? <img src={image.src} alt="" className="w-full h-full object-cover" />
                          : <span className="flex items-center justify-center h-full text-xs">🛍️</span>
                        }
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-1 flex-1">
                        {item.product?.title}
                      </p>
                      <span className="text-xs font-medium text-neutral-900 shrink-0">
                        ×{item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;