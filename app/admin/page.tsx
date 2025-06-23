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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Search,
  Check,
  X,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/currentUser";
import axios from "axios";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
  isApproved: string;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  images: Array<{
    url: string;
    altText?: string;
  }>;
  amenities: string[];
  reviews: Array<{
    customer: string;
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
  roomDetails: Array<{
    type: string;
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
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

interface HotelData {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string[];
  amenities: string[];
  type: string;
  description: string;
  owner: string;
  createdAt: string;
  isApproved: string;
  rooms: number;
  ownerPhone: string;
  ownerEmail: string;
  revenue: number;
}

const handleApproveProperty = (propertyId: number) => {
  try {
    Swal.fire({
      title: "Approve Property",
      text: "Are you sure you want to approve this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`/api/admin/properties`, {
            id: propertyId,
            isApproved: "approved",
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success("The property has been approved successfully.");
              window.location.reload();
            } else {
              toast.error("Failed to approve property. Please try again.");
            }
          })
          .catch((error) => {
            toast.error("Failed to approve property. Please try again.");
          });
      }
    });
  } catch (error) {
    console.error("Error approving property:", error);
    toast.error("Failed to approve property. Please try again.");
  }
};

const handleRejectProperty = (propertyId: number) => {
  try {
    Swal.fire({
      title: "Reject Property",
      text: "Are you sure you want to reject this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`/api/admin/properties`, {
            id: propertyId,
            isApproved: "rejected",
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success("The property has been rejected successfully.");
              window.location.reload();
            } else {
              toast.error("Failed to reject property. Please try again.");
            }
          })
          .catch((error) => {
            toast.error("Failed to reject property. Please try again.");
          });
      }
    });
  } catch (error) {
    toast.error("Failed to reject property. Please try again.");
  }
};

