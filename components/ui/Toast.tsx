"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, hideToast } = useToast();

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-neon-green-900/80 to-neon-green-950/80 border border-neon-green-700/50",
          icon: <CheckCircle className="h-5 w-5 text-neon-green-400" />,
          shadow: "shadow-neon-green/20",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-900/80 to-red-950/80 border border-red-700/50",
          icon: <AlertCircle className="h-5 w-5 text-red-400" />,
          shadow: "shadow-red-500/20",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-900/80 to-amber-950/80 border border-amber-700/50",
          icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
          shadow: "shadow-amber-500/20",
        };
      case "info":
      default:
        return {
          bg: "bg-gradient-to-r from-neon-blue-900/80 to-neon-blue-950/80 border border-neon-blue-700/50",
          icon: <Info className="h-5 w-5 text-neon-blue-400" />,
          shadow: "shadow-neon-blue/20",
        };
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={cn(
                "flex items-center justify-between rounded-lg p-4 backdrop-blur-md",
                "min-w-[300px] max-w-md pointer-events-auto",
                styles.bg,
                styles.shadow
              )}
            >
              <div className="flex items-center">
                {styles.icon}
                <p className="text-sm ml-2 text-white">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => hideToast(toast.id)}
                className="ml-4 rounded-full p-1 hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-white/80" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
