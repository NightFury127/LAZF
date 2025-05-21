'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'neon-blue' | 'neon-purple' | 'neon-green';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (closeOnEsc) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [closeOnEsc, onClose]);

  // Prevent rendering during SSR
  if (!isMounted) return null;
  
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };
  
  const variantStyles = {
    default: 'bg-gray-900/95 border border-gray-800 shadow-card',
    'neon-blue': 'bg-black/90 border border-neon-blue-800 shadow-neon-blue',
    'neon-purple': 'bg-black/90 border border-neon-purple-800 shadow-neon-purple',
    'neon-green': 'bg-black/90 border border-neon-green-800 shadow-neon-green',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOutsideClick ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
            className={cn(
              'relative w-full rounded-lg p-6 backdrop-blur-sm',
              'overflow-hidden',
              sizeStyles[size],
              variantStyles[variant]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
            
            {/* Header */}
            {(title || description) && (
              <div className="mb-6">
                {title && (
                  <h2 className={cn(
                    "text-xl font-semibold text-white",
                    variant === 'neon-blue' && "text-neon-blue-400",
                    variant === 'neon-purple' && "text-neon-purple-400",
                    variant === 'neon-green' && "text-neon-green-400"
                  )}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-400">{description}</p>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className={cn(
              size === 'full' && 'max-h-[calc(95vh-10rem)] overflow-y-auto'
            )}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing modal state
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(prev => !prev);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
}
