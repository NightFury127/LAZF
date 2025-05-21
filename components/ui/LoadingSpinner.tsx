'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'neon-blue' | 'neon-purple' | 'neon-green';
  thickness?: 'thin' | 'regular' | 'thick';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  thickness = 'regular',
  className,
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeStyles = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const variantStyles = {
    default: 'text-white',
    'neon-blue': 'text-neon-blue-500',
    'neon-purple': 'text-neon-purple-500',
    'neon-green': 'text-neon-green-500',
  };
  
  const thicknessStyles = {
    thin: 'border-2',
    regular: 'border-3',
    thick: 'border-4',
  };
  
  const spinnerClasses = cn(
    'rounded-full animate-spin',
    sizeStyles[size],
    thicknessStyles[thickness],
    variantStyles[variant],
    'border-t-transparent border-b-transparent',
    className
  );
  
  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen && 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
  );
  
  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={spinnerClasses}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'text-sm font-medium',
            variantStyles[variant]
          )}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingDots({
  size = 'md',
  variant = 'default',
  className,
}: Omit<LoadingSpinnerProps, 'thickness' | 'text' | 'fullScreen'>) {
  const sizeMap = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  };
  
  const containerSizeMap = {
    xs: 'gap-1',
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2.5',
    xl: 'gap-3',
  };
  
  const variantStyles = {
    default: 'bg-white',
    'neon-blue': 'bg-neon-blue-500',
    'neon-purple': 'bg-neon-purple-500',
    'neon-green': 'bg-neon-green-500',
  };
  
  const dotVariants = {
    initial: { scale: 0.5, opacity: 0.3 },
    animate: { scale: 1, opacity: 1 },
  };
  
  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
  };
  
  return (
    <div className={cn('flex', containerSizeMap[size], className)}>
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
        className={cn('rounded-full', sizeMap[size], variantStyles[variant])}
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
        className={cn('rounded-full', sizeMap[size], variantStyles[variant])}
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
        className={cn('rounded-full', sizeMap[size], variantStyles[variant])}
      />
    </div>
  );
}
