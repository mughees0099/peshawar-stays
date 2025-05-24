"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Edit,
  Shield,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Active Properties",
    value: "89",
    change: "+8%",
    icon: Home,
  },
  {
    title: "Total Revenue",
    value: "PKR 2.4M",
    change: "+15%",
    icon: DollarSign,
  },
  {
    title: "Platform Growth",
    value: "23%",
    change: "+5%",
    icon: TrendingUp,
  },
]

const pendingProperties = [
  {
    id: 1,
    name: "Mountain View Resort",
    owner: "Ali Khan",
    location: "Murree Road, Peshawar",
    type: "Resort",
    rooms: 25,
    submittedDate: "2024-02-10",
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    name: "City Center Hotel",
    owner: "Sarah Ahmed",
    location: "GT Road, Peshawar",
    type: "Hotel",
    rooms: 15,
    submittedDate: "2024-02-08",
    image: "/placeholder.svg?height=100&width=150",
  },
]

const allUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    type: "Customer",
    joinDate: "2024-01-15",
    status: "Active",
    bookings: 5,
  },
  {
    id: 2,
    name: "Ali Khan",
    email: "ali@example.com",
    type: "Host",
    joinDate: "2024-01-10",
    status: "Active",
    properties: 2,
  },
  {
    id: 3,
    name: "Sarah Ahmed",
    email: "sarah@example.com",
    type: "Host",
    joinDate: "2024-02-01",
    status: "Pending",
    properties: 1,
  },
]

const allProperties = [
  {
    id: 1,
    name: "Pearl Continental Peshawar",
    owner: "PC Hotels",
    location: "University Town",
    type: "Luxury Hotel",
    rooms: 150,
    rating: 4.8,
    status: "Active",
    revenue: 850000,
  },
  {
    id: 2,
    name: "Green Guest House",
    owner: "Ali Khan",
    location: "Hayatabad",
    type: "Guest House",
    rooms: 12,
    rating: 4.4,
    status: "Active",
    revenue: 245000,
  },
]

const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "/login"
  }
}

const handleApproveProperty = (propertyId: number) => {
  if (confirm("Approve this property?")) {
    alert("Property approved successfully!")
    // Update property status logic here
  }
}

const handleRejectProperty = (propertyId: number) => {
  if (confirm("Reject this property?")) {
    alert("Property rejected.")
    // Update property status logic here
  }
}

const handleReviewProperty = (propertyId: number) => {
  alert(`Opening detailed review for property ${propertyId}`)
  // Add review modal logic here
}

const handleViewPropertyDetails = (propertyId: number) => {
  alert(`Viewing details for property ${propertyId}`)
  // Add property details modal logic here
}

const handleEditProperty = (propertyId: number) => {
  alert(`Opening edit form for property ${propertyId}`)
  // Add edit modal logic here
}

const handleViewUserDetails = (userId: number) => {
  alert(`Viewing details for user ${userId}`)
  // Add user details modal logic here
}

const handleEditUser = (userId: number) => {
  alert(`Opening edit form for user ${userId}`)
  // Add edit modal logic here
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                PeshawarStays
              </Link>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AD</AvatarFallback>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, properties, and platform operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
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
                <CardDescription>Review and approve new property listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={property.image || "/placeholder.svg"}
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
                            {property.type} • {property.rooms} rooms • Submitted {property.submittedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleReviewProperty(property.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button size="sm" onClick={() => handleApproveProperty(property.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectProperty(property.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Properties</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10 w-64"
                    onChange={(e) => alert(`Searching for: ${e.target.value}`)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {allProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{property.name}</h3>
                          <Badge variant={property.status === "Active" ? "default" : "secondary"}>
                            {property.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Owner: {property.owner} • {property.location}
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
                            <p className="font-medium">PKR {property.revenue.toLocaleString()}</p>
                            <p className="text-muted-foreground">Revenue</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewPropertyDetails(property.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditProperty(property.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => alert("More options...")}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    onChange={(e) => alert(`Searching for: ${e.target.value}`)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
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
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Activity</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{user.type}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                          <td className="p-4">
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {user.type === "Customer" ? `${user.bookings} bookings` : `${user.properties} properties`}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewUserDetails(user.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => alert("More user options...")}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
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

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">All Bookings</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Booking management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Analytics dashboard with charts and insights will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
