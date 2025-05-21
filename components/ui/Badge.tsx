'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neon-blue' | 'neon-purple' | 'neon-green';
  size?: 'sm' | 'md' | 'lg';
  withGlow?: boolean;
  withAnimation?: boolean;
  withIcon?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  withGlow = false,
  withAnimation = false,
  withIcon = false,
  className,
}: BadgeProps) {
  const baseStyles = cn(
    'inline-flex items-center rounded-full font-medium',
    withIcon && 'gap-1'
  );
  
  const variantStyles = {
    default: cn(
      'bg-gray-800/80 text-gray-200 border border-gray-700',
      withGlow && 'shadow-sm'
    ),
    success: cn(
      'bg-neon-green-950/50 text-neon-green-400 border border-neon-green-800',
      withGlow && 'shadow-neon-green/20'
    ),
    warning: cn(
      'bg-amber-950/50 text-amber-400 border border-amber-800',
      withGlow && 'shadow-amber-500/20'
    ),
    error: cn(
      'bg-red-950/50 text-red-400 border border-red-800',
      withGlow && 'shadow-red-500/20'
    ),
    info: cn(
      'bg-blue-950/50 text-blue-400 border border-blue-800',
      withGlow && 'shadow-blue-500/20'
    ),
    'neon-blue': cn(
      'bg-neon-blue-950/50 text-neon-blue-400 border border-neon-blue-800',
      withGlow && 'shadow-neon-blue/20'
    ),
    'neon-purple': cn(
      'bg-neon-purple-950/50 text-neon-purple-400 border border-neon-purple-800',
      withGlow && 'shadow-neon-purple/20'
    ),
    'neon-green': cn(
      'bg-neon-green-950/50 text-neon-green-400 border border-neon-green-800',
      withGlow && 'shadow-neon-green/20'
    ),
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  
  const Badge = withAnimation ? motion.span : 'span';
  
  const animationProps = withAnimation
    ? {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 },
        whileHover: { scale: 1.05 },
      }
    : {};
  
  return (
    <Badge
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...animationProps}
    >
      {children}
    </Badge>
  );
}
