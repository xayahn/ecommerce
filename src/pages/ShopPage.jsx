/**
 * ShopPage.jsx
 * Product grid with sidebar filters, search, sort, and pagination.
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams }                  from "react-router-dom";
import { HiFilter, HiX, HiSearch }         from "react-icons/hi";
import ProductCard                          from "../components/ProductCard";
import FilterSidebar                        from "../components/FilterSidebar";
import useProducts                          from "../hooks/useProducts";
import useDebounce                          from "../hooks/useDebounce";
import { productService }                  from "../services/productService";
import clsx                                from "clsx";
import SEO                                 from "../components/SEO";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync URL params → initial filter state
  const initialCollection = searchParams.get("collection") || undefined;
  const initialSearch      = searchParams.get("search")     || "";

  const {
    products, pagination, isLoading, error,
    params, setCollection, setSearch, setSortBy, goToPage,
  } = useProducts({ collection: initialCollection, search: initialSearch || undefined });

  const [collections,    setCollections   ] = useState([]);
  const [searchInput,    setSearchInput   ] = useState(initialSearch);
  const [sidebarOpen,    setSidebarOpen   ] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 450);

  // Fetch collections for sidebar
  useEffect(() => {
    productService.getCollections().then(setCollections).catch(() => {});
  }, []);

  // Sync debounced search → products
  useEffect(() => {
    setSearch(debouncedSearch || undefined);
  }, [debouncedSearch]); // eslint-disable-line

  // Sync collection param changes from URL
  useEffect(() => {
    const col = searchParams.get("collection");
    if (col !== (params.collection || null)) {
      setCollection(col || undefined);
    }
  }, [searchParams]); // eslint-disable-line

  const handleCollectionChange = useCallback((handle) => {
    setCollection(handle);
    setSidebarOpen(false);
    if (handle) {
      setSearchParams({ collection: handle });
    } else {
      setSearchParams({});
    }
  }, [setCollection, setSearchParams]);

  const handleSortChange = useCallback((sortBy) => {
    setSortBy(sortBy);
  }, [setSortBy]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO
        title="Shop All Products"
        description="Browse our full collection of electronics, fashion, home goods, sports gear, beauty products and books."
        url="/shop"
      />
      {/* Page header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            {params.collection
              ? collections.find((c) => c.handle === params.collection)?.title || "Collection"
              : "All Products"}
          </h1>
          {pagination && (
            <p className="text-sm text-neutral-400 mt-1">
              {pagination.total} product{pagination.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar (desktop) ────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                collections={collections}
                activeCollection={params.collection}
                activeSortBy={params.sortBy}
                onCollectionChange={handleCollectionChange}
                onSortChange={handleSortChange}
              />
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                     w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl
                             text-sm bg-white focus:outline-none focus:ring-2
                             focus:ring-brand-500 focus:border-transparent"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400
                               hover:text-neutral-700"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-neutral-200
                           rounded-xl text-sm font-medium bg-white hover:bg-neutral-50 transition"
              >
                <HiFilter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Active filters */}
            {(params.collection || params.search) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-neutral-500">Active:</span>
                {params.collection && (
                  <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700
                                   text-xs px-2.5 py-1 rounded-full font-medium">
                    {collections.find((c) => c.handle === params.collection)?.title || params.collection}
                    <button onClick={() => handleCollectionChange(undefined)}>
                      <HiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {params.search && (
                  <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700
                                   text-xs px-2.5 py-1 rounded-full font-medium">
                    "{params.search}"
                    <button onClick={() => { setSearchInput(""); setSearch(undefined); }}>
                      <HiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20">
                <span className="text-5xl mb-4 block">⚠️</span>
                <p className="text-neutral-600">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No products found
                </h3>
                <p className="text-neutral-500 text-sm">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <ProductCard key={i} isLoading />)
                : products.map((p) => <ProductCard key={p.id} product={p} />)
              }
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium
                             hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={clsx(
                      "w-9 h-9 rounded-lg text-sm font-medium transition",
                      p === pagination.page
                        ? "bg-brand-600 text-white"
                        : "border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    )}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium
                             hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6
                          shadow-modal overflow-y-auto animate-slide-up">
            <FilterSidebar
              isMobile
              collections={collections}
              activeCollection={params.collection}
              activeSortBy={params.sortBy}
              onCollectionChange={handleCollectionChange}
              onSortChange={handleSortChange}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;