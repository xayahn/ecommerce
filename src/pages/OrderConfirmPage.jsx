/**
 * OrderConfirmPage.jsx
 * Success page shown after a completed order.
 */

import { useEffect, useState }  from "react";
import { useParams, Link }      from "react-router-dom";
import { HiCheckCircle,
         HiArrowRight }         from "react-icons/hi";
import Button                   from "../components/Button";
import { orderService }         from "../services/orderService";
import Spinner                  from "../components/Spinner";
import SEO                      from "../components/SEO";

const OrderConfirmPage = () => {
  const { id }                    = useParams();
  const [order,     setOrder    ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError    ] = useState(null);

  useEffect(() => {
    orderService.getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-4">⚠️</span>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Order Not Found</h2>
        <p className="text-neutral-500 mb-6">{error}</p>
        <Link to="/shop"><Button variant="primary">Continue Shopping</Button></Link>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4">
      <SEO title={`Order #${order.orderNumber} Confirmed`} noIndex />
      <div className="max-w-2xl mx-auto">

        {/* Success header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20
                          bg-green-100 rounded-full mb-4">
            <HiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-neutral-500">
            Thank you for your purchase. We'll send a confirmation to{" "}
            <span className="font-medium text-neutral-700">{order.email}</span>
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">

          {/* Order meta */}
          <div className="bg-brand-50 border-b border-brand-100 px-6 py-4
                          flex flex-wrap gap-4 justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Order Number</p>
              <p className="font-bold text-neutral-900">#{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Date</p>
              <p className="font-semibold text-neutral-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Status</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs
                               font-semibold px-2.5 py-1 rounded-full">
                {order.financialStatus}
              </span>
            </div>
          </div>

          {/* Line items */}
          <div className="divide-y divide-neutral-50 px-6">
            {order.lineItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm line-clamp-1">
                    {item.title}
                  </p>
                  {item.variantTitle && item.variantTitle !== "Default" && (
                    <p className="text-xs text-neutral-400">{item.variantTitle}</p>
                  )}
                  <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-neutral-900 text-sm shrink-0">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-neutral-100 px-6 py-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>${parseFloat(order.subtotalPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Tax</span>
              <span>${parseFloat(order.totalTax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 text-base pt-1">
              <span>Total</span>
              <span>${parseFloat(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {address && (
          <div className="bg-white rounded-2xl shadow-card px-6 py-5 mb-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Shipping Address</h3>
            <div className="text-sm text-neutral-600 space-y-0.5">
              <p>{address.firstName} {address.lastName}</p>
              <p>{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
              <p>{address.city}, {address.province} {address.zip}</p>
              <p>{address.country}</p>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/shop" className="flex-1">
            <Button variant="primary" fullWidth size="lg">
              Continue Shopping <HiArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/orders" className="flex-1">
            <Button variant="outline" fullWidth size="lg">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;