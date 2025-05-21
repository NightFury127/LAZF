"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://github.com",
      icon: <Github size={20} />,
      label: "GitHub",
      color: "hover:text-neon-blue-400",
    },
    {
      href: "https://twitter.com",
      icon: <Twitter size={20} />,
      label: "Twitter",
      color: "hover:text-neon-blue-400",
    },
    {
      href: "https://linkedin.com",
      icon: <Linkedin size={20} />,
      label: "LinkedIn",
      color: "hover:text-neon-purple-400",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative border-t border-gray-800/50 bg-dark/80 backdrop-blur-sm py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-[-1]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold gradient-text mb-4">
              Lazreus Tech
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Futuristic technology solutions for modern businesses.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("text-gray-400 transition-colors", link.color)}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-neon-blue-500 to-transparent"></span>
            </h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-blue-400 transition-colors flex items-center group"
                  >
                    <span className="w-1 h-1 bg-neon-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Services
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-neon-purple-500 to-transparent"></span>
            </h3>
            <div className="space-y-2">
              {[
                { href: "/services#web", label: "Web Development" },
                { href: "/services#app", label: "App Development" },
                { href: "/services#devops", label: "DevOps Services" },
                { href: "/services#ux", label: "UX Design" },
              ].map((service) => (
                <motion.div
                  key={service.href}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={service.href}
                    className="text-sm text-gray-400 hover:text-neon-purple-400 transition-colors flex items-center group"
                  >
                    <span className="w-1 h-1 bg-neon-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service.label}
                    <ExternalLink
                      size={12}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Contact
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-neon-green-500 to-transparent"></span>
            </h3>
            <div className="space-y-3">
              <motion.div
                className="flex items-center text-sm text-gray-400 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 rounded-full bg-neon-green-900/30 flex items-center justify-center mr-3 border border-neon-green-800/50 group-hover:border-neon-green-500/50 transition-colors">
                  <Mail size={14} className="text-neon-green-500" />
                </div>
                <a
                  href="mailto:info@lazreustech.com"
                  className="hover:text-neon-green-400 transition-colors"
                >
                  info@lazreustech.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 border-t border-gray-800/50 pt-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} Lazreus Tech. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
