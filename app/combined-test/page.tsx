"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CombinedTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-dark to-gray-900 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
              >
                Combined Components Test
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-300 mb-8"
              >
                This page combines all the components (Navbar, Button, Footer) to test how they work together.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/demo">
                  <Button size="lg">
                    View Demo
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Button Showcase */}
        <section className="py-16 bg-gray-900/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center gradient-text">Button Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Primary Buttons</h3>
                <div className="space-y-4">
                  <Button variant="primary" size="sm" fullWidth>Small</Button>
                  <Button variant="primary" size="md" fullWidth>Medium</Button>
                  <Button variant="primary" size="lg" fullWidth>Large</Button>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Secondary Buttons</h3>
                <div className="space-y-4">
                  <Button variant="secondary" size="sm" fullWidth>Small</Button>
                  <Button variant="secondary" size="md" fullWidth>Medium</Button>
                  <Button variant="secondary" size="lg" fullWidth>Large</Button>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Neon Buttons</h3>
                <div className="space-y-4">
                  <Button variant="neon-blue" size="md" fullWidth withGlow>Neon Blue</Button>
                  <Button variant="neon-purple" size="md" fullWidth withGlow>Neon Purple</Button>
                  <Button variant="neon-green" size="md" fullWidth withGlow>Neon Green</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-6 gradient-text"
            >
              Ready to Explore More?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Check out the individual component test pages to see how each component works in isolation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/button-test">
                <Button variant="neon-blue" size="lg" withGlow>
                  Button Test
                </Button>
              </Link>
              
              <Link href="/navbar-test">
                <Button variant="neon-purple" size="lg" withGlow>
                  Navbar Test
                </Button>
              </Link>
              
              <Link href="/footer-test">
                <Button variant="neon-green" size="lg" withGlow>
                  Footer Test
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