const transformPropertyToHotel = (property: Property): HotelData => {
  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, review) => sum + review.rating, 0) /
        property.reviews.length
      : 0;

  const totalRooms = property.roomDetails.reduce(
    (sum, room) => sum + room.totalRooms,
    0
  );

  let propertyType = "Guest House";
  if (property.pricePerNight > 15000) {
    propertyType = "Luxury Hotel";
  } else if (property.pricePerNight > 8000) {
    propertyType = "Business Hotel";
  }

  return {
    id: property._id,
    name: property.name,
    location: property.address,
    price: property.pricePerNight,
    rating: Number(averageRating.toFixed(1)),
    reviews: property.reviews.length,
    image: [
      ...property.images.map((img) => img.url),
      ...property.roomDetails.flatMap((room) =>
        (room.images ?? [])
          .map((img) => img.url)
          .filter((url): url is string => typeof url === "string")
      ),
    ],
    amenities: property.amenities,
    type: propertyType,
    description: property.description,
    owner: property.owner.firstName + " " + property.owner.lastName,
    ownerPhone: property.owner.phone,
    ownerEmail: property.owner.email,
    createdAt: new Date(property.createdAt).toLocaleDateString(),
    isApproved: property.isApproved,
    rooms: totalRooms,
    revenue: property.totalRevenue,
  };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user: currentUser, loading } = useCurrentUser();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [showBookingDetails, setShowBookingDetails] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      window.location.href = "/";
    }

    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/admin/properties");
        if (response.status === 200) {
          setProperties(response.data.properties);
          console.log("Fetched properties:", response.data.properties);
        } else {
          console.error("Failed to fetch properties:", response.data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/bookings");
        if (response.status === 200) {
          setAllUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          toast.error("Failed to fetch users. Please try again.");
        }
      } catch (error) {}
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/admin/bookings/allbookings");
        if (response.status === 200) {
          setBookings(response.data);
          console.log("Fetched bookings:", response.data);
        } else {
          toast.error("Failed to fetch bookings. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchProperties();
    fetchUsers();
    fetchBookings();
  }, [currentUser]);

  const handleReviewProperty = (propertyId: string) => {
    const found = hotels.find((h) => h.id === propertyId);
    setSelectedProperty(found);
    setShowReview(true);
  };
  const handleViewBookingDetails = (bookingId: string) => {
    setShowBookingDetails(bookingId);
  };

  const hotels = properties.map(transformPropertyToHotel);
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    return booking.status === bookingFilter;
  });

  const totalBookings = bookings.length;

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const bookingsPerMonth = {};
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    bookingsPerMonth[month] = (bookingsPerMonth[month] || 0) + 1;
  });

  const bookingsChartData = Object.entries(bookingsPerMonth).map(
    ([month, count]) => ({
      month,
      count,
    })
  );

  const revenuePerMonth = {};
  bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      revenuePerMonth[month] = (revenuePerMonth[month] || 0) + b.totalAmount;
    });

  const revenueChartData = Object.entries(revenuePerMonth).map(
    ([month, total]) => ({
      month,
      total,
    })
  );
  const statusCount = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  };

  bookings.forEach((b) => {
    statusCount[b.status] = (statusCount[b.status] || 0) + 1;
  });

  const propertyRevenueMap = {};

  bookings.forEach((b) => {
    const name = b.property.name;
    if (b.status === "confirmed" || b.status === "completed") {
      propertyRevenueMap[name] =
        (propertyRevenueMap[name] || 0) + b.totalAmount;
    }
  });

  const topProperties = Object.entries(propertyRevenueMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const stats = [
    {
      title: "Total Users",
      value: allUsers.length.toString(),
      icon: Users,
    },
    {
      title: "Active Properties",
      value: properties
        .filter((p) => p.isApproved === "approved")
        .length.toString(),
      icon: Home,
    },
    {
      title: "Total Revenue",
      value: `PKR ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Platform Growth",
      value: "23%",
      icon: TrendingUp,
    },
  ];

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

  if (currentUser && currentUser.role !== "admin") {
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, properties, and platform operations
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Property Approvals</CardTitle>
                <CardDescription>
                  Review and approve new property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.map(
                    (property) =>
                      property.isApproved === "pending" && (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Image
                              src={property.image[0] || "/placeholder.svg"}
                              alt={property.name}
                              width={80}
                              height={60}
                              className="rounded object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{property.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                by {property.owner} • {property.location}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {property.type} • {property.rooms} rooms •
                                Submitted {property.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewProperty(property.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleApproveProperty(property.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectProperty(property.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Properties</h2>
            </div>

            <div className="grid gap-4">
              {hotels.map((property, idx) =>
                property.isApproved !== "pending" ? (
                  <Card key={property.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">
                              {property.name}
                            </h3>
                            <Badge
                              variant={
                                property.isApproved === "approved"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {property.isApproved}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">
                            Owner: {property.owner} •{" "}
                            {property.location.length > 30
                              ? property.location.slice(0, 30) + "..."
                              : property.location}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{property.type}</p>
                              <p className="text-muted-foreground">Type</p>
                            </div>
                            <div>
                              <p className="font-medium">{property.rooms}</p>
                              <p className="text-muted-foreground">Rooms</p>
                            </div>
                            <div>
                              <p className="font-medium">{property.rating}</p>
                              <p className="text-muted-foreground">Rating</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                PKR {property.revenue.toLocaleString()}
                              </p>
                              <p className="text-muted-foreground">Revenue</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReviewProperty(property.id)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  property.isApproved === "approved"
                                    ? handleRejectProperty(property.id)
                                    : handleApproveProperty(property.id);
                                }}
                                className={
                                  property.isApproved === "approved"
                                    ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                                    : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                }
                              >
                                {property.isApproved === "approved"
                                  ? "Reject"
                                  : "Approve"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div
                    key={idx}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No properties found.
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Users</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-64"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase();

                      if (searchTerm === "") {
                        setFilteredUsers(allUsers); // reset if empty
                      } else {
                        const filtered = allUsers.filter((user) => {
                          const fullName =
                            `${user.firstName} ${user.lastName}`.toLowerCase();
                          const email = user.email?.toLowerCase() || "";
                          const phone = user.phone?.toLowerCase() || "";

                          return (
                            fullName.includes(searchTerm) ||
                            email.includes(searchTerm) ||
                            phone.includes(searchTerm)
                          );
                        });

                        setFilteredUsers(filtered);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Join Date</th>
                        <th className="text-left p-4">Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {user.firstName[0] + user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.phone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{user.type}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="p-4 text-muted-foreground">
                            {user.type === "customer"
                              ? `${user.totalBookings} bookings`
                              : `${user.totalProperties} properties`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Platform Analytics</h2>
              <div className="text-sm text-muted-foreground">
                Real-time data insights
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Bookings
                      </p>
                      <p className="text-2xl font-bold">{totalBookings}</p>
                      <p className="text-sm text-green-600">
                        All time bookings
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        PKR {totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600">
                        Confirmed + Completed
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Confirmed Bookings
                      </p>
                      <p className="text-2xl font-bold">
                        {statusCount.confirmed}
                      </p>
                      <p className="text-sm text-green-600">
                        Active reservations
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending Bookings
                      </p>
                      <p className="text-2xl font-bold">
                        {statusCount.pending}
                      </p>
                      <p className="text-sm text-yellow-600">
                        Awaiting confirmation
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings Per Month Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Per Month</CardTitle>
                  <CardDescription>Monthly booking trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: bookingsChartData.map((item) => item.month),
                        datasets: [
                          {
                            label: "Bookings",
                            data: bookingsChartData.map((item) => item.count),
                            borderColor: "rgb(59, 130, 246)",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            tension: 0.4,
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Per Month Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Per Month</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: revenueChartData.map((item) => item.month),
                        datasets: [
                          {
                            label: "Revenue (PKR)",
                            data: revenueChartData.map((item) => item.total),
                            backgroundColor: "rgba(34, 197, 94, 0.8)",
                            borderColor: "rgb(34, 197, 94)",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) =>
                                "PKR " + value.toLocaleString(),
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status Distribution</CardTitle>
                  <CardDescription>
                    Current booking status breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut
                      data={{
                        labels: [
                          "Confirmed",
                          "Pending",
                          "Completed",
                          "Cancelled",
                        ],
                        datasets: [
                          {
                            data: [
                              statusCount.confirmed,
                              statusCount.pending,
                              statusCount.completed,
                              statusCount.cancelled,
                            ],
                            backgroundColor: [
                              "rgba(34, 197, 94, 0.8)",
                              "rgba(251, 191, 36, 0.8)",
                              "rgba(59, 130, 246, 0.8)",
                              "rgba(239, 68, 68, 0.8)",
                            ],
                            borderColor: [
                              "rgb(34, 197, 94)",
                              "rgb(251, 191, 36)",
                              "rgb(59, 130, 246)",
                              "rgb(239, 68, 68)",
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Top Properties by Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Properties by Revenue</CardTitle>
                  <CardDescription>Highest earning properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: topProperties.map((item) =>
                          item.name.length > 15
                            ? item.name.substring(0, 15) + "..."
                            : item.name
                        ),
                        datasets: [
                          {
                            label: "Revenue (PKR)",
                            data: topProperties.map((item) => item.revenue),
                            backgroundColor: "rgba(168, 85, 247, 0.8)",
                            borderColor: "rgb(168, 85, 247)",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) =>
                                "PKR " + value.toLocaleString(),
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle>Property Performance Summary</CardTitle>
                <CardDescription>Revenue breakdown by property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4">Property Name</th>
                        <th className="text-left p-4">Total Revenue</th>
                        <th className="text-left p-4">Percentage of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProperties.map((property, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-4 font-medium">{property.name}</td>
                          <td className="p-4">
                            PKR {property.revenue.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (property.revenue / totalRevenue) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {(
                                  (property.revenue / totalRevenue) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showReview} onOpenChange={setShowReview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Property Review</DialogTitle>
            </DialogHeader>

            {selectedProperty && (
              <div className="space-y-6">
                {/* Top Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Property Name</Label>
                    <p className="font-semibold">{selectedProperty.name}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <p>{selectedProperty.type}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p>{selectedProperty.location}</p>
                  </div>
                  <div>
                    <Label>Total Rooms</Label>
                    <p>{selectedProperty.rooms}</p>
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <Label className="p-1">Status</Label>
                  <Badge
                    variant={
                      selectedProperty.isApproved === "approved"
                        ? "default"
                        : selectedProperty.isApproved === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedProperty.isApproved}
                  </Badge>
                </div>

                {/* Description */}
                {selectedProperty.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedProperty.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                <div>
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-3 gap-2">
                  {selectedProperty.image?.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={`Property image ${idx + 1}`}
                      width={200}
                      height={150}
                      className="rounded w-full h-full object-cover"
                    />
                  ))}
                </div>

                {/* Owner Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg mb-2">Owner Info</h4>
                  <p>
                    <strong>Name:</strong> {selectedProperty.owner}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedProperty.ownerEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedProperty.ownerPhone}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {showBookingDetails && (
          <Dialog
            open={!!showBookingDetails}
            onOpenChange={() => setShowBookingDetails(null)}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {(() => {
                  const booking = bookings.find(
                    (b) => b._id === showBookingDetails
                  );
                  if (!booking) return <p>Booking not found</p>;

                  return (
                    <div className="space-y-6">
                      {/* Guest Info */}
                      <div>
                        <h4 className="text-lg font-semibold mb-2">
                          Guest Info
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Guest Name</Label>
                            <p className="text-gray-900 font-medium">
                              {booking.customer?.firstName}{" "}
                              {booking.customer?.lastName}
                            </p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-gray-900">
                              {booking.customer?.email}
                            </p>
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <p className="text-gray-900">
                              {booking.customer?.phone}
                            </p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Badge
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Host Info */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Host Info
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Host Name</Label>
                            <p className="text-gray-900 font-medium">
                              {booking.owner?.firstName}{" "}
                              {booking.owner?.lastName}
                            </p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-gray-900">
                              {booking.owner?.email}
                            </p>
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <p className="text-gray-900">
                              {booking.owner?.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hotel Info */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Hotel Info
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Hotel Name</Label>
                            <p className="text-gray-900">
                              {booking.property?.name}
                            </p>
                          </div>
                          <div>
                            <Label>Location</Label>
                            <p className="text-gray-900">
                              {booking.property?.address}
                            </p>
                          </div>
                          <div className="col-span-2 ">
                            <Label>Hotel Image</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Image
                                src={
                                  booking.property?.images?.[0].url ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt="Hotel Image"
                                width={400}
                                height={200}
                                className="rounded-lg mt-2"
                                priority
                              />
                              <Image
                                src={
                                  booking.property?.images?.[1].url ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt="Hotel Image"
                                width={400}
                                height={200}
                                className="rounded-lg mt-2"
                                priority
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Info */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Booking Info
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Room Type</Label>
                            <p className="text-gray-900">{booking.roomType}</p>
                          </div>
                          <div>
                            <Label>Guests</Label>
                            <p className="text-gray-900">
                              {booking.numberOfGuests >= 5
                                ? `${booking.numberOfGuests}+`
                                : booking.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <Label>Check-in</Label>
                            <p className="text-gray-900">
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>
                          <div>
                            <Label>Check-out</Label>
                            <p className="text-gray-900">
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <Label>Total Amount</Label>
                            <p className="text-gray-900 font-bold text-lg">
                              PKR {booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="border-t pt-4">
                          <h4 className="text-lg font-semibold mb-2">
                            Special Requests
                          </h4>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {booking.specialRequests}
                          </p>
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
