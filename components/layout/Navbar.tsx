"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              PeshawarStays
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/hotels"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Browse Hotels
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/become-host"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Become a Host
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-medium">
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 h-10 w-10"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: mobileMenuOpen ? "auto" : 0,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: mobileMenuOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: mobileMenuOpen ? 0.1 : 0 }}
              className="py-4 space-y-4 border-t mt-4"
            >
              <Link
                href="/hotels"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Hotels
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/become-host"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Host
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
