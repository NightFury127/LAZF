"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const authLinks = session
    ? [
        { href: "/dashboard", label: "Dashboard" },
        ...(session.user.role === "ADMIN"
          ? [{ href: "/admin", label: "Admin" }]
          : []),
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-dark/60 border-b border-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue-950/30 to-neon-purple-950/30 z-[-1]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <motion.span
                className="text-2xl font-bold gradient-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                Lazreus Tech
              </motion.span>
              <motion.div
                className="ml-1 w-1.5 h-1.5 rounded-full bg-neon-blue-500"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1 bg-gray-900/50 backdrop-blur-sm rounded-full px-1 py-1 border border-gray-800/50">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                    pathname === link.href
                      ? "text-white bg-neon-blue-900/50 shadow-neon-blue/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  {pathname === link.href && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue-600/20 to-neon-purple-600/20 z-[-1]"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {authLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={pathname === link.href ? "neon-blue" : "outline"}
                    size="sm"
                    withGlow={pathname === link.href}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}

              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  Logout
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2 backdrop-blur-md bg-black/40 border-b border-gray-800/50">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-gradient-to-r from-neon-blue-900/50 to-neon-blue-950/50 text-white border border-neon-blue-800/50"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      size={16}
                      className={cn(
                        "transition-transform",
                        pathname === link.href
                          ? "text-neon-blue-400"
                          : "text-gray-500"
                      )}
                    />
                  </Link>
                </motion.div>
              ))}

              <div className="my-3 border-t border-gray-800/50" />

              {authLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-gradient-to-r from-neon-purple-900/50 to-neon-purple-950/50 text-white border border-neon-purple-800/50"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      size={16}
                      className={cn(
                        "transition-transform",
                        pathname === link.href
                          ? "text-neon-purple-400"
                          : "text-gray-500"
                      )}
                    />
                  </Link>
                </motion.div>
              ))}

              {session && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-base font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-200"
                  >
                    <span>Logout</span>
                    <X size={16} className="text-red-500" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
