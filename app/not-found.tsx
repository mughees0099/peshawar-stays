"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity=".05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20' />

        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-2xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Brand Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-block group">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Peshawar Stays
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Luxury Accommodations
              </p>
            </Link>
          </motion.div>

          {/* 404 Number with Hotel Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="mb-8 relative"
          >
            <div className="relative">
              <h2 className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-none">
                404
              </h2>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 md:-top-8 md:-right-8 text-4xl md:text-6xl"
              >
                🏨
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Oops! Room Not Found
            </h3>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-300 mb-4">
                It looks like this page has checked out!
              </p>
              <p className="text-lg text-gray-400 mb-6">
                The page you're looking for might have been moved, deleted, or
                you entered the wrong URL.
              </p>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-amber-400 font-semibold mb-2">
                  💡 What you can do:
                </p>
                <ul className="text-gray-300 text-left space-y-2">
                  <li>• Check the URL for typos</li>
                  <li>• Go back to the previous page</li>
                  <li>• Visit our homepage to start fresh</li>
                  <li>• Browse our available hotels</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12"
          >
            <div className="relative mx-auto w-80 h-80 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full w-full h-full flex items-center justify-center border border-white/20 shadow-2xl">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="text-center"
                >
                  <div className="text-8xl mb-4">🔍</div>
                  <p className="text-gray-300 text-lg">
                    Searching for your page...
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[160px]"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Go Home
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-xl transition-all duration-300 group min-w-[160px]"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>

            <Link href="/hotels">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-xl transition-all duration-300 group min-w-[160px]"
              >
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Browse Hotels
              </Button>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          >
            <Link href="/about" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">ℹ️</div>
                <h4 className="text-white font-semibold mb-2">About Us</h4>
                <p className="text-gray-400 text-sm">
                  Learn more about Peshawar Stays
                </p>
              </div>
            </Link>

            <Link href="/become-host" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">🏠</div>
                <h4 className="text-white font-semibold mb-2">Become a Host</h4>
                <p className="text-gray-400 text-sm">
                  List your property with us
                </p>
              </div>
            </Link>

            <Link href="/login" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">👤</div>
                <h4 className="text-white font-semibold mb-2">Login</h4>
                <p className="text-gray-400 text-sm">Access your account</p>
              </div>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="border-t border-white/10 pt-8"
          >
            <p className="text-gray-400 mb-6">
              Need help? Contact our support team
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Peshawar, Pakistan</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@peshawarstays.com</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
    </div>
  );
}
