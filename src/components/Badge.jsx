/**
 * Badge.jsx
 * Small label for status, tags, discounts, categories.
 */

import clsx from "clsx";

/**
 * @param {{
 *   variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral',
 *   size?:    'sm' | 'md',
 *   dot?:     boolean,
 *   children: React.ReactNode,
 * }} props
 */
const Badge = ({
  variant  = "brand",
  size     = "md",
  dot      = false,
  children,
  className = "",
}) => {
  const variants = {
    brand:   "bg-brand-100 text-brand-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger:  "bg-red-100 text-red-700",
    neutral: "bg-neutral-100 text-neutral-600",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const dotColors = {
    brand:   "bg-brand-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger:  "bg-red-500",
    neutral: "bg-neutral-400",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
};

export default Badge;