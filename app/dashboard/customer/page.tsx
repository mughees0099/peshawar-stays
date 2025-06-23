"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Star,
  CreditCard,
  User,
  Heart,
  MessageSquare,
  Loader2,
  Bed,
  EyeOff,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/currentUser";
import axios from "axios";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Booking = {
  hotelName: string;
  address: string;
  roomType: string;
  guests: number;
  total: number;
  image: any;
  status: string;
  id: string;
  checkIn: string;
  checkOut: string;
  bookingDate: string;
  bookingReference?: string;
  paymentMethod?: string;
  specialRequests?: string;
  propertyId?: string;
};

type FavoriteHotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
};

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const { user: currentUser, loading } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    imageFile: null as File | null,
    imageUrl: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });

  const [saving, setSaving] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        gender: currentUser.gender || "",
        phone: currentUser.phone || "",
        imageFile: null,
        email: currentUser.email || "",
        imageUrl: currentUser.imageUrl || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && activeTab === "bookings" && bookings.length === 0) {
      setLoadingBookings(true);

      async function fetchData() {
        try {
          const response = await axios.get(`/api/booking/${currentUser._id}`);

          if (response.status === 200) {
            const bookingsData = await Promise.all(
              response.data.map(async (booking: any) => {
                const property = await axios.get(
                  `/api/Property/${booking.property}`
                );

                return {
                  hotelName: property.data.name,
                  address: property.data.address,
                  roomType: booking.roomType,
                  guests: booking.numberOfGuests,
                  total: booking.totalAmount,
                  image: property.data.images[0] || "/placeholder.svg",
                  status: booking.status,
                  id: booking._id,
                  checkIn: new Date(booking.checkIn).toLocaleDateString(),
                  checkOut: new Date(booking.checkOut).toLocaleDateString(),
                  bookingDate: new Date(booking.createdAt).toLocaleDateString(),
                  bookingReference: booking._id.slice(-8).toUpperCase(),
                  paymentMethod: booking.paymentMethod || "Credit Card",
                  specialRequests: booking.specialRequests || "",
                  propertyId: booking.property,
                };
              })
            );

            setBookings(bookingsData);
          }
        } catch (error) {
        } finally {
          setLoadingBookings(false);
        }
      }

      fetchData();
    }
  }, [currentUser, activeTab, bookings.length]);

  useEffect(() => {
    async function fetchReviews() {
      if (activeTab === "reviews" && reviews.length === 0) {
        setLoadingReviews(true);
        try {
          const response = await axios.get("/api/customer-reviews");
          if (response.status === 200) {
            setReviews(response.data);
          } else {
            console.error("Error fetching reviews:", response.data);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        } finally {
          setLoadingReviews(false);
        }
      }
    }
    fetchReviews();
  }, [activeTab]);

  useEffect(() => {
    if (currentUser && activeTab === "favorites" && favorites.length === 0) {
      setLoadingFavorites(true);

      async function fetchFavorites() {
        try {
          const fetchedFavorites = await Promise.all(
            currentUser.favoriteProperties.map(async (favorite: any) => {
              try {
                const response = await axios.get(`/api/Property/${favorite}`);
                const property = response.data;

                return {
                  id: property._id,
                  name: property.name,
                  location: property.address,
                  price: property.pricePerNight || 0,
                  image: property.images[0]?.url || "/placeholder.svg",
                  rating:
                    property.reviews.length > 0
                      ? property.reviews.reduce(
                          (sum: any, review: any) => sum + review.rating,
                          0
                        ) / property.reviews.length
                      : 0,
                };
              } catch (err) {
                console.error("Error fetching one favorite:", err);
                return null;
              }
            })
          );

          const cleaned = fetchedFavorites.filter(Boolean);
          setFavorites(cleaned);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoadingFavorites(false);
        }
      }

      fetchFavorites();
    }
  }, [currentUser, activeTab, favorites.length]);

  const handleunSave = async (propertyId: any) => {
    try {
      if (!currentUser) {
        return;
      }
      const response = await axios.patch("/api/auth/me", {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        favoriteProperties: propertyId,
        remove: true,
      });
      if (response.status === 200) {
        toast.success("Property removed from your favorites!");
        localStorage.setItem("active", "favorites");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    localStorage.getItem("active") === "favorites"
      ? setActiveTab("favorites")
      : setActiveTab("bookings");

    localStorage.removeItem("active");
  }, []);

  const handleViewBookingDetails = (bookingId: string) => {
    setShowBookingDetails(bookingId);
  };

  const handleCancelBooking = async (bookingId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "green",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/booking/${bookingId}`);
          if (response.status === 200) {
            toast.success("Booking cancelled successfully!");
            setBookings((prev) =>
              prev.filter((booking) => booking.id !== bookingId)
            );
            setShowBookingDetails(null);
          } else {
            toast.error("Failed to cancel booking. Please try again.");
          }
        } catch (error) {
          console.error("Error cancelling booking:", error);
          toast.error("Failed to cancel booking. Please try again.");
        }
      }
    });
  };

  const handleWriteReview = (bookingId: string) => {
    // Navigate to review form
    window.location.href = `/review/write/${bookingId}`;
  };

  const handleEditProfile = () => {
    alert("Opening profile edit form...");
    // Add profile edit modal logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSave = async () => {
    if (formData.phone.length !== 11 || !/^\d{11}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 11 digits.");
      return;
    }
    if (!formData.firstName) {
      toast.error("Please fill in your first name.");
      return;
    }
    if (!formData.lastName) {
      toast.error("Please fill in your last name.");
      return;
    }

    setSaving(true);

    let uploadedImageUrl = "";

    if (formData.imageFile) {
      const data = new FormData();
      data.append("file", formData.imageFile);
      data.append("upload_preset", "peshawar_stays");
      data.append("folder", "peshawar_stays_profile_images");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_KEY}/image/upload`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to upload image");
        }

        uploadedImageUrl = response.data.secure_url;
      } catch (error) {
        toast.error("Image upload failed.");
        return;
      }
    }

    const payload = {
      ...formData,
      imageUrl: uploadedImageUrl || formData.imageUrl,
    };

    try {
      const response = await axios.patch("/api/profile/user", {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        email: payload.email,
        imageUrl: payload.imageUrl,
        gender: payload.gender,
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({
          ...prev,
          imageUrl: payload.imageUrl,
        }));
        setEditMode(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
    setEditMode(false);
    setSaving(false);
  };

  const validatePassword = (password: string) => {
    const result = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasMinLength: password.length >= 8,
    };

    setPasswordStrength(result);

    const isValid =
      result.hasUpperCase &&
      result.hasLowerCase &&
      result.hasNumber &&
      result.hasSymbol &&
      result.hasMinLength;
    return isValid;
  };

  const handlePasswordSave = () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }

    const isValid = validatePassword(formData.newPassword);

    if (!isValid) {
      toast.error("Password doesn't meet security requirements.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setSaving(true);
    try {
      axios
        .patch("/api/profile/password", {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Password updated successfully!");
            setPasswordMode(false);
            setFormData((prev) => ({
              ...prev,
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }));
          }
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          toast.error(
            error.response?.data?.error ||
              "Failed to update password. Please try again."
          );
        });
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

  if (currentUser && currentUser.role !== "customer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access this page.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and account settings
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Your Bookings</h2>
              {loadingBookings ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading bookings...</p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No bookings found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any bookings yet.
                    </p>
                    <Button asChild>
                      <Link href="/hotels">Find Hotels</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Image
                          src={booking.image.url || "/placeholder.svg"}
                          alt={booking.hotelName}
                          width={150}
                          height={100}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {booking.hotelName}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                <MapPin className="inline h-4 w-4 mr-1" />
                                {booking.address}
                              </p>
                              <p className="text-muted-foreground">
                                <Bed className="inline h-4 w-4 mr-1" />
                                {booking.roomType}
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-800 text-white"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Check-in: {booking.checkIn}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Check-out: {booking.checkOut}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>
                                {booking.guests >= 5 ? "5+" : booking.guests}{" "}
                                guests
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              <span>PKR {booking.total.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleViewBookingDetails(booking.id)
                              }
                            >
                              View Details
                            </Button>
                            {booking.status !== "confirmed" &&
                              booking.status !== "cancelled" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                >
                                  Cancel Booking
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Your Favorite Hotels</h2>
              {loadingFavorites ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Loading favorites...
                    </p>
                  </CardContent>
                </Card>
              ) : favorites.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Add hotels to your favorites to easily find them later.
                    </p>
                    <Button asChild>
                      <Link href="/hotels">Find Hotels</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((hotel) => (
                    <Card
                      className="group cursor-pointer hover:shadow-lg transition-shadow"
                      key={hotel.id}
                    >
                      <div className="relative">
                        <Image
                          src={hotel.image || "/placeholder.svg"}
                          alt={hotel.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleunSave(hotel.id)}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {hotel.location}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">
                              PKR {hotel.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {" "}
                              / night
                            </span>
                          </div>
                        </div>
                        <Link href={`/hotel/${hotel.id}`}>
                          <Button size="sm" className="mt-4">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Your Reviews</h2>

              {loadingReviews ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading reviews...</p>
                  </CardContent>
                </Card>
              ) : reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Share your experience by writing reviews for hotels you've
                      stayed at.
                    </p>
                    <Button>
                      <Link href="/hotels">Write Your First Review</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review, idx) => (
                    <Link href={`/hotel/${review.id}`} key={idx}>
                      <Card className="group hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <Image
                            src={review.propertyImage || "/placeholder.svg"}
                            alt={review.propertyName}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold">
                            {review.propertyName}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {review.propertyAddress}
                          </p>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) =>
                              star <= review.rating ? (
                                <Star
                                  key={star}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ) : (
                                <Star
                                  key={star}
                                  className="w-4 h-4 text-gray-300"
                                />
                              )
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>

                          <p className="text-xs text-gray-400">
                            Reviewed on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        {formData.imageUrl ? (
                          <AvatarImage src={formData.imageUrl} />
                        ) : (
                          <AvatarFallback>
                            {currentUser?.firstName?.charAt(0).toUpperCase()}
                            {currentUser?.lastName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {editMode && (
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];

                                setFormData((prev) => ({
                                  ...prev,
                                  imageFile: file,
                                }));

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    imageUrl: reader.result as string,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const fileInput = document.querySelector(
                                'input[type="file"]'
                              ) as HTMLInputElement;
                              fileInput.click();
                            }}
                          >
                            Change Photo
                          </Button>
                        </>
                      )}
                    </div>

                    {/* First + Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          First Name
                        </label>
                        {editMode ? (
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {formData.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        {editMode ? (
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {formData.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Gender</label>
                      {editMode ? (
                        <div className="space-y-2">
                          <Select
                            name="gender"
                            value={formData.gender}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                gender: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          {currentUser.gender}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      {editMode ? (
                        <Input
                          name="email"
                          value={formData.email}
                          disabled
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {formData.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      {editMode ? (
                        <>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  phone: value,
                                }));
                              }
                            }}
                            maxLength={11}
                            placeholder="Enter 11-digit phone number"
                            className={
                              formData.phone.length !== 11
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {formData.phone.length > 0 &&
                            formData.phone.length !== 11 && (
                              <p className="text-sm text-red-500">
                                Phone number must be exactly 11 digits
                              </p>
                            )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          {formData.phone}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {editMode ? (
                      <div className="flex space-x-3">
                        <Button disabled={saving} onClick={handleProfileSave}>
                          {saving ? "Updating..." : "Update Profile"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setEditMode(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Password Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!passwordMode ? (
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-muted-foreground">
                            Change your account password
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPasswordMode(true)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Old Password */}
                        <div className="relative">
                          <Input
                            name="oldPassword"
                            type={showPassword.old ? "text" : "password"}
                            placeholder="Old Password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                          />
                          <span
                            className="absolute right-3 top-2.5 cursor-pointer"
                            onClick={() => togglePassword("old")}
                          >
                            {showPassword.old ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </span>
                        </div>

                        {/* New Password */}
                        <div className="relative">
                          <Input
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                newPassword: value,
                              }));
                              validatePassword(value);
                            }}
                          />
                          <span
                            className="absolute right-3 top-2.5 cursor-pointer"
                            onClick={() => togglePassword("new")}
                          >
                            {showPassword.new ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium">
                            Password must contain:
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p
                              className={`text-xs ${
                                passwordStrength.hasUpperCase
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ✓ Uppercase letter
                            </p>
                            <p
                              className={`text-xs ${
                                passwordStrength.hasLowerCase
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ✓ Lowercase letter
                            </p>
                            <p
                              className={`text-xs ${
                                passwordStrength.hasNumber
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ✓ Number
                            </p>
                            <p
                              className={`text-xs ${
                                passwordStrength.hasSymbol
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ✓ Symbol
                            </p>
                            <p
                              className={`text-xs ${
                                passwordStrength.hasMinLength
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ✓ 8+ characters
                            </p>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                          <Input
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <span
                            className="absolute right-3 top-2.5 cursor-pointer"
                            onClick={() => togglePassword("confirm")}
                          >
                            {showPassword.confirm ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </span>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            disabled={saving}
                            onClick={handlePasswordSave}
                          >
                            {saving ? "Updating..." : "Update Password"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setPasswordMode(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Details Dialog */}
        {showBookingDetails && (
          <Dialog
            open={!!showBookingDetails}
            onOpenChange={() => setShowBookingDetails(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {(() => {
                  const booking = bookings.find(
                    (b) => b.id === showBookingDetails
                  );
                  if (!booking) return <p>Booking not found</p>;

                  return (
                    <div className="space-y-6">
                      {/* Booking Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium text-gray-700">
                            Hotel Name
                          </Label>
                          <p className="text-gray-900 font-medium">
                            {booking.hotelName}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-700">
                            Room Type
                          </Label>
                          <p className="text-gray-900">{booking.roomType}</p>
                        </div>

                        <div>
                          <Label className="font-medium text-gray-700">
                            Booking Reference
                          </Label>
                          <p className="text-gray-900 font-mono">
                            {booking.bookingReference ||
                              booking.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-700">
                            Status
                          </Label>
                          <Badge
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Stay Details */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-lg mb-3">
                          Stay Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium text-gray-700">
                              Check-in Date
                            </Label>
                            <p className="text-gray-900">{booking.checkIn}</p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Check-out Date
                            </Label>
                            <p className="text-gray-900">{booking.checkOut}</p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Number of Guests
                            </Label>
                            <p className="text-gray-900">{booking.guests}</p>
                          </div>

                          <div>
                            <Label className="font-medium text-gray-700">
                              Total Amount
                            </Label>
                            <p className="text-gray-900 font-bold text-lg">
                              PKR {booking.total.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Address
                            </Label>
                            <p className="text-gray-900">{booking.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      {/* <div className="border-t pt-4">
                        <h4 className="font-semibold text-lg mb-3">
                          Payment Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium text-gray-700">
                              Total Amount
                            </Label>
                            <p className="text-gray-900 font-bold text-lg">
                              PKR {booking.total.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Payment Method
                            </Label>
                            <p className="text-gray-900">
                              {booking.paymentMethod || "Credit Card"}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Booking Date
                            </Label>
                            <p className="text-gray-900">
                              {booking.bookingDate}
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="border-t pt-4">
                          <Label className="font-medium text-gray-700">
                            Special Requests
                          </Label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {booking.status !== "confirmed" &&
                        booking.status !== "cancelled" && (
                          <div className="border-t pt-4 flex gap-2">
                            <Button
                              // variant="outline"
                              size="sm"
                              onClick={() => {
                                router.push(`/hotel/${booking.propertyId}`);
                              }}
                            >
                              View Hotel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleCancelBooking(booking.id);
                                setShowBookingDetails(null);
                              }}
                            >
                              Cancel Booking
                            </Button>
                          </div>
                        )}
                    </div>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
