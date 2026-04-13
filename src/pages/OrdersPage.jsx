/**
 * OrdersPage.jsx
 * Displays authenticated user's order history.
 * Bug fixed: orders now load correctly after checkout.
 */

import { useEffect, useState } from "react";
import { Link }                from "react-router-dom";
import { HiShoppingBag,
         HiChevronRight,
         HiClock }             from "react-icons/hi";
import SEO                     from "../components/SEO";
import Button                  from "../components/Button";
import Badge                   from "../components/Badge";
import { OrderCardSkeleton }   from "../components/Skeleton";
import { Skeleton }            from "../components/Skeleton";
import { orderService }        from "../services/orderService";

const STATUS_VARIANT = {
  PENDING:    "warning",
  PROCESSING: "brand",
  SHIPPED:    "brand",
  DELIVERED:  "success",
  CANCELLED:  "danger",
  REFUNDED:   "neutral",
};

const STATUS_LABEL = {
  PENDING:    "Pending",
  PROCESSING: "Processing",
  SHIPPED:    "Shipped",
  DELIVERED:  "Delivered",
  CANCELLED:  "Cancelled",
  REFUNDED:   "Refunded",
};

const OrdersPage = () => {
  const [orders,    setOrders   ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError    ] = useState(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-36 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <SEO title="My Orders" url="/orders" noIndex />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-900">
              My Orders
            </h1>
            {!isLoading && orders.length > 0 && (
              <p className="text-sm text-neutral-400 mt-0.5">
                {orders.length} order{orders.length !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
          <Link to="/shop">
            <Button variant="outline" size="sm">Shop More</Button>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">⚠️</span>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="bg-white rounded-3xl shadow-card text-center py-20 px-8">
            <div className="w-24 h-24 bg-neutral-50 rounded-3xl flex items-center
                            justify-center border-2 border-dashed border-neutral-200
                            mx-auto mb-6">
              <HiShoppingBag className="w-10 h-10 text-neutral-300" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              No orders yet
            </h3>
            <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
              When you place your first order, it will show up here.
              Ready to start shopping?
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Explore Products
              </Button>
            </Link>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            });
            const total = parseFloat(order.totalPrice).toFixed(2);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden
                           hover:shadow-card-hover transition-all duration-300
                           group"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3
                                px-6 py-4 border-b border-neutral-50
                                bg-neutral-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center
                                    justify-center shrink-0">
                      <HiShoppingBag className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        Order #{order.orderNumber}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <HiClock className="w-3 h-3 text-neutral-400" />
                        <p className="text-xs text-neutral-400">{date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <Badge
                      variant={STATUS_VARIANT[order.status] || "neutral"}
                      dot
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </Badge>
                    <span className="text-base font-bold text-neutral-900">
                      ${total}
                    </span>
                  </div>
                </div>

                {/* Items preview + action */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  {/* Thumbnail stack */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.lineItems?.slice(0, 4).map((item, i) => (
                        <div
                          key={item.id || i}
                          className="w-11 h-11 rounded-xl border-2 border-white
                                     overflow-hidden bg-neutral-100 shadow-sm"
                          title={item.title}
                        >
                          {item.imageSrc ? (
                            <img
                              src={item.imageSrc}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-base">🛍️</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {(order.lineItems?.length || 0) > 4 && (
                        <div className="w-11 h-11 rounded-xl border-2 border-white
                                        bg-neutral-100 shadow-sm flex items-center justify-center">
                          <span className="text-xs font-semibold text-neutral-500">
                            +{order.lineItems.length - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400">
                      {order.lineItems?.length} item{order.lineItems?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* View button */}
                  <Link to={`/order-confirmation/${order.id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm
                                       font-semibold text-brand-600 bg-brand-50
                                       hover:bg-brand-100 rounded-xl transition-all
                                       duration-200 group-hover:gap-2.5 active:scale-95">
                      View Order
                      <HiChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;