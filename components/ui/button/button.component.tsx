import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { forwardRef, memo, useMemo } from "react";
import React from "react";

/* =========================
   Types
   ========================= */
type ButtonVariant = "primary" | "danger" | "warning" | "success" | "default";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

/* =========================
   Static class maps (styling unchanged)
   ========================= */
const BASE_CLASSES = [
  "relative inline-flex items-center justify-center",
  "font-medium rounded-lg transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "active:scale-[0.98] disabled:cursor-not-allowed",
  "overflow-hidden group cursor-pointer",
] as const;

const VARIANTS: Record<ButtonVariant, string[]> = {
  primary: [
    "bg-gradient-to-r from-blue-600 to-blue-700",
    "hover:from-blue-700 hover:to-blue-800",
    "text-white shadow-lg shadow-blue-500/25",
    "focus:ring-blue-500 border border-blue-500/20",
    "disabled:from-blue-400 disabled:to-blue-400 disabled:shadow-none",
  ],
  danger: [
    "bg-gradient-to-r from-red-600 to-red-700",
    "hover:from-red-700 hover:to-red-800",
    "text-white shadow-lg shadow-red-500/25",
    "focus:ring-red-500 border border-red-500/20",
    "disabled:from-red-400 disabled:to-red-400 disabled:shadow-none",
  ],
  warning: [
    "bg-gradient-to-r from-amber-500 to-orange-600",
    "hover:from-amber-600 hover:to-orange-700",
    "text-white shadow-lg shadow-amber-500/25",
    "focus:ring-amber-500 border border-amber-400/20",
    "disabled:from-amber-300 disabled:to-orange-300 disabled:shadow-none",
  ],
  success: [
    "bg-gradient-to-r from-emerald-600 to-green-700",
    "hover:from-emerald-700 hover:to-green-800",
    "text-white shadow-lg shadow-emerald-500/25",
    "focus:ring-emerald-500 border border-emerald-500/20",
    "disabled:from-emerald-400 disabled:to-green-400 disabled:shadow-none",
  ],
  default: [
    "bg-gradient-to-r from-blue-600 to-blue-700",
    "hover:from-blue-700 hover:to-blue-800",
    "text-white shadow-lg shadow-blue-500/25",
    "focus:ring-blue-500 border border-blue-500/20",
    "disabled:from-blue-400 disabled:to-blue-400 disabled:shadow-none",
  ],
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const SIZE_GAPS: Record<ButtonSize, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

/* =========================
   Tiny subcomponents
   ========================= */
const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <motion.div
      className="border-2 border-white/30 border-t-white rounded-full w-4 h-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    />
  );
});

/* =========================
   Helpers
   ========================= */
const shimmerVariants = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
};

function contentGap(size: ButtonSize) {
  return SIZE_GAPS[size];
}

/* =========================
   Component
   ========================= */
const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      type = "button", // safer default for buttons inside forms
      ...props
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    // Precompute classes so React devtools are cleaner and rerenders cheaper
    const classes = useMemo(
      () =>
        cn(
          BASE_CLASSES,
          VARIANTS[variant],
          SIZES[size],
          disabled || loading ? "opacity-60" : "",
          className
        ),
      [className, disabled, loading, size, variant]
    );

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        data-variant={variant}
        data-size={size}
        type={type}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        // keep the same interaction feel, but respect reduced motion
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        {...props}>
        {/* Shimmer effect (unchanged visuals) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          whileHover="animate"
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Icon + text */}
        <div
          className={cn(
            "relative flex justify-center items-center leading-none",
            contentGap(size)
          )}>
          {loading && <LoadingSpinner />}

          {!loading && icon && iconPosition === "right" && (
            <span
              className={cn("flex flex-shrink-0 justify-center items-center", contentGap(size))}>
              {icon}
            </span>
          )}

          <span className={cn("flex items-center", loading ? "opacity-0" : "opacity-100")}>
            {children}
          </span>

          {!loading && icon && iconPosition === "left" && (
            <span
              className={cn("flex flex-shrink-0 justify-center items-center", contentGap(size))}>
              {icon}
            </span>
          )}
        </div>

        {/* Ripple sweep (unchanged visuals) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-out" />
      </motion.button>
    );
  }
);

ButtonComponent.displayName = "ButtonComponent";

export { ButtonComponent };
export type { ButtonProps, ButtonVariant, ButtonSize };
