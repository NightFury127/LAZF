'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Users, 
  Rocket, 
  Lightbulb, 
  Zap, 
  Award, 
  TrendingUp, 
  Code, 
  Smartphone, 
  Cpu, 
  Layers, 
  Globe, 
  Palette, 
  ShoppingBag, 
  Shirt
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
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
    { icon: <Code size={24} />, title: 'Website Development' },
    { icon: <Smartphone size={24} />, title: 'App Development' },
    { icon: <Cpu size={24} />, title: 'DevOps Services' },
    { icon: <Layers size={24} />, title: 'UX Design' },
    { icon: <Palette size={24} />, title: 'Creative Services' },
    { icon: <Globe size={24} />, title: 'Promotional Assistance' },
    { icon: <ShoppingBag size={24} />, title: 'Inventory Management' },
    { icon: <Shirt size={24} />, title: 'Wearables' },
  ];

  const stats = [
    { label: 'Founded', value: '2025' },
    { label: 'Clients', value: '100+' },
    { label: 'Projects', value: '250+' },
    { label: 'Team Members', value: '30+' },
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
              About Lazreus Tech
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              Empowering growth and innovation for small and scaling businesses through reliable, high-quality technology solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Company Overview */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2025, Lazreus Tech is a private technology services company dedicated to helping startups and small businesses thrive in the digital landscape.
                </p>
                <p>
                  Our team of experts combines technical expertise with a deep understanding of business needs to deliver solutions that drive growth and innovation.
                </p>
                <p>
                  We believe that every business, regardless of size, deserves access to high-quality technology solutions that can help them compete and succeed in today's digital world.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary-400 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-lg"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Lightbulb size={24} className="text-primary-400 mr-3" />
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-gray-300 pl-9">
                    To empower growth and innovation for small and scaling businesses through reliable, high-quality technology solutions.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <Target size={24} className="text-primary-400 mr-3" />
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                  </div>
                  <p className="text-gray-300 pl-9">
                    To become a trusted technology partner for startups and small enterprises worldwide, enabling them to scale with confidence and agility.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <Users size={24} className="text-primary-400 mr-3" />
                    <h3 className="text-xl font-semibold">Target Audience</h3>
                  </div>
                  <p className="text-gray-300 pl-9">
                    Startups, small businesses, e-commerce platforms, service businesses, and agencies looking to leverage technology for growth.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <Award size={24} className="text-primary-400 mr-3" />
                    <h3 className="text-xl font-semibold">Competitive Edge</h3>
                  </div>
                  <p className="text-gray-300 pl-9">
                    End-to-end solutions, personalized approach, and scalable & agile methodologies that adapt to your business needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
            >
              Our Core Services
            </motion.h2>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              We offer a comprehensive range of technology services designed to help your business grow and succeed.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card p-6 rounded-lg text-center"
              >
                <div className="text-primary-400 mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/services">
              <Button size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Future Plans */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-8 gradient-text text-center"
            >
              Future Innovations
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={fadeIn}
                className="glass-card p-6 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">AI Tools</h3>
                <p className="text-gray-400 text-center">
                  Intelligent solutions to automate processes and gain valuable insights from your data.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="glass-card p-6 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Analytics Dashboards</h3>
                <p className="text-gray-400 text-center">
                  Comprehensive data visualization tools to help you make informed business decisions.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="glass-card p-6 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  <Rocket size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">SaaS Products</h3>
                <p className="text-gray-400 text-center">
                  Scalable software-as-a-service solutions tailored to specific industry needs.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
