"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <motion.div variants={fadeInUp}>
            <h3 className="text-2xl font-bold mb-6 text-luxury-gold">
              PeshawarStays
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your premier platform for discovering luxury accommodations in
              Peshawar, Pakistan. Experience authentic hospitality with modern
              comfort.
            </p>
            <div className="flex space-x-4">
              {["f", "t", "i"].map((social, index) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center cursor-pointer"
                >
                  <span className="text-primary font-bold">{social}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {[
            {
              title: "For Guests",
              links: [
                { name: "Browse Hotels", href: "/hotels" },
                { name: "Guest Reviews", href: "/reviews" },
                { name: "Help Center", href: "/help" },
                { name: "Contact Support", href: "/contact" },
              ],
            },
            {
              title: "For Hosts",
              links: [
                { name: "Become a Host", href: "/become-host" },
                { name: "Host Dashboard", href: "/dashboard/host" },
                { name: "Resources", href: "/host-resources" },
                { name: "Host Support", href: "/host-support" },
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Privacy Policy", href: "/terms" },
                { name: "Terms of Service", href: "/terms" },
              ],
            },
          ].map((section, index) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h4 className="font-bold mb-6 text-luxury-gold">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-300">
                {section.links.map((link) => (
                  <motion.li key={link.name} whileHover={{ x: 5 }}>
                    <Link
                      href={link.href}
                      className="hover:text-luxury-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400"
        >
          <p>
            &copy; {new Date().getFullYear()} PeshawarStays. All rights
            reserved. Crafted with ❤️ for luxury travelers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
