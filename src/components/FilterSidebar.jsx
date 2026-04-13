/**
 * FilterSidebar.jsx
 * Shop page sidebar with collection, price range, and sort filters.
 */

import { useState }    from "react";
import { HiChevronDown, HiX } from "react-icons/hi";
import clsx            from "clsx";

const SORT_OPTIONS = [
  { label: "Newest",         value: "createdAt"  },
  { label: "Price: Low–High",value: "price_asc"  },
  { label: "Price: High–Low",value: "price_desc" },
  { label: "Name A–Z",       value: "title"      },
];

const PRICE_RANGES = [
  { label: "All prices",   min: 0,    max: Infinity },
  { label: "Under $50",    min: 0,    max: 50       },
  { label: "$50 – $100",   min: 50,   max: 100      },
  { label: "$100 – $300",  min: 100,  max: 300      },
  { label: "Over $300",    min: 300,  max: Infinity },
];

/**
 * @param {{
 *   collections:       Array<{id, title, handle}>,
 *   activeCollection?: string,
 *   activeSortBy:      string,
 *   onCollectionChange: function,
 *   onSortChange:       function,
 *   onClose?:           function,  // mobile close
 *   isMobile?:          boolean,
 * }} props
 */
const FilterSidebar = ({
  collections       = [],
  activeCollection,
  activeSortBy      = "createdAt",
  onCollectionChange,
  onSortChange,
  onClose,
  isMobile          = false,
}) => {
  const [openSections, setOpenSections] = useState({
    collections: true,
    sort:        true,
    price:       true,
  });

  const toggle = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const Section = ({ id, title, children }) => (
    <div className="border-b border-neutral-100 pb-4 mb-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-1 text-sm font-semibold
                   text-neutral-900 hover:text-brand-600 transition"
      >
        {title}
        <HiChevronDown
          className={clsx(
            "w-4 h-4 transition-transform duration-200",
            openSections[id] && "rotate-180"
          )}
        />
      </button>
      {openSections[id] && (
        <div className="mt-3 space-y-1 animate-fade-in">{children}</div>
      )}
    </div>
  );

  return (
    <aside className="w-full">
      {/* Header (mobile only) */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {!isMobile && (
        <h2 className="text-base font-bold text-neutral-900 mb-5">Filters</h2>
      )}

      {/* Collections */}
      <Section id="collections" title="Category">
        <button
          onClick={() => onCollectionChange(undefined)}
          className={clsx(
            "w-full text-left px-3 py-1.5 rounded-lg text-sm transition",
            !activeCollection
              ? "bg-brand-50 text-brand-700 font-semibold"
              : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          All Products
        </button>
        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => onCollectionChange(col.handle)}
            className={clsx(
              "w-full text-left px-3 py-1.5 rounded-lg text-sm transition",
              activeCollection === col.handle
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            {col.title}
          </button>
        ))}
      </Section>

      {/* Sort */}
      <Section id="sort" title="Sort By">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={clsx(
              "w-full text-left px-3 py-1.5 rounded-lg text-sm transition",
              activeSortBy === opt.value
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </Section>

      {/* Price Range (UI only — extend in Phase 6 if needed) */}
      <Section id="price" title="Price Range">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.label}
            className="w-full text-left px-3 py-1.5 rounded-lg text-sm
                       text-neutral-600 hover:bg-neutral-50 transition"
          >
            {range.label}
          </button>
        ))}
      </Section>

      {/* Clear filters */}
      {activeCollection && (
        <button
          onClick={() => { onCollectionChange(undefined); onSortChange("createdAt"); }}
          className="w-full text-sm text-brand-600 font-medium hover:underline mt-2"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
};

export default FilterSidebar;