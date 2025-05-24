"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Star, CreditCard, User, Heart, MessageSquare, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const bookings = [
  {
    id: 1,
    hotelName: "Pearl Continental Peshawar",
    roomType: "Deluxe Room",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    guests: 2,
    total: 45000,
    status: "confirmed",
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    hotelName: "Green Guest House",
    roomType: "Standard Room",
    checkIn: "2024-01-20",
    checkOut: "2024-01-22",
    guests: 1,
    total: 16000,
    status: "completed",
    image: "/placeholder.svg?height=100&width=150",
  },
]

const favorites = [
  {
    id: 1,
    name: "Shelton's Rezidor",
    location: "Saddar, Peshawar",
    rating: 4.6,
    price: 12000,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    name: "Frontier Guest House",
    location: "Cantonment, Peshawar",
    rating: 4.2,
    price: 6500,
    image: "/placeholder.svg?height=100&width=150",
  },
]

const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "/login"
  }
}

const handleViewBookingDetails = (bookingId: number) => {
  alert(`Viewing details for booking ${bookingId}`)
  // Add modal or navigation logic here
}

const handleCancelBooking = (bookingId: number) => {
  if (confirm("Are you sure you want to cancel this booking?")) {
    alert("Booking cancelled successfully!")
    // Update booking status logic here
  }
}

const handleWriteReview = (bookingId: number) => {
  alert(`Opening review form for booking ${bookingId}`)
  // Add review modal logic here
}

const handleRemoveFavorite = (hotelId: number) => {
  if (confirm("Remove from favorites?")) {
    alert("Removed from favorites!")
    // Update favorites logic here
  }
}

const handleEditProfile = () => {
  alert("Opening profile edit form...")
  // Add profile edit modal logic here
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              PeshawarStays
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/hotels" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Hotels
              </Link>
              <Link href="/dashboard/customer" className="text-foreground font-medium">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
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
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Manage your bookings and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Image
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.hotelName}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{booking.hotelName}</h3>
                            <p className="text-muted-foreground">{booking.roomType}</p>
                          </div>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
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
                            <span>{booking.guests} guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            <span>PKR {booking.total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => handleViewBookingDetails(booking.id)}>
                            View Details
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </Button>
                          )}
                          {booking.status === "completed" && (
                            <Button variant="outline" size="sm" onClick={() => handleWriteReview(booking.id)}>
                              Write Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Your Favorite Hotels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((hotel) => (
                  <Card key={hotel.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
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
                        onClick={() => handleRemoveFavorite(hotel.id)}
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
                          <span className="font-bold">PKR {hotel.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground"> / night</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Your Reviews</h2>
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your experience by writing reviews for hotels you've stayed at.
                  </p>
                  <Button>Write Your First Review</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Photo</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <p className="text-muted-foreground">John</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <p className="text-muted-foreground">Doe</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">john.doe@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-muted-foreground">+92 300 1234567</p>
                    </div>
                    <Button onClick={handleEditProfile}>Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => alert("Opening notification settings...")}>
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">Change your account password</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => alert("Opening password change form...")}>
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => alert("Opening 2FA setup...")}>
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
