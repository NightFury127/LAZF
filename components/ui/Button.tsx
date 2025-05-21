"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "neon-blue"
    | "neon-purple"
    | "neon-green";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  fullWidth?: boolean;
  withRing?: boolean;
  withGlow?: boolean;
  withIcon?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  withRing = true,
  withGlow = false,
  withIcon = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
    "focus-visible:outline-none",
    withRing &&
      "focus-visible:ring-2 focus-visible:ring-neon-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
  );

  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-neon-blue-600 to-neon-purple-600 text-white",
      "hover:from-neon-blue-500 hover:to-neon-purple-500",
      "disabled:from-neon-blue-800 disabled:to-neon-purple-800 disabled:text-white/50",
      withGlow && "shadow-neon-blue hover:shadow-neon-purple"
    ),
    secondary: cn(
      "bg-gray-800/80 backdrop-blur-sm text-white border border-gray-700",
      "hover:bg-gray-700/80 hover:border-gray-600",
      "disabled:bg-gray-800/50 disabled:text-white/50 disabled:border-gray-800",
      withGlow && "shadow-none hover:shadow-neon-blue/20"
    ),
    outline: cn(
      "border border-gray-700 text-white bg-transparent backdrop-blur-sm",
      "hover:bg-gray-800/50 hover:border-neon-blue-600/50",
      "disabled:bg-transparent disabled:text-white/50 disabled:border-gray-800",
      withGlow && "hover:shadow-neon-blue/20"
    ),
    ghost: cn(
      "text-white bg-transparent",
      "hover:bg-gray-800/50",
      "disabled:bg-transparent disabled:text-white/50",
      withGlow && "hover:shadow-neon-blue/10"
    ),
    danger: cn(
      "bg-red-600/80 text-white backdrop-blur-sm",
      "hover:bg-red-500/80",
      "disabled:bg-red-800/50 disabled:text-white/50",
      withGlow && "shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
    ),
    "neon-blue": cn(
      "border border-neon-blue-500 text-neon-blue-400 bg-neon-blue-950/30 backdrop-blur-sm",
      "hover:bg-neon-blue-900/30 hover:text-neon-blue-300 hover:border-neon-blue-400",
      "disabled:bg-transparent disabled:text-neon-blue-800 disabled:border-neon-blue-900",
      withGlow && "shadow-neon-blue hover:shadow-neon-blue"
    ),
    "neon-purple": cn(
      "border border-neon-purple-500 text-neon-purple-400 bg-neon-purple-950/30 backdrop-blur-sm",
      "hover:bg-neon-purple-900/30 hover:text-neon-purple-300 hover:border-neon-purple-400",
      "disabled:bg-transparent disabled:text-neon-purple-800 disabled:border-neon-purple-900",
      withGlow && "shadow-neon-purple hover:shadow-neon-purple"
    ),
    "neon-green": cn(
      "border border-neon-green-500 text-neon-green-400 bg-neon-green-950/30 backdrop-blur-sm",
      "hover:bg-neon-green-900/30 hover:text-neon-green-300 hover:border-neon-green-400",
      "disabled:bg-transparent disabled:text-neon-green-800 disabled:border-neon-green-900",
      withGlow && "shadow-neon-green hover:shadow-neon-green"
    ),
  };

  const sizeStyles = {
    xs: "text-xs px-2.5 py-1 rounded",
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
    xl: "text-lg px-6 py-3",
  };

  const widthStyles = fullWidth ? "w-full" : "";
  const iconStyles = withIcon ? "gap-2" : "";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        iconStyles,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
