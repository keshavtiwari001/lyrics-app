import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

// =============================================================================
// Button Component
//
// WHY A CUSTOM BUTTON:
// Consistent interactive element styling across the app.
// Centralises focus rings, disabled states, and size variants so every button
// passes accessibility checks without repeating classes in each component.
// =============================================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-glow-sm hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-400",
  secondary:
    "border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-muted))] disabled:opacity-50",
  ghost:
    "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-muted))] hover:text-[rgb(var(--color-text-primary))] disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-xs font-medium",
  md: "h-10 gap-2 rounded-xl px-4 text-sm font-medium",
  lg: "h-12 gap-2.5 rounded-xl px-6 text-base font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
