/**
 * WishlistPage.jsx
 * Displays the user's saved wishlist items.
 */

import { Link }              from "react-router-dom";
import { HiHeart, HiTrash } from "react-icons/hi";
import Button                from "../components/Button";
import { useWishlist }       from "../context/WishlistContext";
import SEO                   from "../components/SEO";

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <SEO title="My Wishlist" url="/wishlist" noIndex />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-display font-bold text-neutral-900 mb-8">
          My Wishlist
          {items.length > 0 && (
            <span className="ml-2 text-base font-normal text-neutral-400">
              ({items.length} items)
            </span>
          )}
        </h1>

        {items.length === 0 && (
          <div className="text-center py-20">
            <HiHeart className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-neutral-500 mb-6">
              Save products you love by clicking the heart icon.
            </p>
            <Link to="/shop">
              <Button variant="primary">Explore Products</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id}
                 className="bg-white rounded-2xl shadow-card overflow-hidden group">
              <Link to={`/products/${item.handle}`} className="block">
                <div className="aspect-square overflow-hidden bg-neutral-100">
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt={item.imageAlt || item.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs text-neutral-400 font-medium uppercase mb-1">
                  {item.vendor}
                </p>
                <Link to={`/products/${item.handle}`}>
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2
                                 hover:text-brand-600 transition mb-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-base font-bold text-neutral-900 mb-3">
                  ${parseFloat(item.price).toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Link to={`/products/${item.handle}`} className="flex-1">
                    <Button variant="primary" fullWidth size="sm">View Product</Button>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-500
                               hover:bg-red-50 rounded-lg transition"
                    aria-label="Remove from wishlist"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;