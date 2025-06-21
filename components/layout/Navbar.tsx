"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/currentUser";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { se } from "date-fns/locale";

export function Navbar() {
  const { user: currentUser, loading }: any = useCurrentUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    setOpen(false);
    const response = await axios.post("/api/auth/logout");
    if (response.status === 200) {
      setIsLoading(false);
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }

    setMobileMenuOpen(false);
  };

  return (
    <div>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 fixed w-full top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              PeshawarStays
            </Link>

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

            {loading ? (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md" />
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md" />
              </div>
            ) : currentUser ? (
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  href={
                    currentUser.role === "host"
                      ? "/dashboard/host"
                      : currentUser.role === "customer"
                      ? "/dashboard/customer"
                      : currentUser.role === "admin"
                      ? "/dashboard/admin"
                      : "/"
                  }
                >
                  <Image
                    src={
                      currentUser.imageUrl
                        ? currentUser.imageUrl
                        : currentUser.gender === "male"
                        ? "/male-avatar.jpg"
                        : currentUser.gender === "female"
                        ? "/female-avator.avif"
                        : currentUser.gender === "other"
                        ? "/other-avatar.webp"
                        : "/default-avatar.png"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-2"
                    width={42}
                    height={42}
                    priority
                  />
                </Link>

                <div className="p-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-red-500 hover:bg-red-600 text-white font-medium hover:text-white "
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 bg-[#1a1c23] text-white border border-gray-700">
                      <p className="text-sm mb-4">
                        Are you sure you want to logout?
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-black "
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleLogout}
                          disabled={isLoading ? true : false}
                        >
                          {isLoading ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
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
            )}

            {/* Mobile Menu Section - Profile Icon + Hamburger */}
            <div className="lg:hidden">
              <div className=" flex items-center space-x-2">
                {loading ? (
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
                ) : currentUser ? (
                  <Link
                    href={
                      currentUser.role === "host"
                        ? "/dashboard/host"
                        : currentUser.role === "customer"
                        ? "/dashboard/customer"
                        : currentUser.role === "admin"
                        ? "/dashboard/admin"
                        : "/"
                    }
                  >
                    <Image
                      src={
                        currentUser.gender === "male"
                          ? "/male-avatar.jpg"
                          : currentUser.gender === "female"
                          ? "/female-avator.avif"
                          : currentUser.gender === "other"
                          ? "/other-avatar.webp"
                          : "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                      width={24}
                      height={24}
                      priority
                    />
                  </Link>
                ) : null}

                {/* Hamburger Menu Button */}
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
                {loading ? (
                  <div className="space-y-2">
                    <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md" />
                    <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                ) : currentUser ? (
                  <>
                    <Button
                      className="w-full  bg-red-500 hover:bg-red-600 text-white font-medium justify-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-medium">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
