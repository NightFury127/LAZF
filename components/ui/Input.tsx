"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-700 bg-gray-900/70 backdrop-blur-sm focus-visible:border-neon-blue-600 focus-visible:ring-2 focus-visible:ring-neon-blue-600/20 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
        error:
          "border-red-500 bg-red-950/20 backdrop-blur-sm focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
        "neon-blue":
          "border-neon-blue-800 bg-neon-blue-950/20 backdrop-blur-sm text-neon-blue-300 placeholder:text-neon-blue-700 focus-visible:border-neon-blue-600 focus-visible:ring-2 focus-visible:ring-neon-blue-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
        "neon-purple":
          "border-neon-purple-800 bg-neon-purple-950/20 backdrop-blur-sm text-neon-purple-300 placeholder:text-neon-purple-700 focus-visible:border-neon-purple-600 focus-visible:ring-2 focus-visible:ring-neon-purple-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
        "neon-green":
          "border-neon-green-800 bg-neon-green-950/20 backdrop-blur-sm text-neon-green-300 placeholder:text-neon-green-700 focus-visible:border-neon-green-600 focus-visible:ring-2 focus-visible:ring-neon-green-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  withGlow?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, withGlow = false, ...props }, ref) => {
    const glowStyles = {
      default: withGlow
        ? "shadow-neon-blue/20 focus-visible:shadow-neon-blue/40"
        : "",
      error: withGlow
        ? "shadow-red-500/20 focus-visible:shadow-red-500/40"
        : "",
      "neon-blue": withGlow
        ? "shadow-neon-blue/20 focus-visible:shadow-neon-blue/40"
        : "",
      "neon-purple": withGlow
        ? "shadow-neon-purple/20 focus-visible:shadow-neon-purple/40"
        : "",
      "neon-green": withGlow
        ? "shadow-neon-green/20 focus-visible:shadow-neon-green/40"
        : "",
    };

    return (
      <div className="space-y-1">
        <input
          className={cn(
            inputVariants({
              variant: error ? "error" : variant,
              size,
              className,
            }),
            withGlow && variant && glowStyles[variant]
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
