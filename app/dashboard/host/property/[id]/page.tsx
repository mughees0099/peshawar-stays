"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ArrowLeft,
  Edit,
  Save,
  Plus,
  Trash2,
  MapPin,
  Star,
  Users,
  Bed,
  DollarSign,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
  _id?: string;
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

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Property | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editingRoomData, setEditingRoomData] = useState<RoomDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );
  const [newRoom, setNewRoom] = useState<RoomDetail>({
    type: "",
    totalRooms: 0,
    availableRooms: 0,
    pricePerNight: 0,
    amenities: [],
    customerCapacity: 1,
    images: [],
  });

  useEffect(() => {
    if (!params.id) {
      return;
    }
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/Property/${params.id}`);
      if (response.status === 200) {
        setProperty(response.data);
        setEditData(response.data);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);

      toast.error("Failed to fetch property data");
    } finally {
      setLoading(false);
    }
  };

  // Cloudinary image upload function
  const uploadToCloudinary = async (
    file: File,
    folder = "peshawar_stays"
  ): Promise<string> => {
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

  // Handle room image upload for new room
  const handleNewRoomImageUpload = async (files: FileList | null) => {
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
        altText: `Room image ${newRoom.images.length + newImages.length + 1}`,
        file,
        isUploading: false,
      };

      newImages.push(tempImage);
    }

    // Add images to state immediately for preview
    setNewRoom((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Upload each image to Cloudinary
    for (let i = 0; i < newImages.length; i++) {
      const imageIndex = newRoom.images.length + i;
      try {
        const cloudinaryUrl = await uploadToCloudinary(
          newImages[i].file!,
          "rooms"
        );

        setNewRoom((prev) => ({
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
        setNewRoom((prev) => ({
          ...prev,
          images: prev.images.filter((_, idx) => idx !== imageIndex),
        }));

        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
  };

  // Remove room image from new room
  const removeNewRoomImage = (index: number) => {
    setNewRoom((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle room amenity change for new room
  const handleNewRoomAmenityChange = (amenity: string, checked: boolean) => {
    setNewRoom((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSaveProperty = async () => {
    if (!editData) return;

    try {
      setSaving(true);

      // Upload any pending images
      const updatedImages = await Promise.all(
        editData.images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadToCloudinary(image.file);
            return {
              url: uploadedUrl,
              altText: image.altText,
              isUploading: false,
            };
          }
          return { url: image.url, altText: image.altText };
        })
      );

      // Upload room images
      const updatedRoomDetails = await Promise.all(
        editData.roomDetails.map(async (room) => {
          const updatedRoomImages = await Promise.all(
            room.images.map(async (image) => {
              if (image.file) {
                const uploadedUrl = await uploadToCloudinary(image.file);
                return { url: uploadedUrl, altText: image.altText };
              }
              return { url: image.url, altText: image.altText };
            })
          );
          return { ...room, images: updatedRoomImages };
        })
      );

      const response = await axios.patch(`/api/Property/${params.id}`, {
        name: editData.name,
        description: editData.description,
        address: editData.address,
        pricePerNight: editData.pricePerNight,
        images: updatedImages,
        amenities: editData.amenities,
        roomDetails: updatedRoomDetails,
      });

      if (response.status === 200) {
        const updatedProperty = {
          ...editData,
          images: updatedImages,
          roomDetails: updatedRoomDetails,
        };
        setProperty(updatedProperty);
        setEditData(updatedProperty);
        setIsEditing(false);

        toast.success("Property updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async () => {
    Swal.fire({
      title: "Delete Property",
      text: "Are you sure you want to delete this property? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "green",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/Property/${params.id}`);
          if (response.status === 200) {
            toast.success("Property deleted successfully!");
            router.push("/dashboard/host");
          }
        } catch (error) {
          console.error("Error deleting property:", error);

          toast.error("Failed to delete property");
        }
      }
    });
  };

  const handleAddRoom = async () => {
    if (!editData) return;

    // Validate form
    if (!newRoom.type) {
      toast.error("Please select a room type");
      return;
    }

    if (newRoom.totalRooms <= 0) {
      toast.error("Total rooms must be greater than 0");
      return;
    }

    if (newRoom.pricePerNight <= 0) {
      toast.error("Price per night must be greater than 0");
      return;
    }

    // Check if any images are still uploading
    const hasUploadingImages = newRoom.images.some((img) => img.isUploading);
    if (hasUploadingImages) {
      toast.error(
        "Please wait for all images to finish uploading before adding the room."
      );
      return;
    }

    try {
      setIsSubmittingRoom(true);

      // Images are already uploaded to Cloudinary, just use the URLs
      const roomToAdd: RoomDetail = {
        ...newRoom,
        images: newRoom.images.map((img) => ({
          url: img.url,
          altText: img.altText,
        })),
      };

      const updatedProperty = {
        ...editData,
        roomDetails: [...editData.roomDetails, roomToAdd],
      };

      const response = await axios.patch(`/api/Property/${params.id}`, {
        name: updatedProperty.name,
        description: updatedProperty.description,
        address: updatedProperty.address,
        pricePerNight: updatedProperty.pricePerNight,
        images: updatedProperty.images,
        amenities: updatedProperty.amenities,
        roomDetails: updatedProperty.roomDetails,
      });

      if (response.status === 200) {
        setProperty(updatedProperty);
        setEditData(updatedProperty);
        setNewRoom({
          type: "",
          totalRooms: 0,
          availableRooms: 0,
          pricePerNight: 0,
          amenities: [],
          customerCapacity: 1,
          images: [],
        });
        setShowAddRoom(false);

        toast.success("Room added successfully!");
      }
    } catch (error) {
      console.error("Error adding room:", error);

      toast.error("Failed to add room");
    } finally {
      setIsSubmittingRoom(false);
    }
  };

  const handleUpdateRoom = async (roomIndex: number) => {
    if (!editData || !editingRoomData) return;

    try {
      // Upload any new images
      setSaving(true);
      const uploadedImages = await Promise.all(
        editingRoomData.images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadToCloudinary(image.file);
            return { url: uploadedUrl, altText: image.altText };
          }
          return { url: image.url, altText: image.altText };
        })
      );

      const updatedRoom = { ...editingRoomData, images: uploadedImages };
      const updatedProperty = {
        ...editData,
        roomDetails: editData.roomDetails.map((room, index) =>
          index === roomIndex ? updatedRoom : room
        ),
      };

      const response = await axios.patch(`/api/Property/${params.id}`, {
        name: updatedProperty.name,
        description: updatedProperty.description,
        address: updatedProperty.address,
        pricePerNight: updatedProperty.pricePerNight,
        images: updatedProperty.images,
        amenities: updatedProperty.amenities,
        roomDetails: updatedProperty.roomDetails,
      });

      if (response.status === 200) {
        setProperty(updatedProperty);
        setEditData(updatedProperty);
        setEditingRoom(null);
        setEditingRoomData(null);

        toast.success("Room updated successfully!");
      }
    } catch (error) {
      console.error("Error updating room:", error);

      toast.error("Failed to update room");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomIndex: number) => {
    if (!confirm("Are you sure you want to delete this room type?")) return;
    if (!editData) return;

    const updatedProperty = {
      ...editData,
      roomDetails: editData.roomDetails.filter(
        (_, index) => index !== roomIndex
      ),
    };

    try {
      const response = await axios.patch(`/api/Property/${params.id}`, {
        name: updatedProperty.name,
        description: updatedProperty.description,
        address: updatedProperty.address,
        pricePerNight: updatedProperty.pricePerNight,
        images: updatedProperty.images,
        amenities: updatedProperty.amenities,
        roomDetails: updatedProperty.roomDetails,
      });

      if (response.status === 200) {
        setProperty(updatedProperty);
        setEditData(updatedProperty);

        toast.success("Room deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting room:", error);

      toast.error("Failed to delete room");
    }
  };

  const handleImageUpload = async (
    files: FileList,
    type: "property" | "room",
    roomIndex?: number
  ) => {
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const imageId = `${type}-${Date.now()}-${Math.random()}`;
      setUploadingImages((prev) => new Set([...prev, imageId]));

      const newImage: PropertyImage | RoomImage = {
        url: URL.createObjectURL(file),
        altText: file.name,
        file: file,
        isUploading: true,
      };

      if (type === "property" && editData) {
        setEditData((prev) => ({
          ...prev!,
          images: [...prev!.images, newImage],
        }));
      } else if (type === "room" && roomIndex !== undefined) {
        if (editingRoom && editingRoomData) {
          setEditingRoomData((prev) => ({
            ...prev!,
            images: [...prev!.images, newImage],
          }));
        } else {
          setNewRoom((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
          }));
        }
      }
    });
  };

  const handleRemoveImage = (
    imageIndex: number,
    type: "property" | "room",
    roomIndex?: number
  ) => {
    if (type === "property" && editData) {
      setEditData((prev) => ({
        ...prev!,
        images: prev!.images.filter((_, index) => index !== imageIndex),
      }));
    } else if (type === "room") {
      if (editingRoom && editingRoomData) {
        setEditingRoomData((prev) => ({
          ...prev!,
          images: prev!.images.filter((_, index) => index !== imageIndex),
        }));
      } else {
        setNewRoom((prev) => ({
          ...prev,
          images: prev.images.filter((_, index) => index !== imageIndex),
        }));
      }
    }
  };

  const handleRoomAmenityChange = (
    amenity: string,
    checked: boolean,
    isEditing = false
  ) => {
    if (isEditing && editingRoomData) {
      setEditingRoomData((prev) => ({
        ...prev!,
        amenities: checked
          ? [...prev!.amenities, amenity]
          : prev!.amenities.filter((a) => a !== amenity),
      }));
    } else {
      setNewRoom((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, amenity]
          : prev.amenities.filter((a) => a !== amenity),
      }));
    }
  };

  const handlePropertyAmenityChange = (amenity: string, checked: boolean) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      amenities: checked
        ? [...prev!.amenities, amenity]
        : prev!.amenities.filter((a) => a !== amenity),
    }));
  };

  const startEditingRoom = (roomIndex: number) => {
    if (!editData) return;
    const room = editData.roomDetails[roomIndex];
    setEditingRoom(`${roomIndex}`);
    setEditingRoomData({ ...room });
  };

  const cancelEditingRoom = () => {
    setEditingRoom(null);
    setEditingRoomData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Property not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const totalRooms = property.roomDetails.reduce(
    (sum, room) => sum + room.totalRooms,
    0
  );
  const availableRooms = property.roomDetails.reduce(
    (sum, room) => sum + room.availableRooms,
    0
  );
  const occupancyRate =
    totalRooms > 0
      ? (((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {property.name}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-2" />
                {property.address}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Property
                </Button>
                <Button variant="destructive" onClick={handleDeleteProperty}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Property
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProperty} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bed className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{totalRooms}</p>
              <p className="text-gray-600">Total Rooms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{occupancyRate}%</p>
              <p className="text-gray-600">Occupancy Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">4.6</p>
              <p className="text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">
                PKR {property.pricePerNight.toLocaleString()}
              </p>
              <p className="text-gray-600">Base Price</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && editData ? (
                  <>
                    <div>
                      <Label>Property Name</Label>
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev!,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev!,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={editData.address}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev!,
                            address: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Base Price Per Night</Label>
                      <Input
                        type="number"
                        value={editData.pricePerNight}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev!,
                            pricePerNight: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="font-medium">Description</Label>
                      <p className="text-gray-700 mt-1">
                        {property.description}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Address</Label>
                      <p className="text-gray-700 mt-1">{property.address}</p>
                    </div>
                    <div>
                      <Label className="font-medium">
                        Base Price Per Night
                      </Label>
                      <p className="text-gray-700 mt-1">
                        PKR {property.pricePerNight.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Room Management</h3>
              <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Room Type</DialogTitle>
                    <DialogDescription>
                      Add a new room type to your property with all details and
                      images
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Basic Room Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        Room Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="room-type">Room Type *</Label>
                          <Select
                            value={newRoom.type}
                            onValueChange={(value) =>
                              setNewRoom((prev) => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROOM_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="customer-capacity">
                            Customer Capacity *
                          </Label>
                          <Input
                            id="customer-capacity"
                            type="number"
                            min="1"
                            placeholder="Max guests"
                            value={newRoom.customerCapacity}
                            onChange={(e) =>
                              setNewRoom((prev) => ({
                                ...prev,
                                customerCapacity: Number.parseInt(
                                  e.target.value
                                ),
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="total-rooms">Total Rooms *</Label>
                          <Input
                            id="total-rooms"
                            type="number"
                            min="0"
                            placeholder="Total rooms"
                            value={newRoom.totalRooms}
                            onChange={(e) =>
                              setNewRoom((prev) => ({
                                ...prev,
                                totalRooms: Number.parseInt(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="available-rooms">
                            Available Rooms *
                          </Label>
                          <Input
                            id="available-rooms"
                            type="number"
                            min="0"
                            placeholder="Available rooms"
                            value={newRoom.availableRooms}
                            onChange={(e) =>
                              setNewRoom((prev) => ({
                                ...prev,
                                availableRooms: Number.parseInt(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="price-per-night">
                            Price Per Night *
                          </Label>
                          <Input
                            id="price-per-night"
                            type="number"
                            min="0"
                            placeholder="Room price"
                            value={newRoom.pricePerNight}
                            onChange={(e) =>
                              setNewRoom((prev) => ({
                                ...prev,
                                pricePerNight: Number.parseInt(e.target.value),
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Room Amenities</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {AMENITIES_OPTIONS.slice(0, 12).map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`new-room-amenity-${amenity}`}
                              checked={newRoom.amenities.includes(amenity)}
                              onCheckedChange={(checked) =>
                                handleNewRoomAmenityChange(
                                  amenity,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`new-room-amenity-${amenity}`}
                              className="text-sm"
                            >
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Room Images */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Room Images</h4>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Click to upload or drag and drop room images
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          JPEG, PNG, WebP up to 5MB each
                        </p>

                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleNewRoomImageUpload(e.target.files)
                          }
                          className="hidden"
                          id="new-room-images"
                        />

                        <label
                          htmlFor="new-room-images"
                          className="cursor-pointer inline-block"
                        >
                          <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100">
                            Choose Images
                          </span>
                        </label>
                      </div>

                      {/* Image Preview Grid */}
                      {newRoom.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {newRoom.images.map((image, index) => (
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
                                  onClick={() => removeNewRoomImage(index)}
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
                                    const newImages = [...newRoom.images];
                                    newImages[index].altText = e.target.value;
                                    setNewRoom((prev) => ({
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

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddRoom(false);
                          setNewRoom({
                            type: "",
                            totalRooms: 0,
                            availableRooms: 0,
                            pricePerNight: 0,
                            amenities: [],
                            customerCapacity: 1,
                            images: [],
                          });
                        }}
                        disabled={isSubmittingRoom}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleAddRoom}
                        disabled={isSubmittingRoom}
                      >
                        {isSubmittingRoom ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding Room...
                          </>
                        ) : (
                          "Add Room"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {property.roomDetails.map((room, roomIndex) => (
                <Card key={roomIndex}>
                  <CardContent className="p-6">
                    {editingRoom === `${roomIndex}` && editingRoomData ? (
                      // Edit mode for room
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold">Edit Room</h4>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleUpdateRoom(roomIndex);
                              }}
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditingRoom}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Room Type</Label>
                            <Select
                              value={editingRoomData.type}
                              onValueChange={(value) =>
                                setEditingRoomData((prev) => ({
                                  ...prev!,
                                  type: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
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
                            <Label>Customer Capacity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={editingRoomData.customerCapacity}
                              onChange={(e) =>
                                setEditingRoomData((prev) => ({
                                  ...prev!,
                                  customerCapacity: Number.parseInt(
                                    e.target.value
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Total Rooms</Label>
                            <Input
                              type="number"
                              min="0"
                              value={editingRoomData.totalRooms}
                              onChange={(e) =>
                                setEditingRoomData((prev) => ({
                                  ...prev!,
                                  totalRooms: Number.parseInt(e.target.value),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Available Rooms</Label>
                            <Input
                              type="number"
                              min="0"
                              value={editingRoomData.availableRooms}
                              onChange={(e) =>
                                setEditingRoomData((prev) => ({
                                  ...prev!,
                                  availableRooms: Number.parseInt(
                                    e.target.value
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Price Per Night</Label>
                            <Input
                              type="number"
                              min="0"
                              value={editingRoomData.pricePerNight}
                              onChange={(e) =>
                                setEditingRoomData((prev) => ({
                                  ...prev!,
                                  pricePerNight: Number.parseInt(
                                    e.target.value
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Room Amenities
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {AMENITIES_OPTIONS.slice(0, 9).map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`edit-room-${roomIndex}-${amenity}`}
                                  checked={editingRoomData.amenities.includes(
                                    amenity
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleRoomAmenityChange(
                                      amenity,
                                      checked as boolean,
                                      true
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`edit-room-${roomIndex}-${amenity}`}
                                  className="text-xs"
                                >
                                  {amenity}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium">Room Images</Label>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    handleImageUpload(
                                      e.target.files,
                                      "room",
                                      roomIndex
                                    );
                                  }
                                }}
                                className="hidden"
                                id={`edit-room-image-${roomIndex}`}
                              />
                              <label htmlFor={`edit-room-image-${roomIndex}`}>
                                <Button size="sm" variant="outline" asChild>
                                  <span className="cursor-pointer">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Images
                                  </span>
                                </Button>
                              </label>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {editingRoomData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.altText}
                                  width={150}
                                  height={100}
                                  className="rounded-lg w-full h-80 object-cover relative"
                                />
                                {/* {image.isUploading && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                  </div>
                                )} */}
                                <button
                                  onClick={() =>
                                    handleRemoveImage(index, "room", roomIndex)
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View mode for room
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold capitalize">
                              {room.type} Room
                            </h4>
                            <p className="text-gray-600">
                              Capacity: {room.customerCapacity} guests
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditingRoom(roomIndex)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteRoom(roomIndex)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="font-bold text-lg">
                              {room.totalRooms}
                            </p>
                            <p className="text-gray-600 text-sm">Total Rooms</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="font-bold text-lg">
                              {room.availableRooms}
                            </p>
                            <p className="text-gray-600 text-sm">Available</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="font-bold text-lg">
                              PKR {room.pricePerNight.toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm">Per Night</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="font-bold text-lg">
                              {room.customerCapacity}
                            </p>
                            <p className="text-gray-600 text-sm">Max Guests</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label className="font-medium mb-2 block">
                            Room Amenities
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.map((amenity) => (
                              <Badge key={amenity} variant="secondary">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="font-medium mb-2 block">
                            Room Images
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {room.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image.url || "/placeholder.svg"}
                                alt={image.altText}
                                width={150}
                                height={100}
                                className="rounded-lg w-full h-80 object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && editData ? (
                  <div className="grid grid-cols-3 gap-3">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`property-amenity-${amenity}`}
                          checked={editData.amenities.includes(amenity)}
                          onCheckedChange={(checked) =>
                            handlePropertyAmenityChange(
                              amenity,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`property-amenity-${amenity}`}
                          className="text-sm"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="text-sm"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Property Images</CardTitle>
                  {isEditing && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handleImageUpload(e.target.files, "property");
                          }
                        }}
                        className="hidden"
                        id="property-image-upload"
                      />
                      <label htmlFor="property-image-upload">
                        <Button asChild>
                          <span className="cursor-pointer">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Images
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(isEditing ? editData?.images : property.images)?.map(
                    (image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.altText}
                          width={300}
                          height={200}
                          className="rounded-lg object-cover w-full h-48"
                        />

                        {isEditing && (
                          <button
                            onClick={() => handleRemoveImage(index, "property")}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
