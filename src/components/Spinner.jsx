/**
 * Spinner.jsx
 * Reusable loading spinner component.
 */

import clsx from "clsx";

/**
 * @param {{ size?: 'sm' | 'md' | 'lg', color?: string, className?: string }} props
 */
const Spinner = ({ size = "md", color = "brand-600", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        "rounded-full animate-spin",
        `border-${color} border-t-transparent`,
        sizes[size],
        className
      )}
    />
  );
};

export default Spinner;