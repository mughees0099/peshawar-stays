"use client";

import { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const hotels = [
  {
    id: 1,
    name: "Pearl Continental Peshawar",
    location: "University Town, Peshawar",
    price: 15000,
    rating: 4.8,
    reviews: 324,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Parking", "Restaurant", "Pool"],
    type: "Luxury Hotel",
    description:
      "Experience luxury at its finest with world-class amenities and exceptional service.",
  },
  {
    id: 2,
    name: "Shelton's Rezidor",
    location: "Saddar, Peshawar",
    price: 12000,
    rating: 4.6,
    reviews: 189,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Parking", "Restaurant"],
    type: "Business Hotel",
    description:
      "Perfect for business travelers with modern facilities and prime location.",
  },
  {
    id: 3,
    name: "Green Guest House",
    location: "Hayatabad, Peshawar",
    price: 8000,
    rating: 4.4,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Parking", "Breakfast"],
    type: "Guest House",
    description:
      "Comfortable and affordable accommodation with a homely atmosphere.",
  },
  {
    id: 4,
    name: "Frontier Guest House",
    location: "Cantonment, Peshawar",
    price: 6500,
    rating: 4.2,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Restaurant"],
    type: "Guest House",
    description:
      "Budget-friendly option with essential amenities and friendly service.",
  },
  {
    id: 5,
    name: "Peshawar Serena Hotel",
    location: "Khyber Road, Peshawar",
    price: 18000,
    rating: 4.9,
    reviews: 412,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Parking", "Restaurant", "Pool"],
    type: "Luxury Hotel",
    description:
      "Premium luxury hotel with exceptional dining and spa facilities.",
  },
  {
    id: 6,
    name: "City Guest House",
    location: "GT Road, Peshawar",
    price: 5500,
    rating: 4.0,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Wifi", "Parking"],
    type: "Guest House",
    description:
      "Simple and clean accommodation for budget-conscious travelers.",
  },
];

const amenityIcons = {
  Wifi: Wifi,
  Parking: Car,
  Restaurant: Coffee,
  Pool: Waves,
  Breakfast: Coffee,
};

export default function HotelsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("rating");

  const amenities = ["Wifi", "Parking", "Restaurant", "Pool", "Breakfast"];
  const hotelTypes = ["Luxury Hotel", "Business Hotel", "Guest House"];

  const filteredHotels = hotels
    .filter((hotel) => {
      const priceInRange =
        hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      const hasSelectedAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity));
      const matchesType = !selectedType || hotel.type === selectedType;

      return priceInRange && hasSelectedAmenities && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

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
                    <Input placeholder="Search hotels..." className="pl-10" />
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
                    max={25000}
                    min={0}
                    step={1000}
                    className="mt-2"
                  />
                </div>

                {/* Hotel Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Hotel Type
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
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
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
                        <label htmlFor={amenity} className="text-sm">
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
                    setPriceRange([0, 20000]);
                    setSelectedAmenities([]);
                    setSelectedType("");
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
                <h1 className="text-2xl font-bold">Hotels in Peshawar</h1>
                <p className="text-muted-foreground">
                  {filteredHotels.length} properties found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
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

            {/* Hotels Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredHotels.map((hotel) => (
                <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
                  <Card
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                      viewMode === "list"
                        ? "flex flex-row"
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
                        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === "list" ? "w-full h-full" : "w-full h-48"
                        }`}
                      />
                      <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                        {hotel.type}
                      </Badge>
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
                            {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </p>
                      {viewMode === "list" && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {hotel.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hotel.amenities.slice(0, 3).map((amenity) => {
                          const Icon =
                            amenityIcons[amenity as keyof typeof amenityIcons];
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
                          {hotel.reviews} reviews
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No hotels found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setPriceRange([0, 20000]);
                    setSelectedAmenities([]);
                    setSelectedType("");
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
