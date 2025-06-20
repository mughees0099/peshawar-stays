"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Download, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/currentUser";

export default function BookingSuccessPage() {
  const { user: currentUser, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loading && !currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You must be logged in to view this page.
          </p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-primary mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your reservation has been successfully confirmed. We've sent a
              confirmation email with all the details.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-primary">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="font-medium text-primary">Booking ID</p>
                    <p className="text-muted-foreground">PSW-2024-001234</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Hotel</p>
                    <p className="text-muted-foreground">
                      Pearl Continental Peshawar
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Check-in</p>
                    <p className="text-muted-foreground">February 15, 2024</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Check-out</p>
                    <p className="text-muted-foreground">February 18, 2024</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Room Type</p>
                    <p className="text-muted-foreground">Deluxe Room</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Total Amount</p>
                    <p className="text-muted-foreground font-bold">
                      PKR 47,250
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold">
                <Download className="h-4 w-4 mr-2" />
                Download Confirmation
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/customer">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View My Bookings
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Link href="/dashboard/customer">
              <Button variant="ghost" className="text-primary">
                <Home className="h-4 w-4 mr-2" />
                View Booking
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-12 p-6 bg-blue-50 rounded-lg"
          >
            <h3 className="font-semibold text-primary mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your email for detailed confirmation</li>
              <li>• Contact the hotel directly for special requests</li>
              <li>• Arrive at the hotel with a valid ID</li>
              <li>• Enjoy your stay at PeshawarStays!</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
