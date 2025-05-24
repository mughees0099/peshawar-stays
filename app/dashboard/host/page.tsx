"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Users,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Upload,
  Bed,
  CheckCircle,
  AlertCircle,
  Bell,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const properties = [
  {
    id: 1,
    name: "Green Guest House",
    location: "Hayatabad, Peshawar",
    rating: 4.4,
    reviews: 156,
    rooms: 12,
    occupancy: 85,
    revenue: 245000,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    type: "Guest House",
    totalBookings: 45,
  },
  {
    id: 2,
    name: "Royal Palace Hotel",
    location: "University Town, Peshawar",
    rating: 4.7,
    reviews: 89,
    rooms: 8,
    occupancy: 92,
    revenue: 180000,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    type: "Boutique Hotel",
    totalBookings: 32,
  },
]

const recentBookings = [
  {
    id: 1,
    guestName: "Ahmed Khan",
    guestEmail: "ahmed@example.com",
    guestPhone: "+92 300 1234567",
    property: "Green Guest House",
    roomType: "Deluxe Room",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    guests: 2,
    total: 24000,
    status: "confirmed",
    bookingDate: "2024-02-10",
  },
  {
    id: 2,
    guestName: "Sarah Ali",
    guestEmail: "sarah@example.com",
    guestPhone: "+92 301 9876543",
    property: "Royal Palace Hotel",
    roomType: "Standard Room",
    checkIn: "2024-02-20",
    checkOut: "2024-02-22",
    guests: 1,
    total: 16000,
    status: "pending",
    bookingDate: "2024-02-12",
  },
  {
    id: 3,
    guestName: "Hassan Ahmed",
    guestEmail: "hassan@example.com",
    guestPhone: "+92 333 5555555",
    property: "Green Guest House",
    roomType: "Executive Suite",
    checkIn: "2024-02-25",
    checkOut: "2024-02-27",
    guests: 3,
    total: 35000,
    status: "confirmed",
    bookingDate: "2024-02-14",
  },
]

