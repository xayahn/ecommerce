/**
 * WishlistContext.jsx
 * Wishlist state persisted to localStorage.
 * No backend call needed — fully client-side for now.
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "shopstore_wishlist";

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full — fail silently
  }
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  items: loadFromStorage(), // [{ id, title, handle, price, imageSrc, addedAt }]
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const WISHLIST_ACTIONS = {
  ADD:    "ADD",
  REMOVE: "REMOVE",
  CLEAR:  "CLEAR",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD: {
      const already = state.items.find((i) => i.id === action.payload.id);
      if (already) return state;
      const updated = [...state.items, { ...action.payload, addedAt: new Date().toISOString() }];
      saveToStorage(updated);
      return { items: updated };
    }

    case WISHLIST_ACTIONS.REMOVE: {
      const updated = state.items.filter((i) => i.id !== action.payload);
      saveToStorage(updated);
      return { items: updated };
    }

    case WISHLIST_ACTIONS.CLEAR:
      saveToStorage([]);
      return { items: [] };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const WishlistContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addToWishlist = useCallback((product) => {
    const already = state.items.find((i) => i.id === product.id);
    if (already) {
      toast("Already in your wishlist", { icon: "💜" });
      return;
    }
    dispatch({ type: WISHLIST_ACTIONS.ADD, payload: product });
    toast.success(`${product.title} added to wishlist!`);
  }, [state.items]);

  const removeFromWishlist = useCallback((productId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE, payload: productId });
    toast.success("Removed from wishlist");
  }, []);

  const toggleWishlist = useCallback((product) => {
    const inList = state.items.find((i) => i.id === product.id);
    if (inList) {
      dispatch({ type: WISHLIST_ACTIONS.REMOVE, payload: product.id });
      toast.success("Removed from wishlist");
    } else {
      dispatch({ type: WISHLIST_ACTIONS.ADD, payload: product });
      toast.success(`${product.title} added to wishlist!`);
    }
  }, [state.items]);

  const isInWishlist = useCallback(
    (productId) => state.items.some((i) => i.id === productId),
    [state.items]
  );

  const clearWishlist = useCallback(() => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items:             state.items,
        itemCount:         state.items.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
};