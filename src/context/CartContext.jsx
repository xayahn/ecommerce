/**
 * CartContext.jsx
 * Global cart state using Context + useReducer.
 * Syncs with backend via cartService.
 * Cart token is persisted in localStorage.
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { cartService } from "../services/cartService";
import toast from "react-hot-toast";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  cart:       null,   // full cart object from API
  items:      [],     // cart.items shortcut
  itemCount:  0,      // total quantity of all items
  subtotal:   0,      // calculated subtotal
  isLoading:  false,
  isOpen:     false,  // cart drawer open/close
  error:      null,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const CART_ACTIONS = {
  SET_LOADING:  "SET_LOADING",
  SET_CART:     "SET_CART",
  SET_ERROR:    "SET_ERROR",
  TOGGLE_DRAWER:"TOGGLE_DRAWER",
  OPEN_DRAWER:  "OPEN_DRAWER",
  CLOSE_DRAWER: "CLOSE_DRAWER",
  CLEAR:        "CLEAR",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcItemCount = (items = []) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

const calcSubtotal = (items = []) =>
  items.reduce((sum, i) => {
    const variant = i.product?.variants?.find((v) => v.id === i.variantId);
    const price   = parseFloat(variant?.price || 0);
    return sum + price * i.quantity;
  }, 0);

// ─── Reducer ──────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case CART_ACTIONS.SET_CART: {
      const items     = action.payload?.items || [];
      const itemCount = calcItemCount(items);
      const subtotal  = calcSubtotal(items);
      return {
        ...state,
        cart:      action.payload,
        items,
        itemCount,
        subtotal,
        isLoading: false,
        error:     null,
      };
    }

    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case CART_ACTIONS.TOGGLE_DRAWER:
      return { ...state, isOpen: !state.isOpen };

    case CART_ACTIONS.OPEN_DRAWER:
      return { ...state, isOpen: true };

    case CART_ACTIONS.CLOSE_DRAWER:
      return { ...state, isOpen: false };

    case CART_ACTIONS.CLEAR:
      return { ...initialState };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * On mount: load existing cart from token,
   * or create a new one if no token exists.
   */
  useEffect(() => {
    const initCart = async () => {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      try {
        const token = localStorage.getItem("cart_token");
        if (token) {
          const cart = await cartService.getCart();
          dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
        } else {
          const cart = await cartService.createCart();
          dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
        }
      } catch {
        // Token stale — create a fresh cart
        try {
          localStorage.removeItem("cart_token");
          const cart = await cartService.createCart();
          dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
        } catch (err) {
          dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message });
        }
      }
    };

    initCart();
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const addToCart = useCallback(
    async (productId, variantId, quantity = 1, productTitle = "") => {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      try {
        const token = localStorage.getItem("cart_token");
        const cart  = await cartService.addItem(token, productId, variantId, quantity);
        dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
        dispatch({ type: CART_ACTIONS.OPEN_DRAWER });
        toast.success(`${productTitle || "Item"} added to cart!`);
      } catch (err) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message });
        toast.error(err.message || "Failed to add item");
      }
    },
    []
  );

  const updateQuantity = useCallback(async (variantId, quantity) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      const token = localStorage.getItem("cart_token");
      const cart  = await cartService.updateItem(token, variantId, quantity);
      dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message });
      toast.error("Failed to update quantity");
    }
  }, []);

  const removeFromCart = useCallback(async (variantId) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      const cart = await cartService.removeItem(variantId);
      dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
      toast.success("Item removed from cart");
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message });
      toast.error("Failed to remove item");
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: CART_ACTIONS.CLEAR });
      // Re-initialize a fresh cart
      const cart = await cartService.createCart();
      dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  }, []);

  const toggleDrawer  = useCallback(() => dispatch({ type: CART_ACTIONS.TOGGLE_DRAWER }), []);
  const openDrawer    = useCallback(() => dispatch({ type: CART_ACTIONS.OPEN_DRAWER }),   []);
  const closeDrawer   = useCallback(() => dispatch({ type: CART_ACTIONS.CLOSE_DRAWER }),  []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
};