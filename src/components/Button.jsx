/**
 * Button.jsx
 * Production-polished button with micro-interactions.
 */

import clsx    from "clsx";
import Spinner from "./Spinner";

const Button = ({
  variant   = "primary",
  size      = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...rest
}) => {
  const base = [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "rounded-xl transition-all duration-200 select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
  ];

  const variants = {
    primary: [
      "bg-brand-600 text-white shadow-sm shadow-brand-200",
      "hover:bg-brand-700 hover:shadow-md hover:shadow-brand-200",
      "focus-visible:ring-brand-500",
    ],
    secondary: [
      "bg-neutral-900 text-white shadow-sm",
      "hover:bg-neutral-700 hover:shadow-md",
      "focus-visible:ring-neutral-500",
    ],
    outline: [
      "border-2 border-brand-600 text-brand-600 bg-transparent",
      "hover:bg-brand-600 hover:text-white",
      "focus-visible:ring-brand-500",
    ],
    ghost: [
      "text-neutral-700 bg-transparent",
      "hover:bg-neutral-100 hover:text-neutral-900",
      "focus-visible:ring-neutral-300",
    ],
    danger: [
      "bg-red-600 text-white shadow-sm shadow-red-200",
      "hover:bg-red-700 hover:shadow-md hover:shadow-red-200",
      "focus-visible:ring-red-500",
    ],
  };

  const sizes = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const spinnerColor = (variant === "outline" || variant === "ghost")
    ? "brand-600"
    : "white";

  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" color={spinnerColor} />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {leftIcon  && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;