'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Cpu, 
  Layers, 
  Palette, 
  Globe, 
  ShoppingBag, 
  Shirt, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ServicesPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const services = [
    {
      icon: <Code size={48} />,
      title: 'Website Development',
      description: 'Custom websites and web applications built with modern frameworks and responsive design.',
      features: [
        'Modern frontend frameworks (React, Next.js)',
        'Responsive design for all devices',
        'SEO optimization',
        'Performance optimization',
        'Content management systems'
      ]
    },
    {
      icon: <Smartphone size={48} />,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      features: [
        'Native iOS and Android development',
        'Cross-platform solutions (React Native, Flutter)',
        'UI/UX design for mobile',
        'App Store optimization',
        'Maintenance and updates'
      ]
    },
    {
      icon: <Cpu size={48} />,
      title: 'DevOps Services',
      description: 'Streamline your development and operations with our DevOps expertise.',
      features: [
        'CI/CD pipeline setup',
        'Infrastructure as code',
        'Cloud deployment (AWS, Azure, GCP)',
        'Containerization (Docker, Kubernetes)',
        'Monitoring and logging'
      ]
    },
    {
      icon: <Layers size={48} />,
      title: 'UX Design',
      description: 'User-centered design that creates intuitive and engaging experiences.',
      features: [
        'User research and personas',
        'Wireframing and prototyping',
        'Usability testing',
        'Interaction design',
        'Design systems'
      ]
    },
    {
      icon: <Palette size={48} />,
      title: 'Creative Services',
      description: 'Branding, graphic design, and creative solutions to enhance your visual identity.',
      features: [
        'Brand identity design',
        'Logo design',
        'Marketing materials',
        'Social media graphics',
        'Print design'
      ]
    },
    {
      icon: <Globe size={48} />,
      title: 'Promotional Assistance',
      description: 'Strategic marketing and promotional campaigns to boost your business visibility.',
      features: [
        'Digital marketing strategy',
        'Social media management',
        'Content marketing',
        'Email marketing campaigns',
        'Analytics and reporting'
      ]
    },
    {
      icon: <ShoppingBag size={48} />,
      title: 'Inventory Management',
      description: 'Efficient inventory tracking and management systems for retail and e-commerce.',
      features: [
        'Inventory tracking systems',
        'Barcode and QR code integration',
        'Stock level monitoring',
        'Order management',
        'Supplier management'
      ]
    },
    {
      icon: <Shirt size={48} />,
      title: 'Wearables',
      description: 'Custom branded apparel including hoodies, shirts, and promotional merchandise.',
      features: [
        'Custom t-shirt design',
        'Branded hoodies and apparel',
        'Promotional merchandise',
        'Quality printing services',
        'Bulk order management'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark to-gray-900 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
            >
              Our Services
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              End-to-end technology solutions designed to help your business grow and succeed in the digital landscape.
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-lg border border-gray-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-primary-400 mb-6">{service.icon}</div>
                    <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                    <p className="text-gray-400 text-center md:text-left">{service.description}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Key Features</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start"
                        >
                          <CheckCircle size={18} className="text-primary-400 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
            >
              Ready to Get Started?
            </motion.h2>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-300 mb-8"
            >
              Contact us today to discuss how we can help your business grow with our technology solutions.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
            >
              <Link href="/contact">
                <Button size="lg">
                  Contact Us
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
