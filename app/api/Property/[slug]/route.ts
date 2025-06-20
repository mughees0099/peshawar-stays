import Property from "@/models/property";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const property = await Property.findById(slug)
      .populate("owner", "firstName lastName email phone")
      .populate("reviews.customer", "firstName lastName");
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

    const body = await request.json();
    const {
      name,
      description,
      address,
      pricePerNight,
      images,
      amenities,
      roomDetails,
    } = body;

    if (
      !name ||
      !description ||
      !address ||
      !pricePerNight ||
      !images ||
      !amenities ||
      !roomDetails
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      slug,
      {
        name,
        description,
        address,
        pricePerNight,
        images,
        amenities,
        roomDetails,
      },
      { new: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property updated successfully", property: updatedProperty },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

    const deletedProperty = await Property.findByIdAndDelete(slug);

    if (!deletedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
