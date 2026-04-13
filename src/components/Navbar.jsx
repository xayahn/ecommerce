/**
 * Navbar.jsx
 * Polished sticky navbar with glass morphism, smooth search, and refined interactions.
 */

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HiShoppingCart, HiHeart, HiUser,
  HiMenu, HiX, HiSearch,
} from "react-icons/hi";
import clsx       from "clsx";
import useCart    from "../hooks/useCart";
import { useAuth }     from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const NAV_LINKS = [
  { label: "Home",  to: "/"      },
  { label: "Shop",  to: "/shop"  },
];

const Navbar = () => {
  const { itemCount, openDrawer }              = useCart();
  const { isAuthenticated, user, logout }      = useAuth();
  const { itemCount: wishCount }               = useWishlist();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [mobileOpen,   setMobileOpen  ] = useState(false);
  const [scrolled,     setScrolled    ] = useState(false);
  const [searchOpen,   setSearchOpen  ] = useState(false);
  const [searchQuery,  setSearchQuery ] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef  = useRef(null);
  const userMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const IconButton = ({ onClick, label, children, badge }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative p-2.5 rounded-xl text-neutral-600 hover:text-brand-600
                 hover:bg-brand-50 transition-all duration-200 active:scale-95"
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                         bg-brand-600 text-white text-[10px] font-bold rounded-full
                         flex items-center justify-center leading-none
                         ring-2 ring-white animate-bounce-once">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100/80"
            : "bg-white"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500
                              to-brand-700 flex items-center justify-center
                              shadow-md shadow-brand-200 group-hover:scale-110
                              transition-transform duration-200">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-xl font-display font-bold text-neutral-900
                               group-hover:text-brand-600 transition-colors duration-200">
                ShopStore
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    clsx(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-brand-600 bg-brand-50 font-semibold"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5">

              {/* Search toggle */}
              <IconButton
                onClick={() => setSearchOpen((v) => !v)}
                label="Search"
              >
                {searchOpen
                  ? <HiX className="w-5 h-5" />
                  : <HiSearch className="w-5 h-5" />
                }
              </IconButton>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative p-2.5 rounded-xl text-neutral-600 hover:text-brand-600
                           hover:bg-brand-50 transition-all duration-200 active:scale-95"
              >
                <HiHeart className="w-5 h-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                                   bg-brand-600 text-white text-[10px] font-bold rounded-full
                                   flex items-center justify-center ring-2 ring-white">
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <IconButton onClick={openDrawer} label="Cart" badge={itemCount}>
                <HiShoppingCart className="w-5 h-5" />
              </IconButton>

              {/* User menu — desktop */}
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium",
                    "transition-all duration-200 active:scale-95",
                    isAuthenticated
                      ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                  aria-label="User menu"
                >
                  <div className={clsx(
                    "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs",
                    isAuthenticated
                      ? "bg-brand-600 text-white"
                      : "bg-neutral-200 text-neutral-500"
                  )}>
                    {isAuthenticated
                      ? user?.firstName?.[0]?.toUpperCase()
                      : <HiUser className="w-4 h-4" />
                    }
                  </div>
                  {isAuthenticated && (
                    <span className="max-w-[72px] truncate text-brand-700">
                      {user?.firstName}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white
                                  rounded-2xl shadow-modal border border-neutral-100
                                  py-2 animate-slide-up z-50 overflow-hidden">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-neutral-100 mb-1">
                          <p className="text-xs text-neutral-400">Signed in as</p>
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-neutral-700 hover:bg-neutral-50 hover:text-brand-600
                                     transition-colors"
                        >
                          📦 My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-neutral-700 hover:bg-neutral-50 hover:text-brand-600
                                     transition-colors"
                        >
                          💜 Wishlist
                        </Link>
                        <hr className="my-1 border-neutral-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5
                                     text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          🚪 Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-neutral-700 hover:bg-neutral-50 hover:text-brand-600
                                     transition-colors"
                        >
                          🔑 Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-neutral-700 hover:bg-neutral-50 hover:text-brand-600
                                     transition-colors"
                        >
                          ✨ Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2.5 rounded-xl text-neutral-600
                           hover:bg-neutral-100 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <HiX className="w-5 h-5" />
                  : <HiMenu className="w-5 h-5" />
                }
              </button>
            </div>
          </div>

          {/* ── Search bar ────────────────────────────────────────────────── */}
          <div className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            searchOpen ? "max-h-20 pb-3 opacity-100" : "max-h-0 opacity-0"
          )}>
            <form onSubmit={handleSearch} className="relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories…"
                className="w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200
                           rounded-xl text-sm focus:outline-none focus:ring-2
                           focus:ring-brand-500 focus:border-transparent
                           focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-neutral-400 hover:text-neutral-700"
                >
                  <HiX className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────────────────── */}
        <div className={clsx(
          "md:hidden border-t border-neutral-100 bg-white overflow-hidden",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition",
                    isActive
                      ? "text-brand-600 bg-brand-50 font-semibold"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            <hr className="border-neutral-100 my-2" />

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs text-neutral-400">Signed in as</p>
                  <p className="text-sm font-semibold text-neutral-900">{user?.email}</p>
                </div>
                <Link to="/orders"
                  className="flex items-center gap-3 px-4 py-3 text-sm
                             text-neutral-700 hover:bg-neutral-50 rounded-xl transition">
                  📦 My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3
                             text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm
                             text-neutral-700 hover:bg-neutral-50 rounded-xl transition">
                  🔑 Sign In
                </Link>
                <Link to="/register"
                  className="flex items-center gap-3 px-4 py-3 text-sm
                             text-neutral-700 hover:bg-neutral-50 rounded-xl transition">
                  ✨ Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;