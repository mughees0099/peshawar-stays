"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Star,
  DollarSign,
  Users,
  Home,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Bed,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/currentUser";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { set } from "mongoose";

interface BookingData {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  propertyName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: string;
  bookingDate: string;
  specialRequests?: string;
  paymentMethod?: string;
  bookingReference?: string;
}

const AMENITIES_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "Swimming Pool",
  "Gym/Fitness Center",
  "Restaurant",
  "Room Service",
  "Parking",
  "Pet Friendly",
  "Spa",
  "Business Center",
  "Laundry Service",
  "Airport Shuttle",
  "Bar/Lounge",
  "Concierge",
  "24/7 Front Desk",
];

const ROOM_TYPES = [
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "executive", label: "Executive" },
  { value: "presidential", label: "Presidential" },
];

interface PropertyImage {
  url: string;
  altText: string;
  file?: File;
  isUploading?: boolean;
}

interface RoomImage {
  url: string;
  altText: string;
  file?: File;
  isUploading?: boolean;
}

interface RoomDetail {
  type: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  amenities: string[];
  customerCapacity: number;
  images: RoomImage[];
}

interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
  owner: string;
  images: PropertyImage[];
  amenities: string[];
  roomDetails: RoomDetail[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState<string | null>(
    null
  );
  const [showBookingDetails, setShowBookingDetails] = useState<string | null>(
    null
  );
  const [bookingFilter, setBookingFilter] = useState("all");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [propertyData, setPropertyData] = useState({
    name: "",
    description: "",
    address: "",
    pricePerNight: "",
    owner: "",
    amenities: [] as string[],
    images: [] as PropertyImage[],
    roomDetails: [] as RoomDetail[],
  });

  const { user: currentUser, loading } = useCurrentUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const router = useRouter();

  // Fetch properties and bookings when user is available
  useEffect(() => {
    if (currentUser?._id) {
      fetchBookings();
      fetchProperties();
    }
  }, [currentUser]);

  useEffect(() => {
    if (properties.length > 0 && recentBookings.length > 0) {
      calculateStats(properties);
    }
  }, [properties, recentBookings]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `/api/Property/properties/${currentUser?._id}`
      );

      if (response.data && Array.isArray(response.data)) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/api/booking/${currentUser?._id}`);
      setRecentBookings(response.data);
    } catch (error) {
      setRecentBookings([]);
    }
  };

  const calculateStats = async (propertiesData: Property[]) => {
    let totalRoomsCount = 0;
    let availableRoomsCount = 0;
    let revenue = 0;

    propertiesData.forEach((property) => {
      property.roomDetails?.forEach((room: RoomDetail) => {
        totalRoomsCount += room.totalRooms || 0;
        availableRoomsCount += room.availableRooms || 0;
      });
    });

    // Calculate revenue from confirmed bookings

    recentBookings.map((booking) => {
      if (booking.status === "confirmed") {
        revenue += booking.totalAmount || 0;
      }
    });

    setTotalRooms(totalRoomsCount);
    setAvailableRooms(availableRoomsCount);
    setTotalRevenue(revenue);

    const occupiedRooms = totalRoomsCount - availableRoomsCount;
    const occupancy =
      totalRoomsCount > 0 ? (occupiedRooms / totalRoomsCount) * 100 : 0;
    setOccupancyRate(Number(occupancy.toFixed(1)));
  };

  // Dynamic stats based on real data
  const stats = [
    {
      title: "Total Revenue",
      value: `PKR ${totalRevenue.toLocaleString()}`,
      change: "+15%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Bookings",
      value: recentBookings
        .filter((b) => b.status === "confirmed")
        .length.toString(),
      change: "+8%",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      change: "+5%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Properties",
      value: properties.length.toString(),
      change: "+2",
      icon: Home,
      color: "text-blue-600",
    },
  ];

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File, folder = "peshawar_stays") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "peshawar_stays");
    formData.append("folder", folder);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_KEY}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload only JPEG, PNG, or WebP images";
    }

    if (file.size > maxSize) {
      return "File size should be less than 5MB";
    }

    return null;
  };

  // Handle property image upload
  const handlePropertyImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages: PropertyImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);

      if (error) {
        toast.error(error);
        continue;
      }

      const tempImage: PropertyImage = {
        url: URL.createObjectURL(file),
        altText: `Property image ${
          propertyData.images.length + newImages.length + 1
        }`,
        file,
        isUploading: true,
      };

      newImages.push(tempImage);
    }

    // Add images to state immediately for preview
    setPropertyData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Upload each image to Cloudinary
    for (let i = 0; i < newImages.length; i++) {
      const imageIndex = propertyData.images.length + i;
      try {
        const cloudinaryUrl = await uploadToCloudinary(
          newImages[i].file!,
          "properties"
        );

        setPropertyData((prev) => ({
          ...prev,
          images: prev.images.map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  url: cloudinaryUrl,
                  isUploading: false,
                  file: undefined,
                }
              : img
          ),
        }));
      } catch (error) {
        // Remove failed upload from images
        setPropertyData((prev) => ({
          ...prev,
          images: prev.images.filter((_, idx) => idx !== imageIndex),
        }));
        toast.error(`Failed to upload property image ${i + 1}`);
      }
    }
  };

  // Handle room image upload
  const handleRoomImageUpload = async (
    roomIndex: number,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const newImages: RoomImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);

      if (error) {
        toast.error(error);
        continue;
      }

      const tempImage: RoomImage = {
        url: URL.createObjectURL(file),
        altText: `Room image ${
          propertyData.roomDetails[roomIndex].images.length +
          newImages.length +
          1
        }`,
        file,
        isUploading: true,
      };

      newImages.push(tempImage);
    }

    // Add images to room immediately for preview
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: prev.roomDetails.map((room, idx) =>
        idx === roomIndex
          ? { ...room, images: [...room.images, ...newImages] }
          : room
      ),
    }));

    // Upload each image to Cloudinary
    for (let i = 0; i < newImages.length; i++) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(
          newImages[i].file!,
          "rooms"
        );

        setPropertyData((prev) => {
          const updatedRoomDetails = [...prev.roomDetails];
          const room = { ...updatedRoomDetails[roomIndex] };

          const imageToUpdateIndex = room.images.findIndex(
            (img) => img.file === newImages[i].file && img.isUploading
          );

          if (imageToUpdateIndex !== -1) {
            room.images[imageToUpdateIndex] = {
              ...room.images[imageToUpdateIndex],
              url: cloudinaryUrl,
              isUploading: false,
              file: undefined,
            };
          }

          updatedRoomDetails[roomIndex] = room;

          return {
            ...prev,
            roomDetails: updatedRoomDetails,
          };
        });
      } catch (error) {
        setPropertyData((prev) => {
          const updatedRoomDetails = [...prev.roomDetails];
          const room = { ...updatedRoomDetails[roomIndex] };

          room.images = room.images.filter(
            (img) => !(img.file === newImages[i].file && img.isUploading)
          );

          updatedRoomDetails[roomIndex] = room;

          return {
            ...prev,
            roomDetails: updatedRoomDetails,
          };
        });
        toast.error(`Failed to upload room image ${i + 1}`);
      }
    }
  };

  // Remove property image
  const removePropertyImage = (index: number) => {
    setPropertyData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Remove room image
  const removeRoomImage = (roomIndex: number, imageIndex: number) => {
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: prev.roomDetails.map((room, rIdx) =>
        rIdx === roomIndex
          ? {
              ...room,
              images: room.images.filter((_, iIdx) => iIdx !== imageIndex),
            }
          : room
      ),
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const addRoomDetail = () => {
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: [
        ...prev.roomDetails,
        {
          type: "",
          totalRooms: 0,
          availableRooms: 0,
          pricePerNight: 0,
          amenities: [],
          customerCapacity: 1,
          images: [],
        },
      ],
    }));
  };

  const updateRoomDetail = (index: number, field: string, value: any) => {
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: prev.roomDetails.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      ),
    }));
  };

  const removeRoomDetail = (index: number) => {
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: prev.roomDetails.filter((_, i) => i !== index),
    }));
  };

  const handleRoomAmenityChange = (
    roomIndex: number,
    amenity: string,
    checked: boolean
  ) => {
    setPropertyData((prev) => ({
      ...prev,
      roomDetails: prev.roomDetails.map((room, i) =>
        i === roomIndex
          ? {
              ...room,
              amenities: checked
                ? [...room.amenities, amenity]
                : room.amenities.filter((a) => a !== amenity),
            }
          : room
      ),
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!propertyData.name.trim()) {
      errors.name = "Property name is required";
    }

    if (!propertyData.description.trim()) {
      errors.description = "Property description is required";
    }

    if (!propertyData.address.trim()) {
      errors.address = "Property address is required";
    }

    if (
      !propertyData.pricePerNight ||
      Number(propertyData.pricePerNight) <= 0
    ) {
      errors.pricePerNight = "Valid price per night is required";
    }

    if (propertyData.amenities.length === 0) {
      errors.amenities = "At least one amenity must be selected";
    }

    if (propertyData.images.length === 0) {
      errors.images = "At least one property image is required";
    }

    if (propertyData.roomDetails.length === 0) {
      errors.roomDetails = "At least one room type must be added";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const hasUploadingImages =
      propertyData.images.some((img) => img.isUploading) ||
      propertyData.roomDetails.some((room) =>
        room.images.some((img) => img.isUploading)
      );

    if (hasUploadingImages) {
      toast.error("Please wait for all images to finish uploading.");
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyPayload = {
        ...propertyData,
        images: propertyData.images.map((img) => ({
          url: img.url,
          altText: img.altText,
        })),
        owner: currentUser?._id || "",
        roomDetails: propertyData.roomDetails.map((room) => ({
          ...room,
          images: room.images.map((img) => ({
            url: img.url,
            altText: img.altText,
          })),
        })),
      };

      const response = await axios.post(
        "/api/Property/new-property",
        propertyPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Property created successfully!");

      // Reset form
      setPropertyData({
        name: "",
        description: "",
        address: "",
        owner: currentUser?._id || "",
        pricePerNight: "",
        amenities: [],
        images: [],
        roomDetails: [],
      });
      setFormErrors({});
      setShowAddProperty(false);

      // Refresh properties list
      fetchProperties();
    } catch (error) {
      toast.error("Failed to create property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPropertyDetails = (propertyId: string) => {
    router.push(`/dashboard/host/property/${propertyId}`);
  };

  const handleViewBookingDetails = (bookingId: string) => {
    setShowBookingDetails(bookingId);
  };

  const handleAcceptBooking = async (
    bookingId: string,
    propertyId: string,
    roomType: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Approve Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(`/api/booking/${bookingId}`, {
              isApproved: true,
              status: "confirmed",
              property: propertyId,
              roomType: roomType,
            })
            .then(() => {
              Swal.fire({
                title: "Approved!",
                text: "Booking has been approved.",
                icon: "success",
              });
              fetchBookings();
            })
            .catch((error) => {
              console.error("Error accepting booking:", error);
              toast.error("Failed to accept booking. Please try again.");
            });
        } catch (error) {
          toast.error("Failed to accept booking. Please try again.");
        }
      }
    });
  };

  const handleDeclineBooking = async (bookingId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#28a745",
      confirmButtonText: "Yes, Decline Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.patch(`/api/booking/${bookingId}`, {
            isApproved: false,
            status: "cancelled",
          });
          Swal.fire({
            title: "Canceled!",
            text: "Booking has been canceled.",
            icon: "success",
          });
          fetchBookings();
        } catch (error) {
          console.error("Error accepting booking:", error);
          alert("Failed to accept booking. Please try again.");
        }
      }
    });
  };

  const filteredBookings = recentBookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    return booking.status === bookingFilter;
  });

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {loading ? (
              <div className="w-80 h-10 bg-gray-200 animate-pulse rounded-md" />
            ) : (
              `Welcome back, ${currentUser?.firstName}!`
            )}
          </h1>
          <p className="text-gray-600">
            Manage your properties and grow your hospitality business
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 bg-white border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-full">
                        <stat.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Add New Property
                  </h3>
                  <p className="text-gray-600 mb-4">
                    List a new hotel or guest house
                  </p>
                  <Dialog
                    open={showAddProperty}
                    onOpenChange={setShowAddProperty}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Add Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                        <DialogDescription>
                          Create a new property listing for your hotel or guest
                          house
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property-name">
                                Property Name *
                              </Label>
                              <Input
                                id="property-name"
                                placeholder="Enter property name"
                                value={propertyData.name}
                                onChange={(e) =>
                                  setPropertyData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className={
                                  formErrors.name ? "border-red-500" : ""
                                }
                              />
                              {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.name}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="price-per-night">
                                Base Price Per Night *
                              </Label>
                              <Input
                                id="price-per-night"
                                type="number"
                                placeholder="Enter base price"
                                value={propertyData.pricePerNight}
                                onChange={(e) =>
                                  setPropertyData((prev) => ({
                                    ...prev,
                                    pricePerNight: e.target.value,
                                  }))
                                }
                                className={
                                  formErrors.pricePerNight
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {formErrors.pricePerNight && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.pricePerNight}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="property-type">
                              Property Type *
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setPropertyData((prev) => ({
                                  ...prev,
                                  propertyType: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Luxury Hotel">
                                  Luxury Hotel
                                </SelectItem>
                                <SelectItem value="Business Hotel">
                                  Business Hotel
                                </SelectItem>
                                <SelectItem value="Guest House">
                                  Guest House
                                </SelectItem>
                                <SelectItem value="Standard Hotel">
                                  Standard Hotel
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="property-address">Address *</Label>
                            <Textarea
                              id="property-address"
                              placeholder="Enter complete address"
                              value={propertyData.address}
                              onChange={(e) =>
                                setPropertyData((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }))
                              }
                              className={
                                formErrors.address ? "border-red-500" : ""
                              }
                            />
                            {formErrors.address && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.address}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="property-description">
                              Description *
                            </Label>
                            <Textarea
                              id="property-description"
                              placeholder="Describe your property"
                              rows={3}
                              value={propertyData.description}
                              onChange={(e) =>
                                setPropertyData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              className={
                                formErrors.description ? "border-red-500" : ""
                              }
                            />
                            {formErrors.description && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Property Images */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            Property Images *
                          </h4>

                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">
                              Click to upload or drag and drop property images
                            </p>
                            <p className="text-xs text-gray-400 mb-4">
                              JPEG, PNG, WebP up to 5MB each
                            </p>

                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                handlePropertyImageUpload(e.target.files)
                              }
                              className="hidden"
                              id="property-images"
                            />

                            <label
                              htmlFor="property-images"
                              className="cursor-pointer inline-block"
                            >
                              <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100">
                                Choose Images
                              </span>
                            </label>
                          </div>

                          {formErrors.images && (
                            <p className="text-red-500 text-sm">
                              {formErrors.images}
                            </p>
                          )}

                          {/* Image Preview Grid */}
                          {propertyData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {propertyData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                      src={
                                        image.url ||
                                        "/placeholder.svg?height=200&width=200"
                                      }
                                      alt={image.altText}
                                      width={200}
                                      height={200}
                                      className="w-full h-full object-cover"
                                    />
                                    {image.isUploading && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                      </div>
                                    )}
                                  </div>
                                  {!image.isUploading && (
                                    <button
                                      type="button"
                                      onClick={() => removePropertyImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                  <div className="mt-2">
                                    <Input
                                      placeholder="Alt text"
                                      value={image.altText}
                                      onChange={(e) => {
                                        const newImages = [
                                          ...propertyData.images,
                                        ];
                                        newImages[index].altText =
                                          e.target.value;
                                        setPropertyData((prev) => ({
                                          ...prev,
                                          images: newImages,
                                        }));
                                      }}
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Amenities */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            Property Amenities *
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {AMENITIES_OPTIONS.map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`amenity-${amenity}`}
                                  checked={propertyData.amenities.includes(
                                    amenity
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleAmenityChange(
                                      amenity,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`amenity-${amenity}`}
                                  className="text-sm"
                                >
                                  {amenity}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {formErrors.amenities && (
                            <p className="text-red-500 text-sm mt-2">
                              {formErrors.amenities}
                            </p>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">
                              Room Details
                            </h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addRoomDetail}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Room Type
                            </Button>
                          </div>
                          {formErrors.roomDetails && (
                            <p className="text-red-500 text-sm">
                              {formErrors.roomDetails}
                            </p>
                          )}

                          {propertyData.roomDetails.map((room, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-medium">
                                  Room Type {index + 1}
                                </h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRoomDetail(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label>Room Type *</Label>
                                  <Select
                                    value={room.type}
                                    onValueChange={(value) =>
                                      updateRoomDetail(index, "type", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select room type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ROOM_TYPES.map((type) => (
                                        <SelectItem
                                          key={type.value}
                                          value={type.value}
                                        >
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Customer Capacity *</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="Max guests"
                                    value={room.customerCapacity}
                                    onChange={(e) =>
                                      updateRoomDetail(
                                        index,
                                        "customerCapacity",
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <Label>Total Rooms *</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="Total rooms"
                                    value={room.totalRooms}
                                    onChange={(e) =>
                                      updateRoomDetail(
                                        index,
                                        "totalRooms",
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <Label>Available Rooms *</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="Available rooms"
                                    value={room.availableRooms}
                                    onChange={(e) =>
                                      updateRoomDetail(
                                        index,
                                        "availableRooms",
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <Label>Price Per Night *</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="Room price"
                                    value={room.pricePerNight}
                                    onChange={(e) =>
                                      updateRoomDetail(
                                        index,
                                        "pricePerNight",
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Room Amenities */}
                              <div className="mb-4">
                                <Label className="text-sm font-medium mb-2 block">
                                  Room Amenities
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                  {AMENITIES_OPTIONS.slice(0, 9).map(
                                    (amenity) => (
                                      <div
                                        key={`room-${index}-${amenity}`}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={`room-${index}-amenity-${amenity}`}
                                          checked={room.amenities.includes(
                                            amenity
                                          )}
                                          onCheckedChange={(checked) =>
                                            handleRoomAmenityChange(
                                              index,
                                              amenity,
                                              checked as boolean
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`room-${index}-amenity-${amenity}`}
                                          className="text-xs"
                                        >
                                          {amenity}
                                        </Label>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Room Images */}
                              <div className="space-y-4">
                                <Label className="text-sm font-medium">
                                  Room Images
                                </Label>

                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                                  <p className="text-xs text-gray-500 mb-2">
                                    Upload room photos
                                  </p>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleRoomImageUpload(
                                        index,
                                        e.target.files
                                      )
                                    }
                                    className="hidden"
                                    id={`room-images-${index}`}
                                  />
                                  <Label
                                    htmlFor={`room-images-${index}`}
                                    className="cursor-pointer"
                                  >
                                    <span>Choose Images</span>
                                  </Label>
                                </div>

                                {/* Room Image Preview */}
                                {room.images.length > 0 && (
                                  <div className="grid grid-cols-3 gap-2">
                                    {room.images.map((image, imageIndex) => (
                                      <div
                                        key={imageIndex}
                                        className="relative group"
                                      >
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                          <Image
                                            src={
                                              image.url ||
                                              "/placeholder.svg?height=100&width=100"
                                            }
                                            alt={image.altText}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                          />
                                          {image.isUploading && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                              <Loader2 className="h-4 w-4 text-white animate-spin" />
                                            </div>
                                          )}
                                        </div>
                                        {!image.isUploading && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeRoomImage(index, imageIndex)
                                            }
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddProperty(false)}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Property"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bed className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Manage Rooms
                  </h3>
                  <p className="text-gray-600 mb-4">Add or edit room details</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("rooms")}
                  >
                    Manage Rooms
                  </Button>
                </CardContent>
              </Card>

              {/* <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    View Analytics
                  </h3>
                  <p className="text-gray-600 mb-4">Track your performance</p>
                  <Button
                    variant="outline"
                    onClick={() => alert("Analytics feature coming soon!")}
                  >
                    View Reports
                  </Button>
                </CardContent>
              </Card> */}
            </div>
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Latest reservations from guests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {booking.customer.firstName
                              .charAt(0)
                              .toUpperCase() +
                              booking.customer.firstName
                                .slice(1)
                                .toLowerCase() +
                              " " +
                              booking.customer.lastName
                                .charAt(0)
                                .toUpperCase() +
                              booking.customer.lastName.slice(1).toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.property.name} •{" "}
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-GB"
                            )}{" "}
                            -{" "}
                            {new Date(booking.checkOut).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            PKR {booking.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("bookings")}
                  >
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                  <CardDescription>
                    How your properties are performing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.length > 0 ? (
                      properties.map((property) => {
                        const totalRooms =
                          property.roomDetails?.reduce(
                            (sum, room) => sum + (room.totalRooms || 0),
                            0
                          ) || 0;
                        const availableRooms =
                          property.roomDetails?.reduce(
                            (sum, room) => sum + (room.availableRooms || 0),
                            0
                          ) || 0;
                        const occupancy =
                          totalRooms > 0
                            ? (
                                ((totalRooms - availableRooms) / totalRooms) *
                                100
                              ).toFixed(1)
                            : 0;

                        return (
                          <div
                            key={property._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Image
                                src={
                                  property.images?.[0]?.url ||
                                  "/placeholder.svg?height=50&width=50" ||
                                  "/placeholder.svg"
                                }
                                alt={property.name}
                                width={50}
                                height={50}
                                className="rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{property.name}</p>
                                <p className="text-sm text-gray-600">
                                  {occupancy}% occupancy • {totalRooms} rooms
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveTab("properties")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No properties found. Add your first property to get
                          started!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Bookings</h2>
              <div className="flex gap-2">
                <Select value={bookingFilter} onValueChange={setBookingFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!(filteredBookings.length === 0) ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking._id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              {booking.customer.firstName
                                .charAt(0)
                                .toUpperCase() +
                                booking.customer.firstName
                                  .slice(1)
                                  .toLowerCase() +
                                " " +
                                booking.customer.lastName
                                  .charAt(0)
                                  .toUpperCase() +
                                booking.customer.lastName
                                  .slice(1)
                                  .toLowerCase()}
                            </h3>
                            <p className="text-gray-600">
                              {booking.customer.email}
                            </p>
                            <p className="text-gray-600">
                              {booking.customer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
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
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            Booked:{" "}
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBookingDetails(booking._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {booking.status === "pending" && (
                          <div className="flex gap-2 ml-auto">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                handleAcceptBooking(
                                  booking._id,
                                  booking.property._id,
                                  booking.roomType
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeclineBooking(booking._id)}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You currently have no bookings.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Other tabs content remains the same... */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Properties</h2>
            </div>

            <div className="">
              {properties.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {properties.map((property) => {
                    const totalRooms =
                      property.roomDetails?.reduce(
                        (sum, room) => sum + (room.totalRooms || 0),
                        0
                      ) || 0;
                    const availableRooms =
                      property.roomDetails?.reduce(
                        (sum, room) => sum + (room.availableRooms || 0),
                        0
                      ) || 0;
                    const occupancy =
                      totalRooms > 0
                        ? (
                            ((totalRooms - availableRooms) / totalRooms) *
                            100
                          ).toFixed(1)
                        : 0;

                    return (
                      <Card key={property._id} className="border-0 shadow-lg">
                        <CardContent className="p-0">
                          <div className=" ">
                            <Image
                              src={
                                property.images?.[0]?.url ||
                                "/placeholder.svg?height=200&width=300" ||
                                "/placeholder.svg"
                              }
                              alt={property.name}
                              width={300}
                              height={200}
                              className="rounded-t-lg w-full object-cover h-80 mb-4"
                            />
                            <div className="gap-6 flex flex-col p-6">
                              <div className="flex justify-between gap-6 items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-bold mb-2">
                                    {property.name}
                                  </h3>
                                  <p className="text-gray-600 flex items-center mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {property.address}
                                  </p>
                                  <p className="text-gray-600 mb-2">
                                    {property.description.length >= 100
                                      ? property.description.slice(0, 100) +
                                        "..."
                                      : property.description}
                                  </p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <p className="font-bold text-lg">
                                    {totalRooms}
                                  </p>
                                  <p className="text-gray-600">Total Rooms</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <p className="font-bold text-lg">
                                    {occupancy}%
                                  </p>
                                  <p className="text-gray-600">Occupancy</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <p className="font-bold text-lg flex items-center justify-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                    4.6
                                  </p>
                                  <p className="text-gray-600">Rating</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <p className="font-bold text-lg">
                                    PKR{" "}
                                    {property.pricePerNight?.toLocaleString()}
                                  </p>
                                  <p className="text-gray-600">Base Price</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleViewPropertyDetails(property._id)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No properties yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start by adding your first property to begin managing your
                      hospitality business.
                    </p>
                    <Button onClick={() => setShowAddProperty(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Rooms</h2>
            </div>

            {properties.length > 0 ? (
              properties.map((property) => (
                <Card key={property._id} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>{property.name}</CardTitle>
                    <CardDescription>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.roomDetails?.map((room, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold capitalize">
                                {room.type} Room
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  (room.availableRooms || 0) > 0
                                    ? "border-green-500 text-green-700"
                                    : "border-red-500 text-red-700"
                                }
                              >
                                {room.availableRooms || 0} Available
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Price:</span> PKR{" "}
                                {(room.pricePerNight || 0).toLocaleString()}
                                /night
                              </p>
                              <p>
                                <span className="font-medium">Capacity:</span>{" "}
                                {room.customerCapacity || 0} guests
                              </p>
                              <p>
                                <span className="font-medium">
                                  Total Rooms:
                                </span>{" "}
                                {room.totalRooms || 0}
                              </p>
                              <div>
                                <span className="font-medium">Amenities:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {room.amenities
                                    ?.slice(0, 3)
                                    .map((amenity) => (
                                      <Badge
                                        key={amenity}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {amenity}
                                      </Badge>
                                    ))}
                                  {(room.amenities?.length || 0) > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{(room.amenities?.length || 0) - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/host/property/${property._id}`
                                  )
                                }
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) || (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-500">
                            No rooms added yet. Add rooms to this property.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Bed className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No properties to manage rooms
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add a property first to start managing rooms.
                  </p>
                  <Button onClick={() => setShowAddProperty(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="space-y-6">
            <h2 className="text-2xl font-bold">Guest Reviews</h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <div key={property._id}>
                  {property.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {property.reviews.map((review, idx) => (
                        <Card key={idx} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start space-x-4 mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {review.customer.firstName}{" "}
                                  {review.customer.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-GB")}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-sm">
                                  {property.name}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(review.rating)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <p className="text-gray-800">{review.comment}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Guests haven't left any reviews for your
                          property/properties yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No properties to show reviews
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add a property first to start receiving reviews.
                  </p>
                  <Button
                    onClick={() => {
                      setShowAddProperty(true);
                      setActiveTab("overview");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Host Information</CardTitle>
                  <CardDescription>
                    Update your host profile and business details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {currentUser?.firstName?.[0]}
                        {currentUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-gray-600">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Contact Email
                      </Label>
                      <p className="text-gray-600">{currentUser?.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <p className="text-gray-600">+92 300 1234567</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Business License
                      </Label>
                      <p className="text-gray-600">Verified ✓</p>
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => alert("Opening profile edit form...")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Payment & Banking</CardTitle>
                  <CardDescription>
                    Manage your payment information and banking details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Bank Account
                      </Label>
                      <p className="text-gray-600">****1234 - HBL Bank</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Tax Information
                      </Label>
                      <p className="text-gray-600">NTN: 1234567-8</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Payment Schedule
                      </Label>
                      <p className="text-gray-600">Weekly transfers</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Commission Rate
                      </Label>
                      <p className="text-gray-600">5% per booking</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => alert("Opening payment settings...")}
                  >
                    Update Payment Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Details Modal */}
        {showBookingDetails && (
          <Dialog
            open={!!showBookingDetails}
            onOpenChange={() => setShowBookingDetails(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {(() => {
                  const booking = recentBookings.find(
                    (b) => b._id === showBookingDetails
                  );
                  if (!booking) return <p>Booking not found</p>;

                  return (
                    <div className="space-y-6">
                      {/* Guest Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium text-gray-700">
                            Guest Name
                          </Label>
                          <p className="text-gray-900 font-medium">
                            {booking.customer.firstName
                              .charAt(0)
                              .toUpperCase() +
                              booking.customer.firstName
                                .slice(1)
                                .toLowerCase() +
                              " " +
                              booking.customer.lastName
                                .charAt(0)
                                .toUpperCase() +
                              booking.customer.lastName.slice(1).toLowerCase()}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-700">
                            Email
                          </Label>
                          <p className="text-gray-900">
                            {booking.customer.email}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-700">
                            Phone
                          </Label>
                          <p className="text-gray-900">
                            {booking.customer.phone}
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

                      {/* Booking Information */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-lg mb-3">
                          Booking Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium text-gray-700">
                              Property
                            </Label>
                            <p className="text-gray-900">
                              {booking.property.name}
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
                              Check-in
                            </Label>
                            <p className="text-gray-900">
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Check-out
                            </Label>
                            <p className="text-gray-900">
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Guests
                            </Label>
                            <p className="text-gray-900">
                              {booking.numberOfGuests >= 5
                                ? booking.numberOfGuests + "+"
                                : booking.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-700">
                              Total Amount
                            </Label>
                            <p className="text-gray-900 font-bold text-lg">
                              PKR {booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-lg mb-3">
                          Additional Information
                        </h4>

                        {booking.specialRequests && (
                          <div className="mt-4">
                            <Label className="font-medium text-gray-700">
                              Special Requests
                            </Label>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                              {booking.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {booking.status === "pending" && (
                        <div className="border-t pt-4 flex gap-2">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              handleAcceptBooking(
                                booking._id,
                                booking.property._id,
                                booking.roomType
                              );
                              setShowBookingDetails(null);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Booking
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDeclineBooking(booking._id);
                              setShowBookingDetails(null);
                            }}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Decline Booking
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
