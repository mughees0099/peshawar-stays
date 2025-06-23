"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Waves,
  Shield,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/currentUser";
import { useEffect, useState } from "react";
import axios from "axios";

const testimonials = [
  {
    name: "Iqra Ahmad",
    location: "Islamabad",
    rating: 5,
    comment:
      "Exceptional service and luxurious accommodations. PeshawarStays made our business trip memorable.",
    image: "/girl1.jpg?height=60&width=60",
  },
  {
    name: "Sarah Ali",
    location: "Karachi",
    rating: 5,
    comment:
      "Found the perfect guest house for our family vacation. The booking process was seamless.",
    image: "/girl2.jpg?height=60&width=60",
  },
  {
    name: "Muhammad Hassan",
    location: "Lahore",
    rating: 5,
    comment:
      "Outstanding platform with verified properties. Highly recommend for anyone visiting Peshawar.",
    image: "boy1.jpg?height=60&width=60",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Search & Discover",
    description:
      "Browse through our curated collection of luxury hotels and guest houses in Peshawar",
    icon: Search,
  },
  {
    step: "2",
    title: "Compare & Choose",
    description:
      "Compare amenities, prices, and reviews to find the perfect accommodation for your stay",
    icon: CheckCircle,
  },
  {
    step: "3",
    title: "Book & Enjoy",
    description:
      "Secure your booking with our trusted payment system and enjoy your luxurious stay",
    icon: Award,
  },
];

// Animation variants
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

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95 },
};

