"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Cpu,
  Globe,
  Layers,
  Rocket,
  Palette,
  ShoppingBag,
  Shirt,
  Target,
  Users,
  Zap,
  Calendar,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark to-gray-900 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block"
            >
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50">
                Est. 2025
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
            >
              Lazreus Tech
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              Empowering growth and innovation for small and scaling businesses
              through reliable, high-quality technology solutions.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/services">
                <Button size="lg">
                  Our Services
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>

              <Link href="/about">
                <Button variant="outline" size="lg">
                  About Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <Building size={24} className="text-primary-400 mr-3" />
                <h3 className="text-lg font-semibold">Private Company</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Technology services focused on quality and client satisfaction
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <Calendar size={24} className="text-primary-400 mr-3" />
                <h3 className="text-lg font-semibold">Founded 2025</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Built on innovation and forward-thinking technology
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <Target size={24} className="text-primary-400 mr-3" />
                <h3 className="text-lg font-semibold">Clear Vision</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Becoming a trusted technology partner for businesses worldwide
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <Users size={24} className="text-primary-400 mr-3" />
                <h3 className="text-lg font-semibold">Target Audience</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Startups, small businesses, e-commerce, and service agencies
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-gray-900/50">
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
              Core Services
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              End-to-end solutions with a personalized approach, designed to
              scale with your business needs.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code size={32} />,
                title: "Website Development",
                description:
                  "Custom websites and web applications built with modern frameworks and responsive design.",
              },
              {
                icon: <Layers size={32} />,
                title: "App Development",
                description:
                  "Native and cross-platform mobile applications for iOS and Android platforms.",
              },
              {
                icon: <Cpu size={32} />,
                title: "DevOps Services",
                description:
                  "Streamline your development and operations with our DevOps expertise.",
              },
              {
                icon: <Globe size={32} />,
                title: "UX Design",
                description:
                  "User-centered design that creates intuitive and engaging experiences.",
              },
              {
                icon: <Palette size={32} />,
                title: "Creative Services",
                description:
                  "Branding, graphic design, and creative solutions to enhance your visual identity.",
              },
              {
                icon: <Zap size={32} />,
                title: "Promotional Assistance",
                description:
                  "Strategic marketing and promotional campaigns to boost your business visibility.",
              },
              {
                icon: <ShoppingBag size={32} />,
                title: "Inventory Management",
                description:
                  "Efficient inventory tracking and management systems for retail and e-commerce.",
              },
              {
                icon: <Shirt size={32} />,
                title: "Wearables",
                description:
                  "Custom branded apparel including hoodies, shirts, and promotional merchandise.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                    },
                  },
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.1)",
                  transition: { duration: 0.2 },
                }}
                className="glass-card p-6 rounded-lg"
              >
                <div className="text-primary-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg">
                View All Services
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
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
              Future Innovations
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              We're constantly evolving to bring you the latest technology
              solutions for your business.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-lg border border-blue-900/30"
              whileHover={{
                y: -5,
                boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-primary-400 mb-6 flex justify-center">
                <Zap size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                AI Tools
              </h3>
              <p className="text-gray-400 text-center">
                Intelligent solutions to automate processes and gain valuable
                insights from your data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-lg border border-purple-900/30"
              whileHover={{
                y: -5,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-primary-400 mb-6 flex justify-center">
                <Target size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Analytics Dashboards
              </h3>
              <p className="text-gray-400 text-center">
                Comprehensive data visualization tools to help you make informed
                business decisions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-lg border border-blue-900/30"
              whileHover={{
                y: -5,
                boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-primary-400 mb-6 flex justify-center">
                <Rocket size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                SaaS Products
              </h3>
              <p className="text-gray-400 text-center">
                Scalable software-as-a-service solutions tailored to specific
                industry needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Competitive Edge Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                Our Competitive Edge
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white">
                      End-to-End Solutions
                    </h3>
                    <p className="text-gray-300 mt-2">
                      From concept to deployment and beyond, we handle every
                      aspect of your technology needs.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white">
                      Personalized Approach
                    </h3>
                    <p className="text-gray-300 mt-2">
                      We take the time to understand your unique business needs
                      and tailor our solutions accordingly.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white">
                      Scalable & Agile
                    </h3>
                    <p className="text-gray-300 mt-2">
                      Our solutions grow with your business, adapting to
                      changing needs and market conditions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative inline-block"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30"></div>
                <div className="relative glass-card p-8 rounded-lg border border-gray-800">
                  <h3 className="text-2xl font-bold mb-6 gradient-text">
                    Ready to Transform Your Business?
                  </h3>
                  <p className="text-gray-300 mb-8">
                    Join our growing list of satisfied clients and take your
                    business to the next level with our innovative technology
                    solutions.
                  </p>
                  <Link href="/contact">
                    <Button size="lg">
                      Contact Us
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
