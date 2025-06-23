"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DollarSign, Users, Shield, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description:
      "Generate substantial revenue by hosting travelers in your property",
  },
  {
    icon: Users,
    title: "Meet Global Guests",
    description:
      "Connect with travelers from around the world and share local culture",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Protected payments and verified guest profiles for your safety",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your hosting needs",
  },
];

const steps = [
  {
    step: "1",
    title: "Create Your Listing",
    description: "Add photos, description, and amenities of your property",
  },
  {
    step: "2",
    title: "Set Your Price",
    description: "Choose competitive rates and availability calendar",
  },
  {
    step: "3",
    title: "Welcome Guests",
    description: "Start hosting and earning from verified bookings",
  },
];

export default function BecomeHostPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black h-screen py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/beecome-host.webp?height=800&width=1600"
            alt="Become a Host"
            fill
            className="object-cover opacity-20"
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
                Join Our Host Community
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Turn Your Property Into a{" "}
                <span className="text-luxury-gold">Revenue Stream</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
                Join Pakistan's premier hospitality platform and start earning
                from your property while providing exceptional experiences to
                travelers visiting Peshawar.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary px-8 py-4 text-lg font-semibold"
                  onClick={() => (window.location.href = "/register?role=host")}
                >
                  create account as a host
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Host With Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Benefits of Being a Host
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the advantages of joining our exclusive host community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-luxury-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <benefit.icon className="h-8 w-8 text-luxury-gold" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-primary mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              How to Get Started
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to start your hosting journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-luxury-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-primary">
                      {step.step}
                    </span>
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
          </div>
        </div>
      </section>

      {/* Application Form */}
      {/* <section id="application-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Join Today
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Host Application
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete your application to start hosting with PeshawarStays
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-primary">
                    Step {formStep} of 3
                  </CardTitle>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          step <= formStep ? "bg-luxury-gold" : "bg-gray-200"
                        } transition-colors`}
                      />
                    ))}
                  </div>
                </div>
                <CardDescription>
                  {formStep === 1 && "Personal Information"}
                  {formStep === 2 && "Property Details"}
                  {formStep === 3 && "Business Information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={formStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {formStep === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </>
                  )}

                  {formStep === 2 && (
                    <>
                      <div>
                        <Label htmlFor="propertyName">Property Name *</Label>
                        <Input
                          id="propertyName"
                          value={formData.propertyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyName: e.target.value,
                            })
                          }
                          placeholder="Enter property name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="propertyType">Property Type *</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, propertyType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="guest-house">
                              Guest House
                            </SelectItem>
                            <SelectItem value="resort">Resort</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="address">Property Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter complete address"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">
                          Property Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe your property"
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {formStep === 3 && (
                    <>
                      <div>
                        <Label htmlFor="bankDetails">
                          Bank Account Details *
                        </Label>
                        <Textarea
                          id="bankDetails"
                          value={formData.bankDetails}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bankDetails: e.target.value,
                            })
                          }
                          placeholder="Bank name, account number, account title"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Property Images</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500 mb-2">
                            Upload property photos
                          </p>
                          <p className="text-sm text-gray-400">
                            Drag and drop or click to browse
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/host-agreement"
                            className="text-primary hover:underline"
                          >
                            Host Agreement
                          </Link>
                        </Label>
                      </div>
                    </>
                  )}
                </motion.div>

                <div className="flex justify-between mt-8">
                  {formStep > 1 && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" onClick={handlePrev}>
                        Previous
                      </Button>
                    </motion.div>
                  )}
                  <div className="ml-auto">
                    {formStep < 3 ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleNext}
                          className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary"
                        >
                          Next
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary"
                        >
                          Submit Application
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                500+
              </h3>
              <p className="text-xl">Active Hosts</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                PKR 2M+
              </h3>
              <p className="text-xl">Monthly Earnings</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                4.8
              </h3>
              <p className="text-xl">Average Rating</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                95%
              </h3>
              <p className="text-xl">Host Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
