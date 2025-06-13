"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  FileText,
  Users,
  CreditCard,
  Home,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsAndPolicy() {
  const router = useRouter();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-slate-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back </span>
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Terms & Policies
              </h1>
              <p className="text-sm text-slate-500">
                Last updated: December 2024
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 sticky top-24">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {[
                  { id: "terms", label: "Terms of Service", icon: Shield },
                  { id: "privacy", label: "Privacy Policy", icon: UserCheck },
                  { id: "booking", label: "Booking Policy", icon: FileText },
                  { id: "host", label: "Host Guidelines", icon: Home },
                  { id: "guest", label: "Guest Guidelines", icon: Users },
                  { id: "payment", label: "Payment Terms", icon: CreditCard },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 flex items-center"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Terms of Service */}
            <section
              id="terms"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Terms of Service
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  1. Acceptance of Terms
                </h3>
                <p className="text-slate-600 mb-4">
                  By accessing and using Peshawar Stays, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  2. Use License
                </h3>
                <p className="text-slate-600 mb-4">
                  Permission is granted to temporarily use Peshawar Stays for
                  personal, non-commercial transitory viewing only. This
                  includes:
                </p>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Searching and booking accommodations</li>
                  <li>Creating user accounts and profiles</li>
                  <li>Communicating with hosts and guests</li>
                  <li>Leaving reviews and ratings</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  3. Prohibited Uses
                </h3>
                <p className="text-slate-600 mb-2">
                  You may not use our platform to:
                </p>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>
                    Violate any local, state, national, or international law
                  </li>
                  <li>
                    Transmit or procure the sending of any advertising or
                    promotional material
                  </li>
                  <li>
                    Impersonate or attempt to impersonate the company,
                    employees, or other users
                  </li>
                  <li>
                    Engage in any other conduct that restricts or inhibits
                    anyone's use of the platform
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  4. Account Responsibilities
                </h3>
                <p className="text-slate-600 mb-4">
                  Users are responsible for maintaining the confidentiality of
                  their account information and for all activities that occur
                  under their account.
                </p>
              </div>
            </section>

            {/* Privacy Policy */}
            <section
              id="privacy"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <UserCheck className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Privacy Policy
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Information We Collect
                </h3>
                <p className="text-slate-600 mb-4">
                  We collect information you provide directly to us, such as
                  when you create an account, make a booking, or contact us for
                  support.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  How We Use Your Information
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process transactions and send related information</li>
                  <li>To send you technical notices and support messages</li>
                  <li>
                    To communicate with you about products, services, and events
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Information Sharing
                </h3>
                <p className="text-slate-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Data Security
                </h3>
                <p className="text-slate-600 mb-4">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </div>
            </section>

            {/* Booking Policy */}
            <section
              id="booking"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Booking Policy
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Reservation Process
                </h3>
                <p className="text-slate-600 mb-4">
                  All bookings are subject to availability and confirmation.
                  Payment is required at the time of booking to secure your
                  reservation.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Cancellation Policy
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Flexible Cancellation
                  </h4>
                  <ul className="list-disc list-inside text-amber-700 space-y-1">
                    <li>Free cancellation up to 24 hours before check-in</li>
                    <li>50% refund for cancellations within 24 hours</li>
                    <li>No refund for no-shows</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Modification Policy
                </h3>
                <p className="text-slate-600 mb-4">
                  Booking modifications are subject to availability and may
                  incur additional charges. Contact us at least 48 hours before
                  check-in for modifications.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Check-in/Check-out
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Standard check-in time: 3:00 PM</li>
                  <li>Standard check-out time: 11:00 AM</li>
                  <li>Early check-in/late check-out subject to availability</li>
                </ul>
              </div>
            </section>

            {/* Host Guidelines */}
            <section
              id="host"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <Home className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Host Guidelines
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Property Standards
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>
                    Properties must be clean, safe, and accurately described
                  </li>
                  <li>All amenities listed must be available and functional</li>
                  <li>
                    Photos must be recent and accurately represent the property
                  </li>
                  <li>
                    Properties must comply with local laws and regulations
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Host Responsibilities
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Respond to booking requests within 24 hours</li>
                  <li>
                    Provide accurate property information and availability
                  </li>
                  <li>Maintain property cleanliness and safety standards</li>
                  <li>
                    Be available for guest communication during their stay
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Payment Terms
                </h3>
                <p className="text-slate-600 mb-4">
                  Hosts receive payment 24 hours after guest check-in, minus
                  platform fees. Payments are processed weekly to your
                  registered bank account.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Platform Fees
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <strong>Host Service Fee:</strong> 3% of the booking
                    subtotal
                  </p>
                </div>
              </div>
            </section>

            {/* Guest Guidelines */}
            <section
              id="guest"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Guest Guidelines
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Booking Requirements
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Valid government-issued ID required for check-in</li>
                  <li>Credit card must match the name on the booking</li>
                  <li>Minimum age requirement: 18 years</li>
                  <li>Accurate guest count must be provided</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Property Rules
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Respect property rules and local regulations</li>
                  <li>No smoking in non-smoking properties</li>
                  <li>No parties or events unless explicitly allowed</li>
                  <li>
                    Respect neighbors and maintain reasonable noise levels
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Damage Policy
                </h3>
                <p className="text-slate-600 mb-4">
                  Guests are responsible for any damage to the property during
                  their stay. Additional charges may apply for excessive
                  cleaning or repairs.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Review System
                </h3>
                <p className="text-slate-600 mb-4">
                  We encourage honest reviews to help future guests and hosts.
                  Reviews must be based on actual experiences and comply with
                  our community standards.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section
              id="payment"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Payment Terms
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Accepted Payment Methods
                </h3>
                <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                  <li>Credit Cards (Visa, MasterCard, American Express)</li>
                  <li>Debit Cards</li>
                  <li>Bank Transfers</li>
                  <li>Digital Wallets (JazzCash, EasyPaisa)</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Payment Processing
                </h3>
                <p className="text-slate-600 mb-4">
                  All payments are processed securely through our payment
                  partners. We do not store your complete payment information on
                  our servers.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Service Fees
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800">
                    <strong>Guest Service Fee:</strong> 5-15% of the booking
                    subtotal (varies by booking value and payment method)
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Refund Policy
                </h3>
                <p className="text-slate-600 mb-4">
                  Refunds are processed according to the cancellation policy of
                  each property. Refunds typically take 5-10 business days to
                  appear in your account.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Currency
                </h3>
                <p className="text-slate-600 mb-4">
                  All prices are displayed in Pakistani Rupees (PKR).
                  International payments may be subject to currency conversion
                  fees by your bank.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Contact Us
              </h2>
              <p className="text-slate-600 mb-4">
                If you have any questions about these Terms and Policies, please
                contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Email Support
                  </h4>
                  <p className="text-slate-600">support@peshawarstays.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Phone Support
                  </h4>
                  <p className="text-slate-600">+92-91-123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Address</h4>
                  <p className="text-slate-600">
                    University Road, Peshawar, KPK, Pakistan
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Business Hours
                  </h4>
                  <p className="text-slate-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
      >
        <ArrowLeft className="h-5 w-5 rotate-90" />
      </motion.button>
    </div>
  );
}
