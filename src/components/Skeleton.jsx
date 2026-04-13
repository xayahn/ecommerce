/**
 * Skeleton.jsx
 * Reusable shimmer skeleton primitives.
 * Compose these to build page-level loading skeletons.
 */

import clsx from "clsx";

// ─── Base shimmer ──────────────────────────────────────────────────────────────
export const Skeleton = ({ className = "" }) => (
  <div
    className={clsx(
      "animate-pulse bg-neutral-200 rounded-lg",
      className
    )}
  />
);

// ─── Product card skeleton ─────────────────────────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    <Skeleton className="aspect-square rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-9 w-full mt-2" />
    </div>
  </div>
);

// ─── Product grid skeleton ─────────────────────────────────────────────────────
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Product detail skeleton ───────────────────────────────────────────────────
export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    {/* Breadcrumb */}
    <div className="flex gap-2 mb-8">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-32" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image */}
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-16 h-16 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Collection card skeleton ──────────────────────────────────────────────────
export const CollectionGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-2xl" />
    ))}
  </div>
);

// ─── Order card skeleton ───────────────────────────────────────────────────────
export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

// ─── Text line skeletons ───────────────────────────────────────────────────────
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx(
          "h-4",
          i === lines - 1 ? "w-2/3" : "w-full"
        )}
      />
    ))}
  </div>
);

export default Skeleton;