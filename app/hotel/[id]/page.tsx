"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Waves,
  CalendarIcon,
  Users,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Mock hotel data
const hotelData = {
  id: 1,
  name: "Pearl Continental Peshawar",
  location: "University Town, Peshawar",
  price: 15000,
  rating: 4.8,
  feedbacks: 324,
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  amenities: [
    "Wifi",
    "Parking",
    "Restaurant",
    "Pool",
    "Spa",
    "Gym",
    "Room Service",
  ],
  type: "Luxury Hotel",
  description:
    "Experience luxury at its finest with world-class amenities and exceptional service. Located in the heart of University Town, Pearl Continental Peshawar offers elegant accommodations with modern facilities and traditional Pakistani hospitality.",
  rooms: [
    { type: "Standard Room", price: 12000, capacity: 2, available: 5 },
    { type: "Deluxe Room", price: 15000, capacity: 2, available: 3 },
    { type: "Executive Suite", price: 25000, capacity: 4, available: 2 },
    { type: "Presidential Suite", price: 45000, capacity: 6, available: 1 },
  ],
  reviews: [
    {
      id: 1,
      name: "Ahmed Khan",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Excellent service and beautiful rooms. The staff was very helpful and the location is perfect.",
    },
    {
      id: 2,
      name: "Sarah Ali",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Great hotel with good amenities. The breakfast was delicious and the pool area is lovely.",
    },
    {
      id: 3,
      name: "Muhammad Hassan",
      rating: 5,
      date: "2024-01-05",
      comment:
        "Outstanding experience! Will definitely stay here again. Highly recommended.",
    },
  ],
};

