"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Grid,
  List,
  Wifi,
  Car,
  Coffee,
  Waves,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
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
  image: string;
  amenities: string[];
  type: string;
  description: string;
  availableRooms: number;
}

const amenityIcons = {
  // Wifi: Wifi,
  // Parking: Car,
  // Restaurant: Coffee,
  // Pool: Waves,
  // Breakfast: Coffee,
  // "Free WiFi": Wifi,
  // "Air Conditioning": Waves,
  // "Room Service": Coffee,
};

export default function HotelsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [searchTerm, setSearchTerm] = useState("");

  const transformPropertyToHotel = (property: Property): HotelData => {
    const averageRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, review) => sum + review.rating, 0) /
          property.reviews.length
        : 0;

    const totalAvailableRooms = property.roomDetails.reduce(
      (sum, room) => sum + room.availableRooms,
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
      image: property.images[0]?.url || "/placeholder.svg?height=300&width=400",
      amenities: property.amenities,
      type: propertyType,
      description: property.description,
      availableRooms: totalAvailableRooms,
    };
  };

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const response = await axios.get("/api/Property/properties");
        setProperties(response.data);

        if (response.data.length > 0) {
          const prices = response.data.map((p: Property) => p.pricePerNight);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([0, Math.ceil(maxPrice * 1)]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const allAmenities = Array.from(
    new Set(properties.flatMap((property) => property.amenities))
  );

  const hotelTypes = [
    "Luxury Hotel",
    "Business Hotel",
    "Guest House",
    "Standard Hotel",
  ];

  const hotels = properties.map(transformPropertyToHotel);

  const filteredHotels = hotels
    .filter((hotel) => {
      const priceInRange =
        hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      const hasSelectedAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) =>
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      const matchesType = selectedType === "all" || hotel.type === selectedType;
      const matchesSearch =
        !searchTerm ||
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        priceInRange && hasSelectedAmenities && matchesType && matchesSearch
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "availability":
          return b.availableRooms - a.availableRooms;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range (PKR {priceRange[0].toLocaleString()} - PKR{" "}
                    {priceRange[1].toLocaleString()})
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={Math.max(50000, ...hotels.map((h) => h.price))}
                    min={0}
                    step={1000}
                    className="mt-2"
                  />
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Property Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {hotelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Amenities
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allAmenities.slice(0, 10).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAmenities([
                                ...selectedAmenities,
                                amenity,
                              ]);
                            } else {
                              setSelectedAmenities(
                                selectedAmenities.filter((a) => a !== amenity)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={amenity}
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const maxPrice = Math.max(
                      50000,
                      ...hotels.map((h) => h.price)
                    );
                    setPriceRange([0, maxPrice]);
                    setSelectedAmenities([]);
                    setSelectedType("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Properties</h1>
                <p className="text-muted-foreground">
                  {filteredHotels.length} properties found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="availability">Most Available</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-7 "
              }
            >
              {filteredHotels.map((hotel) => (
                <div key={hotel.id}>
                  <Link href={`/hotel/${hotel.id}`} className="my-8">
                    <Card
                      className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                        viewMode === "list"
                          ? "flex flex-row "
                          : "transform hover:-translate-y-1"
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? "w-64 flex-shrink-0"
                            : "rounded-t-lg"
                        }`}
                      >
                        <Image
                          src={hotel.image || "/placeholder.svg"}
                          alt={hotel.name}
                          width={400}
                          height={300}
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 h-48 w-full`}
                        />
                        <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                          {hotel.type}
                        </Badge>
                        {hotel.availableRooms > 0 && (
                          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                            {hotel.availableRooms} rooms available
                          </Badge>
                        )}
                      </div>
                      <CardContent
                        className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium">
                              {hotel.rating > 0 ? hotel.rating : "New"}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {hotel.location.length > 30
                            ? `${hotel.location.slice(0, 30)}...`
                            : hotel.location}
                        </p>
                        {viewMode === "list" && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {hotel.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.slice(0, 3).map((amenity) => {
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
                                {Icon && <Icon className="h-3 w-3 mr-1" />}
                                {amenity}
                              </Badge>
                            );
                          })}
                          {hotel.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold">
                              PKR {hotel.price.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {" "}
                              / night
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {hotel.reviews}{" "}
                            {hotel.reviews === 1 ? "review" : "reviews"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            {filteredHotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No properties found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const maxPrice = Math.max(
                      50000,
                      ...hotels.map((h) => h.price)
                    );
                    setPriceRange([0, maxPrice]);
                    setSelectedAmenities([]);
                    setSelectedType("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
