"use client";

import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animate?: boolean;
  variant?: "default" | "glass" | "neon-blue" | "neon-purple" | "neon-green";
  withHover?: boolean;
  withGlow?: boolean;
}

export function Card({
  children,
  animate = false,
  variant = "default",
  withHover = false,
  withGlow = false,
  className,
  ...props
}: CardProps) {
  const baseStyles = cn(
    "rounded-lg p-6 transition-all duration-300",
    withHover && "hover:translate-y-[-2px]"
  );

  const variantStyles = {
    default: cn(
      "border border-gray-800 bg-gray-900/50 backdrop-blur-sm",
      withGlow && "shadow-card hover:shadow-card-hover",
      withHover && "hover:border-gray-700"
    ),
    glass: cn("glass-card", withGlow && "shadow-card hover:shadow-card-hover"),
    "neon-blue": cn(
      "border border-neon-blue-800 bg-black/40 backdrop-blur-sm",
      withGlow && "shadow-neon-blue",
      withHover && "hover:border-neon-blue-600"
    ),
    "neon-purple": cn(
      "border border-neon-purple-800 bg-black/40 backdrop-blur-sm",
      withGlow && "shadow-neon-purple",
      withHover && "hover:border-neon-purple-600"
    ),
    "neon-green": cn(
      "border border-neon-green-800 bg-black/40 backdrop-blur-sm",
      withGlow && "shadow-neon-green",
      withHover && "hover:border-neon-green-600"
    ),
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  variant?: "default" | "gradient" | "gradient-green";
  withGlow?: boolean;
}

export function CardTitle({
  children,
  variant = "default",
  withGlow = false,
  className,
  ...props
}: CardTitleProps) {
  const variantStyles = {
    default: cn(
      "text-xl font-semibold text-white",
      withGlow && "glow-text-blue"
    ),
    gradient: cn("gradient-text text-xl font-semibold"),
    "gradient-green": cn("gradient-text-green text-xl font-semibold"),
  };

  return (
    <h3 className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-gray-400", className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function CardContent({
  children,
  isLoading = false,
  className,
  ...props
}: CardContentProps) {
  return (
    <div className={cn(isLoading && "loading-shimmer", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}