const amenityIcons = {
  Wifi: Wifi,
  Parking: Car,
  Restaurant: Coffee,
  Pool: Waves,
  Spa: Star,
  Gym: Users,
  "Room Service": Coffee,
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function HotelDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === hotelData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? hotelData.images.length - 1 : prev - 1
    );
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const room = hotelData.rooms.find((r) => r.type === selectedRoom);
    return nights * (room?.price || 0);
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const diffInTime = checkOut.getTime() - checkIn.getTime();
      if (diffInTime <= 0) {
        alert("Checkout date must be at least one day after check-in.");
        setCheckOut(undefined);
      }
    }
  }, [checkIn, checkOut]);

  const getNextDay = (date: Date) => {
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    return next;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link href="/hotels" className="text-primary hover:underline">
            ← Back to Hotels
          </Link>
        </motion.div>

        {/* Hotel Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hotelData.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{hotelData.rating}</span>
                  <span className="ml-1">({hotelData.feedbacks} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotelData.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mb-8"
            >
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={
                    hotelData.images[currentImageIndex] || "/placeholder.svg"
                  }
                  alt={`${hotelData.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {hotelData.images.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
              <p className="text-muted-foreground leading-relaxed">
                {hotelData.description}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotelData.amenities.map((amenity, index) => {
                  const Icon =
                    amenityIcons[amenity as keyof typeof amenityIcons];
                  return (
                    <motion.div
                      key={amenity}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <span>{amenity}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Room Types */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Room Types</h2>
              <div className="space-y-4">
                {hotelData.rooms.map((room, index) => (
                  <motion.div
                    key={room.type}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{room.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              Up to {room.capacity} guests • {room.available}{" "}
                              rooms available
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              PKR {room.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per night
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div {...fadeInUp} transition={{ delay: 1.2 }}>
              <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>
              <div className="space-y-4">
                {hotelData.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="sticky top-24 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Your Stay</span>
                    <Badge className="bg-luxury-gold text-primary">
                      {hotelData.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showBookingForm ? (
                    <>
                      {/* Quick Booking Form */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="checkin">Check-in</Label>
                          <Popover
                            open={checkInOpen}
                            onOpenChange={setCheckInOpen}
                          >
                            <PopoverTrigger asChild>
                              <motion.div whileHover={{ scale: 1.02 }}>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {checkIn
                                    ? format(checkIn, "MMM dd")
                                    : "Select"}
                                </Button>
                              </motion.div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={checkIn}
                                onSelect={(date) => {
                                  setCheckIn(date);
                                  setCheckInOpen(false);
                                }}
                                disablePastDates={true}
                                initialFocus
                                modifiersClassNames={{
                                  disabled:
                                    "text-gray-400 opacity-40 cursor-not-allowed hover:bg-transparent",
                                }}
                                classNames={{
                                  months: "flex flex-col space-y-4",
                                  month: "space-y-4",
                                  caption:
                                    "flex justify-center text-center items-center px-4 pt-4",
                                  caption_label:
                                    "text-lg font-semibold flex justify-center text-gray-800",
                                  nav: "flex items-center justify-between gap-2",
                                  nav_button:
                                    "h-8 w-8 rounded-md border text-gray-600 hover:bg-gray-100 transition",
                                  table: "w-full border-collapse space-y-1",
                                  head_row: "flex",
                                  head_cell:
                                    "flex-1 text-center text-sm font-semibold text-gray-600",
                                  row: "flex w-full mt-1",
                                  cell: "h-10 w-10 text-center text-sm p-0 relative",
                                  day: "h-10 w-10 text-center rounded-md text-sm hover:bg-primary hover:text-white transition",
                                  day_selected:
                                    "bg-primary text-center text-white",
                                  day_today:
                                    "border border-primary font-bold text-primary",
                                  day_disabled:
                                    "text-gray-400 opacity-40 cursor-not-allowed",
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="checkout">Check-out</Label>
                          <Popover
                            open={checkOutOpen}
                            onOpenChange={setCheckOutOpen}
                          >
                            <PopoverTrigger asChild>
                              <motion.div whileHover={{ scale: 1.02 }}>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {checkOut
                                    ? format(checkOut, "MMM dd")
                                    : "Select"}
                                </Button>
                              </motion.div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={checkOut}
                                onSelect={(date) => {
                                  setCheckOut(date);
                                  setCheckOutOpen(false);
                                }}
                                disablePastDates={true}
                                disabled={
                                  checkIn
                                    ? [{ before: getNextDay(checkIn) }, checkIn]
                                    : { before: new Date() }
                                }
                                initialFocus
                                modifiersClassNames={{
                                  disabled:
                                    "text-gray-400 opacity-40 cursor-not-allowed hover:bg-transparent",
                                }}
                                classNames={{
                                  months: "flex flex-col space-y-4",
                                  month: "space-y-4",
                                  caption:
                                    "flex justify-center text-center items-center px-4 pt-4",
                                  caption_label:
                                    "text-lg font-semibold flex justify-center text-gray-800",
                                  nav: "flex items-center justify-between gap-2",
                                  nav_button:
                                    "h-8 w-8 rounded-md border text-gray-600 hover:bg-gray-100 transition",
                                  table: "w-full border-collapse space-y-1",
                                  head_row: "flex",
                                  head_cell:
                                    "flex-1 text-center text-sm font-semibold text-gray-600",
                                  row: "flex w-full mt-1",
                                  cell: "h-10 w-10 text-center text-sm p-0 relative",
                                  day: "h-10 w-10 text-center rounded-md text-sm hover:bg-primary hover:text-white transition",
                                  day_selected:
                                    "bg-primary text-center text-white",
                                  day_today:
                                    "border border-primary font-bold text-primary",
                                  day_disabled:
                                    "text-gray-400 opacity-40 cursor-not-allowed",
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="guests">Guests</Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 guest</SelectItem>
                            <SelectItem value="2">2 guests</SelectItem>
                            <SelectItem value="3">3 guests</SelectItem>
                            <SelectItem value="4">4 guests</SelectItem>
                            <SelectItem value="5">5+ guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="room">Room Type</Label>
                        <Select
                          value={selectedRoom}
                          onValueChange={setSelectedRoom}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {hotelData.rooms.map((room) => (
                              <SelectItem key={room.type} value={room.type}>
                                {room.type} - PKR {room.price.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {checkIn && checkOut && selectedRoom && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-t pt-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span>Total</span>
                            <span className="text-lg font-bold">
                              PKR {calculateTotal().toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {Math.ceil(
                              (checkOut.getTime() - checkIn.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </p>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                          size="lg"
                          onClick={() => setShowBookingForm(true)}
                          disabled={!checkIn || !checkOut || !selectedRoom}
                        >
                          Continue to Book
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Enhanced Booking Form */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            placeholder="+92 300 1234567"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="requests">Special Requests</Label>
                          <Textarea
                            id="requests"
                            placeholder="Any special requests or requirements"
                            rows={3}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Room: {selectedRoom}</span>
                            <span>
                              PKR{" "}
                              {hotelData.rooms
                                .find((r) => r.type === selectedRoom)
                                ?.price.toLocaleString()}
                              /night
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Dates: {checkIn && format(checkIn, "MMM dd")} -{" "}
                              {checkOut && format(checkOut, "MMM dd")}
                            </span>
                            <span>
                              {Math.ceil(
                                (checkOut!.getTime() - checkIn!.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              nights
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Service Fee</span>
                            <span>
                              PKR{" "}
                              {Math.round(
                                calculateTotal() * 0.05
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total Amount</span>
                            <span>
                              PKR{" "}
                              {(
                                calculateTotal() +
                                Math.round(calculateTotal() * 0.05)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowBookingForm(false)}
                            >
                              Back
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              className="flex-1 bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                              onClick={() => {
                                // Validate form
                                const name = (
                                  document.getElementById(
                                    "name"
                                  ) as HTMLInputElement
                                )?.value;
                                const email = (
                                  document.getElementById(
                                    "email"
                                  ) as HTMLInputElement
                                )?.value;
                                const phone = (
                                  document.getElementById(
                                    "phone"
                                  ) as HTMLInputElement
                                )?.value;

                                if (!name || !email || !phone) {
                                  alert("Please fill in all required fields");
                                  return;
                                }

                                // Redirect to booking confirmation
                                window.location.href = `/booking/confirm?hotel=${
                                  hotelData.id
                                }&room=${selectedRoom}&checkin=${checkIn?.toISOString()}&checkout=${checkOut?.toISOString()}&guests=${guests}&total=${
                                  calculateTotal() +
                                  Math.round(calculateTotal() * 0.05)
                                }`;
                              }}
                            >
                              Confirm Booking
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
