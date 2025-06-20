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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  MapPin,
  Waves,
  CalendarIcon,
  Users,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useCurrentUser } from "@/hooks/currentUser";
import { toast } from "react-toastify";
interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
  propertyType:
    | "Luxury Hotel"
    | "Business Hotel"
    | "Guest House"
    | "Standard Hotel";
  images: Array<{
    url: string;
    altText?: string;
  }>;
  amenities: string[];
  reviews: Array<{
    customer: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }>;
  roomDetails: Array<{
    type: "standard" | "deluxe" | "executive" | "presidential";
    totalRooms: number;
    availableRooms: number;
    pricePerNight: number;
    amenities: string[];
    customerCapacity: number;
    images: Array<{
      url?: string;
      altText?: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

const getRoomDisplayName = (type: string) => {
  const roomTypes = {
    standard: "standard",
    deluxe: "deluxe",
    executive: "executive",
    presidential: "presidential",
  };

  return roomTypes[type as keyof typeof roomTypes] || type;
};

const amenityIcons = {
  // Wifi: Wifi,
  // "Free WiFi": Wifi,
  // Parking: Car,
  // Restaurant: Coffee,
  // Pool: Waves,
  // Spa: Star,
  // Gym: Users,
  // "Room Service": Coffee,
  // "Air Conditioning": Waves,
  // Breakfast: Coffee,
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [roomImageIndexes, setRoomImageIndexes] = useState<{
    [key: string]: number;
  }>({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState<
    Array<{ url?: string; altText?: string }>
  >([]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [cnfrmLoading, setCnfrmLoading] = useState(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const room = property?.roomDetails.find(
      (r) => getRoomDisplayName(r.type) === selectedRoom
    );
    return nights * (room?.pricePerNight || 0);
  };

  const getNextDay = (date: Date) => {
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    return next;
  };

  const setRoomImageIndex = (roomType: string, index: number) => {
    setRoomImageIndexes((prev) => ({
      ...prev,
      [roomType]: index,
    }));
  };

  const getRoomImageIndex = (roomType: string) => {
    return roomImageIndexes[roomType] || 0;
  };

  const openImageModal = (
    images: Array<{ url?: string; altText?: string }>,
    startIndex = 0
  ) => {
    setModalImages(images);
    setModalImageIndex(startIndex);
    setShowImageModal(true);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const handleContinueBooking = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    setShowBookingForm(true);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    }
  };

  const handleSave = async () => {
    if (!user || !property) return;
    try {
      const response = await axios.patch("/api/auth/me", {
        favoriteProperties: property?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
      });
      if (response.status === 200) {
        setIsSaved(true);
        toast.success("Property saved to your favorites!");
      }
    } catch (error) {
      toast.error("Failed to save property. Please try again.");
      setIsSaved(false);
    }
  };

  const handleUnSave = async () => {
    if (!user || !property) return;
    try {
      const response = await axios.patch("/api/auth/me", {
        favoriteProperties: property?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        remove: true,
      });
      if (response.status === 200) {
        toast.success("Property removed from your favorites!");
        setIsSaved(false);
      }
    } catch (error) {
      toast.error(
        "Failed to remove property from favorites. Please try again."
      );
      setIsSaved(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !property) return;

    try {
      setSubmittingReview(true);
      await axios.patch(`/api/Property/${property._id}/reviews`, {
        customer: user._id,
        rating: reviewRating,
        comment: reviewComment,
      });

      const response = await axios.get(`/api/Property/${id}`);
      setProperty(response.data);

      setReviewRating(5);
      setReviewComment("");
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmBooking = async () => {
    setCnfrmLoading(true);
    const name = (document.getElementById("name") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;
    const requests = (
      document.getElementById("requests") as HTMLTextAreaElement
    )?.value;

    if (!name || !email || !phone) {
      toast.error("please fill in all fields before confirming booking.");
      return;
    }

    if (!property) {
      toast.error("Property details are not available.");
      return;
    }
    const selectedRoomDetails = property.roomDetails.find(
      (r) => getRoomDisplayName(r.type) === selectedRoom
    );

    const nights = Math.ceil(
      (checkOut!.getTime() - checkIn!.getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = calculateTotal();
    const serviceFee = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + serviceFee;

    const bookingData = {
      property: property._id,
      owner: property.owner._id,
      customer: user?._id,
      checkIn: checkIn,
      checkOut: checkOut,
      totalAmount: totalAmount,
      status: "pending",
      specialRequests: requests || null,
      roomType: selectedRoom,
      numberOfGuests: guests,
    };

    try {
      const response = await axios.post("/api/booking", bookingData);
      if (response.status === 201) {
        toast.success("Booking request submitted successfully!");
        setCheckIn(undefined);
        setCheckOut(undefined);
        setGuests("2");
        setSelectedRoom("");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking submission failed");
    } finally {
      setCnfrmLoading(false);
      setShowBookingForm(false);
    }
  };

  useEffect(() => {
    async function fetchPropertyDetails() {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/Property/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const diffInTime = checkOut.getTime() - checkIn.getTime();
      if (diffInTime <= 0) {
        alert("Checkout date must be at least one day after check-in.");
        setCheckOut(undefined);
      }
    }
  }, [checkIn, checkOut]);
  useEffect(() => {
    if (user && property) {
      setIsSaved(user.favoriteProperties?.includes(property._id) || false);
    }
  }, [user, property]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Property not found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, review) => sum + review.rating, 0) /
        property.reviews.length
      : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Copied Alert */}
      {showCopiedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <Alert className="bg-green-500 text-white border-green-600">
            <Check className="h-4 w-4" />
            <AlertDescription>Link copied to clipboard!</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in first to continue with your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button asChild className="flex-1">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with other travelers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Comment (Optional)</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell us about your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogTitle> </DialogTitle>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src={modalImages[modalImageIndex]?.url || "/placeholder.svg"}
                alt={
                  modalImages[modalImageIndex]?.altText ||
                  `Image ${modalImageIndex + 1}`
                }
                fill
                className="object-contain"
              />

              {modalImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
                    onClick={prevModalImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
                    onClick={nextModalImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full">
                {modalImageIndex + 1} / {modalImages.length}
              </div>

              {/* Close Button */}
            </div>

            {/* Thumbnail Navigation */}
            {modalImages.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto justify-center">
                  {modalImages.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${
                        index === modalImageIndex
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      onClick={() => setModalImageIndex(index)}
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.altText || `Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link href="/hotels" className="text-primary hover:underline">
            ← Back to Properties
          </Link>
        </motion.div>

        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {property.address.length > 100
                      ? `${property.address.slice(0, 100)}...`
                      : property.address}
                  </span>
                </div>
              </div>
              <div className="flex items-center my-5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">
                  {averageRating > 0 ? averageRating.toFixed(1) : "New"}
                </span>
                <span className="ml-1">
                  ({property.reviews.length} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSaved ? (
                  <Button variant="outline" size="sm" onClick={handleUnSave}>
                    <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                  </Button>
                ) : (
                  <>
                    {user ? (
                      user?.role === "host" || user?.role === "admin" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            user?.role === "host"
                              ? toast.error("Hosts cannot save properties")
                              : toast.error("Admins cannot save properties");
                          }}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSave}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.error("Please log in to save properties");
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    )}
                  </>
                )}
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
                    property.images[currentImageIndex]?.url ||
                    "/placeholder.svg?height=400&width=600"
                  }
                  alt={
                    property.images[currentImageIndex]?.altText ||
                    `${property.name} - Image ${currentImageIndex + 1}`
                  }
                  fill
                  className="object-fill"
                />
                {property.images.length > 1 && (
                  <>
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
                      {property.images.map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
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
                {property.amenities.map((amenity, index) => {
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
                      {/* {Icon && <Icon className="h-5 w-5 text-primary" />} */}
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
              <div className="space-y-6">
                {property.roomDetails.map((room, index) => {
                  const currentRoomImageIndex = getRoomImageIndex(room.type);
                  const roomImages =
                    room.images?.filter((img) => img.url) || [];

                  return (
                    <motion.div
                      key={room.type}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="shadow-lg border-0 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                          {/* Room Images */}
                          <div className="md:col-span-1">
                            {roomImages.length > 0 ? (
                              <div className="relative h-48 md:h-full">
                                <Image
                                  src={
                                    roomImages[currentRoomImageIndex]?.url ||
                                    "/placeholder.svg"
                                  }
                                  alt={
                                    roomImages[currentRoomImageIndex]
                                      ?.altText ||
                                    `${getRoomDisplayName(room.type)} image`
                                  }
                                  fill
                                  className="object-cover cursor-pointer"
                                  onClick={() =>
                                    openImageModal(
                                      roomImages,
                                      currentRoomImageIndex
                                    )
                                  }
                                />

                                {/* Image Navigation Arrows */}
                                {roomImages.length > 1 && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex =
                                          currentRoomImageIndex === 0
                                            ? roomImages.length - 1
                                            : currentRoomImageIndex - 1;
                                        setRoomImageIndex(room.type, newIndex);
                                      }}
                                    >
                                      <ChevronLeft className="h-3 w-3" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex =
                                          currentRoomImageIndex ===
                                          roomImages.length - 1
                                            ? 0
                                            : currentRoomImageIndex + 1;
                                        setRoomImageIndex(room.type, newIndex);
                                      }}
                                    >
                                      <ChevronRight className="h-3 w-3" />
                                    </motion.button>
                                  </>
                                )}

                                {/* Image Counter */}
                                {roomImages.length > 1 && (
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {currentRoomImageIndex + 1} /{" "}
                                    {roomImages.length}
                                  </div>
                                )}

                                {/* View All Images Button */}
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="absolute top-2 right-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageModal(
                                      roomImages,
                                      currentRoomImageIndex
                                    );
                                  }}
                                >
                                  View All
                                </Button>
                              </div>
                            ) : (
                              <div className="relative h-48 md:h-full bg-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <Image
                                    src="/placeholder.svg?height=200&width=300"
                                    alt={`${getRoomDisplayName(
                                      room.type
                                    )} placeholder`}
                                    width={300}
                                    height={200}
                                    className="opacity-50"
                                  />
                                  <p className="mt-2 text-sm">
                                    No image available
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Room Details */}
                          <CardContent className="md:col-span-2 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">
                                  {getRoomDisplayName(room.type)}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    Up to {room.customerCapacity} guests
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {room.availableRooms} available
                                    </Badge>
                                  </span>
                                </div>

                                {/* Room Amenities */}
                                {room.amenities.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">
                                      Room Amenities:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {room.amenities
                                        .slice(0, 4)
                                        .map((amenity) => {
                                          const Icon =
                                            amenityIcons[
                                              amenity as keyof typeof amenityIcons
                                            ];
                                          return (
                                            <Badge
                                              key={amenity}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {Icon && (
                                                <Icon className="h-3 w-3 mr-1" />
                                              )}
                                              {amenity}
                                            </Badge>
                                          );
                                        })}
                                      {room.amenities.length > 4 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{room.amenities.length - 4} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Room Images Gallery Thumbnails */}
                                {roomImages.length > 1 && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">
                                      Room Gallery:
                                    </p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                      {roomImages.map((image, imgIndex) => (
                                        <motion.div
                                          key={imgIndex}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${
                                            imgIndex === currentRoomImageIndex
                                              ? "border-primary"
                                              : "border-transparent"
                                          }`}
                                          onClick={() =>
                                            setRoomImageIndex(
                                              room.type,
                                              imgIndex
                                            )
                                          }
                                        >
                                          <Image
                                            src={
                                              image.url ||
                                              "/placeholder.svg?height=64&width=64"
                                            }
                                            alt={
                                              image.altText ||
                                              `${getRoomDisplayName(
                                                room.type
                                              )} image ${imgIndex + 1}`
                                            }
                                            fill
                                            className="object-cover"
                                          />
                                          {imgIndex ===
                                            currentRoomImageIndex && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            </div>
                                          )}
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Pricing */}
                              <div className="text-right ml-4">
                                <div className="text-2xl font-bold text-primary">
                                  PKR {room.pricePerNight.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  per night
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="mt-3"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedRoom(
                                        getRoomDisplayName(room.type)
                                      );
                                      // Scroll to booking form
                                      document
                                        .querySelector(".sticky")
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                        });
                                    }}
                                    disabled={room.availableRooms === 0}
                                  >
                                    {room.availableRooms === 0
                                      ? "Sold Out"
                                      : "Select Room"}
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div {...fadeInUp} transition={{ delay: 1.2 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Guest Reviews</h2>
                {user && (
                  <Button
                    onClick={() => {
                      user?.role === "host"
                        ? toast.error("Hosts cannot write reviews")
                        : user?.role === "admin"
                        ? toast.error("Admins cannot write reviews")
                        : setShowReviewForm(true);
                    }}
                    size="sm"
                  >
                    Write Review
                  </Button>
                )}
              </div>

              {property.reviews.length > 0 ? (
                <div className="space-y-4">
                  {property.reviews.slice(0, 5).map((review, index) => (
                    <motion.div
                      key={index}
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
                              <h4 className="font-semibold">
                                {`${review.customer.firstName} ${review.customer.lastName} `}
                              </h4>
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
                              {format(
                                new Date(review.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground text-lg">
                      No reviews yet.
                    </p>
                    {user && (
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="mt-4"
                      >
                        Be the first to review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
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
                    <Badge className="bg-primary/10 text-primary">
                      {property.propertyType}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showBookingForm ? (
                    <>
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
                            {property.roomDetails
                              .filter((room) => room.availableRooms > 0)
                              .map((room) => (
                                <SelectItem
                                  key={room.type}
                                  value={getRoomDisplayName(room.type)}
                                >
                                  {getRoomDisplayName(room.type)} - PKR{" "}
                                  {room.pricePerNight.toLocaleString()}
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
                          className="w-full"
                          size="lg"
                          onClick={() => {
                            user?.role === "host"
                              ? toast.error("Hosts cannot book properties")
                              : user?.role === "admin"
                              ? toast.error("Admins cannot book properties")
                              : handleContinueBooking();
                          }}
                          disabled={!checkIn || !checkOut || !selectedRoom}
                        >
                          Continue to Book
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Enhanced Booking Form with Auto-filled Data */}
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
                            defaultValue={
                              user?.firstName.charAt(0).toUpperCase() +
                                user?.firstName.slice(1).toLowerCase() +
                                "  " +
                                user?.lastName.charAt(0).toUpperCase() +
                                user?.lastName.slice(1).toLowerCase() || ""
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            defaultValue={user?.email || ""}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            placeholder="+92 300 1234567"
                            defaultValue={user?.phone || ""}
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
                              {property.roomDetails
                                .find(
                                  (r) =>
                                    getRoomDisplayName(r.type) === selectedRoom
                                )
                                ?.pricePerNight.toLocaleString()}
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
                          <Button
                            className="flex-1"
                            onClick={handleConfirmBooking}
                          >
                            {cnfrmLoading ? (
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            ) : (
                              "Confirm Booking"
                            )}
                          </Button>
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
