"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CreditCard,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BookingConfirmPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel");
  const roomType = searchParams.get("room");
  const checkIn = searchParams.get("checkin");
  const checkOut = searchParams.get("checkout");
  const guests = searchParams.get("guests");
  const total = searchParams.get("total");

  const handlePayment = () => {
    // Simulate payment processing
    alert(
      "Payment gateway integration would be implemented here. Redirecting to payment..."
    );
    // In real implementation, redirect to payment gateway
    setTimeout(() => {
      window.location.href = "/booking/success";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Confirm Your Booking
            </h1>
            <p className="text-muted-foreground">
              Review your details and complete your reservation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-luxury-gold" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=100&width=150"
                      alt="Hotel"
                      width={150}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-primary">
                        Pearl Continental Peshawar
                      </h3>
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        University Town, Peshawar
                      </p>
                      <Badge className="bg-luxury-gold text-primary mt-2">
                        {roomType}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-primary">Check-in</p>
                      <p className="text-muted-foreground">
                        {checkIn
                          ? new Date(checkIn).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Check-out</p>
                      <p className="text-muted-foreground">
                        {checkOut
                          ? new Date(checkOut).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Guests</p>
                      <p className="text-muted-foreground">{guests} guests</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Duration</p>
                      <p className="text-muted-foreground">
                        {checkIn && checkOut
                          ? Math.ceil(
                              (new Date(checkOut).getTime() -
                                new Date(checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0}{" "}
                        nights
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Users className="h-5 w-5 mr-2 text-luxury-gold" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-primary">Name</p>
                      <p className="text-muted-foreground">John Doe</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Email</p>
                      <p className="text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        john.doe@example.com
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Phone</p>
                      <p className="text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        +92 300 1234567
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        Special Requests
                      </p>
                      <p className="text-muted-foreground">Late check-in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-luxury-gold" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg bg-luxury-cream">
                      <input
                        type="radio"
                        name="payment"
                        defaultChecked
                        className="text-luxury-gold"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary">
                          Credit/Debit Card
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, or local bank cards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <input
                        type="radio"
                        name="payment"
                        className="text-luxury-gold"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary">
                          JazzCash / EasyPaisa
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mobile wallet payment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <input
                        type="radio"
                        name="payment"
                        className="text-luxury-gold"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary">
                          Bank Transfer
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Direct bank transfer
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Rate</span>
                      <span className="font-medium">
                        PKR{" "}
                        {total
                          ? (
                              Number.parseInt(total) -
                              Math.round(Number.parseInt(total) * 0.05)
                            ).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-medium">
                        PKR{" "}
                        {total
                          ? Math.round(
                              Number.parseInt(total) * 0.05
                            ).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes</span>
                      <span className="font-medium">Included</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-primary">Total Amount</span>
                    <span className="text-primary">
                      PKR{" "}
                      {total ? Number.parseInt(total).toLocaleString() : "0"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Free cancellation until 24 hours before check-in
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Instant confirmation
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Secure payment processing
                    </div>
                  </div>

                  <Button
                    className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold py-3 text-lg"
                    onClick={handlePayment}
                  >
                    Complete Booking
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this booking, you agree to our Terms of
                    Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