const stats = [
  {
    title: "Total Revenue",
    value: "PKR 425,000",
    change: "+15%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Active Bookings",
    value: "12",
    change: "+8%",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Average Occupancy",
    value: "88%",
    change: "+5%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Guest Rating",
    value: "4.6",
    change: "+0.3",
    icon: Star,
    color: "text-yellow-600",
  },
]

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [showPropertyDetails, setShowPropertyDetails] = useState<number | null>(null)
  const [showEditProperty, setShowEditProperty] = useState<number | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState<number | null>(null)
  const [bookingFilter, setBookingFilter] = useState("all")

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/login"
    }
  }

  const handleAcceptBooking = (bookingId: number) => {
    if (confirm("Accept this booking?")) {
      alert("Booking accepted successfully!")
      // Update booking status logic here
    }
  }

  const handleDeclineBooking = (bookingId: number) => {
    if (confirm("Decline this booking?")) {
      alert("Booking declined.")
      // Update booking status logic here
    }
  }

  const handleViewPropertyDetails = (propertyId: number) => {
    setShowPropertyDetails(propertyId)
  }

  const handleEditProperty = (propertyId: number) => {
    setShowEditProperty(propertyId)
  }

  const handleViewBookingDetails = (bookingId: number) => {
    setShowBookingDetails(bookingId)
  }

  const filteredBookings = recentBookings.filter((booking) => {
    if (bookingFilter === "all") return true
    return booking.status === bookingFilter
  })

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              PeshawarStays
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/hotels" className="text-muted-foreground hover:text-primary transition-colors">
                Browse Hotels
              </Link>
              <Link href="/dashboard/host" className="text-primary font-medium">
                Host Dashboard
              </Link>
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-luxury-gold text-primary">MH</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, Muhammad!</h1>
          <p className="text-muted-foreground">Manage your properties and grow your hospitality business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                      </div>
                      <div className="bg-luxury-gold/10 p-3 rounded-full">
                        <stat.icon className="h-6 w-6 text-luxury-gold" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-luxury-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Add New Property</h3>
                  <p className="text-muted-foreground mb-4">List a new hotel or guest house</p>
                  <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
                    <DialogTrigger asChild>
                      <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary">Add Property</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                        <DialogDescription>
                          Create a new property listing for your hotel or guest house
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="property-name">Property Name</Label>
                            <Input id="property-name" placeholder="Enter property name" />
                          </div>
                          <div>
                            <Label htmlFor="property-type">Property Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="guest-house">Guest House</SelectItem>
                                <SelectItem value="resort">Resort</SelectItem>
                                <SelectItem value="apartment">Apartment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="property-address">Address</Label>
                          <Textarea id="property-address" placeholder="Enter complete address" />
                        </div>
                        <div>
                          <Label htmlFor="property-description">Description</Label>
                          <Textarea id="property-description" placeholder="Describe your property" rows={3} />
                        </div>
                        <div>
                          <Label>Property Images</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary">
                            Create Property
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-luxury-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bed className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Add New Room</h3>
                  <p className="text-muted-foreground mb-4">Add rooms to existing properties</p>
                  <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
                    <DialogTrigger asChild>
                      <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary">Add Room</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Room</DialogTitle>
                        <DialogDescription>Add a new room to one of your existing properties</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="select-property">Select Property</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose property" />
                            </SelectTrigger>
                            <SelectContent>
                              {properties.map((property) => (
                                <SelectItem key={property.id} value={property.id.toString()}>
                                  {property.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="room-type">Room Type</Label>
                            <Input id="room-type" placeholder="e.g., Deluxe Room" />
                          </div>
                          <div>
                            <Label htmlFor="room-price">Price per Night (PKR)</Label>
                            <Input id="room-price" type="number" placeholder="15000" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="room-capacity">Max Guests</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select capacity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Guest</SelectItem>
                                <SelectItem value="2">2 Guests</SelectItem>
                                <SelectItem value="3">3 Guests</SelectItem>
                                <SelectItem value="4">4 Guests</SelectItem>
                                <SelectItem value="5">5+ Guests</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="room-size">Room Size (sq ft)</Label>
                            <Input id="room-size" type="number" placeholder="300" />
                          </div>
                        </div>
                        <div>
                          <Label>Room Amenities</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">WiFi</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Air Conditioning</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">TV</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Mini Bar</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Balcony</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Room Service</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label>Room Images</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Upload room photos</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAddRoom(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary">Add Room</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-luxury-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">View Analytics</h3>
                  <p className="text-muted-foreground mb-4">Track your performance</p>
                  <Button
                    variant="outline"
                    className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-primary"
                    onClick={() => alert("Opening analytics reports...")}
                  >
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Bookings</CardTitle>
                  <CardDescription>Latest reservations from guests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-luxury-cream rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-primary">{booking.guestName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.property} • {booking.checkIn} - {booking.checkOut}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium text-primary mt-1">PKR {booking.total.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("bookings")}>
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">Property Performance</CardTitle>
                  <CardDescription>How your properties are performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-3 bg-luxury-cream rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.name}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-primary">{property.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {property.occupancy}% occupancy • {property.reviews} reviews
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">PKR {property.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">This month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Your Properties</h2>
              <Button
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary"
                onClick={() => setShowAddProperty(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="grid gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-primary mb-2">{property.name}</h3>
                            <p className="text-muted-foreground flex items-center mb-2">
                              <MapPin className="h-4 w-4 mr-2 text-luxury-gold" />
                              {property.location}
                            </p>
                            <Badge className="bg-luxury-gold text-primary">{property.type}</Badge>
                          </div>
                          <Badge
                            variant={property.status === "active" ? "default" : "secondary"}
                            className={property.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {property.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                          <div className="text-center p-3 bg-luxury-cream rounded-lg">
                            <p className="font-bold text-lg text-primary">{property.rooms}</p>
                            <p className="text-muted-foreground">Total Rooms</p>
                          </div>
                          <div className="text-center p-3 bg-luxury-cream rounded-lg">
                            <p className="font-bold text-lg text-primary">{property.occupancy}%</p>
                            <p className="text-muted-foreground">Occupancy</p>
                          </div>
                          <div className="text-center p-3 bg-luxury-cream rounded-lg">
                            <p className="font-bold text-lg text-primary flex items-center justify-center">
                              <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold mr-1" />
                              {property.rating}
                            </p>
                            <p className="text-muted-foreground">Rating</p>
                          </div>
                          <div className="text-center p-3 bg-luxury-cream rounded-lg">
                            <p className="font-bold text-lg text-primary">{property.totalBookings}</p>
                            <p className="text-muted-foreground">Bookings</p>
                          </div>
                          <div className="text-center p-3 bg-luxury-cream rounded-lg">
                            <p className="font-bold text-lg text-primary">PKR {property.revenue.toLocaleString()}</p>
                            <p className="text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => handleViewPropertyDetails(property.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditProperty(property.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowAddRoom(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Manage Rooms</h2>
              <Button
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary"
                onClick={() => setShowAddRoom(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Room
              </Button>
            </div>

            {properties.map((property) => (
              <Card key={property.id} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">{property.name}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sample rooms for each property */}
                    {[
                      {
                        type: "Standard Room",
                        price: 8000,
                        capacity: 2,
                        available: 5,
                        amenities: ["WiFi", "AC", "TV"],
                      },
                      {
                        type: "Deluxe Room",
                        price: 12000,
                        capacity: 2,
                        available: 3,
                        amenities: ["WiFi", "AC", "TV", "Mini Bar"],
                      },
                      {
                        type: "Executive Suite",
                        price: 18000,
                        capacity: 4,
                        available: 2,
                        amenities: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"],
                      },
                    ].map((room, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-primary">{room.type}</h4>
                            <Badge
                              variant="outline"
                              className={
                                room.available > 0 ? "border-green-500 text-green-700" : "border-red-500 text-red-700"
                              }
                            >
                              {room.available} Available
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Price:</span> PKR {room.price.toLocaleString()}/night
                            </p>
                            <p>
                              <span className="font-medium">Capacity:</span> {room.capacity} guests
                            </p>
                            <div>
                              <span className="font-medium">Amenities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {room.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Manage Bookings</h2>
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

            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-luxury-gold/10 p-3 rounded-full">
                          <Users className="h-6 w-6 text-luxury-gold" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary text-lg">{booking.guestName}</h3>
                          <p className="text-muted-foreground">{booking.guestEmail}</p>
                          <p className="text-muted-foreground">{booking.guestPhone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
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
                        <p className="text-sm text-muted-foreground mt-1">Booked: {booking.bookingDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-luxury-cream rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Property</p>
                        <p className="text-muted-foreground">{booking.property}</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary">Room Type</p>
                        <p className="text-muted-foreground">{booking.roomType}</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary">Check-in/out</p>
                        <p className="text-muted-foreground">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-primary">Total Amount</p>
                        <p className="text-muted-foreground font-bold">PKR {booking.total.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewBookingDetails(booking.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAcceptBooking(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeclineBooking(booking.id)}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Contacting ${booking.guestName} at ${booking.guestEmail}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Guest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Guest Reviews</h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No reviews to manage yet</h3>
                <p className="text-muted-foreground mb-4">
                  Guest reviews will appear here once you start receiving bookings and guests complete their stays.
                </p>
                <Button variant="outline">Learn About Reviews</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Account Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">Host Information</CardTitle>
                  <CardDescription>Update your host profile and business details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-luxury-gold text-primary text-lg">MH</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-primary">Business Name</Label>
                      <p className="text-muted-foreground">Green Guest House</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Contact Email</Label>
                      <p className="text-muted-foreground">host@greenguesthouse.com</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Phone Number</Label>
                      <p className="text-muted-foreground">+92 300 1234567</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Business License</Label>
                      <p className="text-muted-foreground">Verified ✓</p>
                    </div>
                  </div>
                  <Button
                    className="bg-luxury-gold hover:bg-luxury-gold/90 text-primary"
                    onClick={() => alert("Opening profile edit form...")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">Payment & Banking</CardTitle>
                  <CardDescription>Manage your payment information and banking details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-primary">Bank Account</Label>
                      <p className="text-muted-foreground">****1234 - HBL Bank</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Tax Information</Label>
                      <p className="text-muted-foreground">NTN: 1234567-8</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Payment Schedule</Label>
                      <p className="text-muted-foreground">Weekly transfers</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-primary">Commission Rate</Label>
                      <p className="text-muted-foreground">5% per booking</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-primary"
                    onClick={() => alert("Opening payment settings...")}
                  >
                    Update Payment Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Property Details Modal */}
        {showPropertyDetails && (
          <Dialog open={!!showPropertyDetails} onOpenChange={() => setShowPropertyDetails(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Property Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {properties.find((p) => p.id === showPropertyDetails) && (
                  <div>
                    <h3 className="text-xl font-bold">{properties.find((p) => p.id === showPropertyDetails)?.name}</h3>
                    <p>Location: {properties.find((p) => p.id === showPropertyDetails)?.location}</p>
                    <p>Type: {properties.find((p) => p.id === showPropertyDetails)?.type}</p>
                    <p>Total Rooms: {properties.find((p) => p.id === showPropertyDetails)?.rooms}</p>
                    <p>Occupancy: {properties.find((p) => p.id === showPropertyDetails)?.occupancy}%</p>
                    <p>Revenue: PKR {properties.find((p) => p.id === showPropertyDetails)?.revenue.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Property Modal */}
        {showEditProperty && (
          <Dialog open={!!showEditProperty} onOpenChange={() => setShowEditProperty(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Property Name</Label>
                  <Input defaultValue={properties.find((p) => p.id === showEditProperty)?.name} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input defaultValue={properties.find((p) => p.id === showEditProperty)?.location} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEditProperty(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Property updated successfully!")
                      setShowEditProperty(null)
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Booking Details Modal */}
        {showBookingDetails && (
          <Dialog open={!!showBookingDetails} onOpenChange={() => setShowBookingDetails(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {recentBookings.find((b) => b.id === showBookingDetails) && (
                  <div>
                    <h3 className="text-xl font-bold">
                      {recentBookings.find((b) => b.id === showBookingDetails)?.guestName}
                    </h3>
                    <p>Email: {recentBookings.find((b) => b.id === showBookingDetails)?.guestEmail}</p>
                    <p>Phone: {recentBookings.find((b) => b.id === showBookingDetails)?.guestPhone}</p>
                    <p>Property: {recentBookings.find((b) => b.id === showBookingDetails)?.property}</p>
                    <p>Room: {recentBookings.find((b) => b.id === showBookingDetails)?.roomType}</p>
                    <p>Check-in: {recentBookings.find((b) => b.id === showBookingDetails)?.checkIn}</p>
                    <p>Check-out: {recentBookings.find((b) => b.id === showBookingDetails)?.checkOut}</p>
                    <p>Guests: {recentBookings.find((b) => b.id === showBookingDetails)?.guests}</p>
                    <p>Total: PKR {recentBookings.find((b) => b.id === showBookingDetails)?.total.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