export default function HomePage() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFeaturedHotels() {
      try {
        setLoading(true);
        const response = await axios.get("/api/Property/properties");
        const data = response.data.filter(
          (hotel) => hotel.isApproved === "approved"
        );
        setFeaturedHotels(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured hotels:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedHotels();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black/20"
        />
        <div className="absolute inset-0">
          <Image
            src="/main-bg.avif?height=800&width=1600"
            alt="Luxury Hotel Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-luxury-gold text-primary font-medium px-4 py-2">
                Premium Accommodations in Peshawar
              </Badge>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Experience Luxury in the{" "}
                <span className="text-luxury-gold">Heart of Peshawar</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90"
              >
                Discover handpicked luxury hotels and boutique guest houses
                offering world-class amenities and authentic Pakistani
                hospitality in Khyber Pakhtunkhwa's cultural capital.
              </motion.p>
            </motion.div>

            {/* Enhanced Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="max-w-5xl mx-auto shadow-2xl border-0  bg-transparent backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6"></div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/hotels">
                      <Button
                        className="w-full mt-6 h-16 text-xl font-semibold bg-luxury-gold hover:bg-luxury-gold/90 text-primary transition-all duration-300"
                        size="lg"
                      >
                        <Search className="mr-3 h-6 w-6" />
                        Find Luxury Accommodations
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center items-center space-x-8 mt-12 opacity-80"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2"
              >
                <Shield className="h-5 w-5 text-luxury-gold" />
                <span className="text-sm font-medium">Verified Properties</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2"
              >
                <Award className="h-5 w-5 text-luxury-gold" />
                <span className="text-sm font-medium">Premium Service</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2"
              >
                <Clock className="h-5 w-5 text-luxury-gold" />
                <span className="text-sm font-medium">24/7 Support</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              How PeshawarStays Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience seamless booking with our three-step process designed
              for your convenience
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="text-center group shadow-sm shadow-black/10 p-6  bg-white rounded-lg cursor-pointer"
              >
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-luxury-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <step.icon className="h-10 w-10 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{ once: true }}
                    className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                  >
                    {step.step}
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Featured Hotels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Handpicked Selection
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Featured Luxury Accommodations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our carefully curated collection of premium hotels and
              boutique guest houses
            </p>
          </motion.div>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-luxury-gold mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel._id}
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Link href={`/hotel/${hotel._id}`}>
                    <Card className="group cursor-pointer border-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                      <div className="relative overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Image
                            src={hotel.images[0].url || "/placeholder.svg"}
                            alt={hotel.name}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Badge className="absolute top-4 left-4 bg-luxury-gold text-primary font-medium shadow-lg">
                            {hotel.pricePerNight >= 10000
                              ? "Luxury"
                              : hotel.pricePerNight >= 20000
                              ? "Premium"
                              : "Standard"}
                          </Badge>
                        </motion.div>
                        <motion.div
                          initial={{ x: 100, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          viewport={{ once: true }}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                        >
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                            <span className="ml-1 text-sm font-bold text-primary">
                              {hotel.reviews.length > 0
                                ? (
                                    hotel.reviews
                                      .map((review) => review.rating)
                                      .reduce((a, b) => a + b, 0) /
                                    hotel.reviews.length
                                  ).toFixed(1)
                                : "N/A"}
                            </span>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                        />
                      </div>
                      <CardContent className="p-6">
                        <motion.h3
                          className="font-bold text-xl mb-2 text-primary group-hover:text-luxury-gold transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          {hotel.name}
                        </motion.h3>
                        <p className="text-muted-foreground text-sm mb-4 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-luxury-gold" />
                          {hotel.address}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities
                            .slice(0, 3)
                            .map((amenity, amenityIndex) => {
                              return (
                                <motion.div
                                  key={amenity}
                                  initial={{ scale: 0 }}
                                  whileInView={{ scale: 1 }}
                                  transition={{ delay: amenityIndex * 0.1 }}
                                  viewport={{ once: true }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-luxury-cream text-primary"
                                  >
                                    {amenity}
                                  </Badge>
                                </motion.div>
                              );
                            })}
                        </div>
                        <motion.div
                          className="flex items-center justify-between"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              PKR {hotel.pricePerNight.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {" "}
                              / night
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {hotel.reviews.length} reviews
                          </span>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/hotels">
              <motion.div {...scaleOnHover}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  Explore All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Customer Reviews */}
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4  bg-luxury-gold text-primary">
              Guest Experiences
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              What Our Guests Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Read authentic reviews from travelers who experienced luxury
              through PeshawarStays
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                whileHover={{ y: -5, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2, type: "spring" }}
                      viewport={{ once: true }}
                      className="flex items-center mb-4"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, rotate: -180 }}
                          whileInView={{ opacity: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="h-5 w-5 fill-luxury-gold text-luxury-gold" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-muted-foreground mb-6 text-lg leading-relaxed italic"
                    >
                      "{testimonial.comment}"
                    </motion.p>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-bold text-primary">
                          {testimonial.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              The PeshawarStays Advantage
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: Shield,
                title: "Verified Excellence",
                desc: "Every property is personally inspected and verified to meet our luxury standards",
              },
              {
                icon: Award,
                title: "Premium Service",
                desc: "24/7 concierge support and personalized assistance for an unforgettable stay",
              },
              {
                icon: MapPin,
                title: "Local Expertise",
                desc: "Deep knowledge of Peshawar's best locations and hidden gems for authentic experiences",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center group shadow-sm shadow-black/10 p-6  bg-white rounded-lg cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="bg-luxury-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-luxury-gold transition-all duration-300 shadow-lg"
                >
                  <item.icon className="h-10 w-10 text-luxury-gold group-hover:text-primary transition-colors" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-primary to-luxury-charcoal relative overflow-hidden"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-transparent"
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join thousands of satisfied guests who chose PeshawarStays for
              their perfect accommodation
            </p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div variants={fadeInUp}>
                <Link href="/hotels">
                  <motion.div {...scaleOnHover}>
                    <Button
                      size="lg"
                      className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary px-8 py-4 text-lg font-semibold shadow-lg"
                    >
                      Start Exploring
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link href="/become-host">
                  <motion.div {...scaleOnHover}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white  hover:bg-white text-primary px-8 py-4 text-lg font-semibold shadow-lg"
                    >
                      Become a Host
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
