import { NextResponse } from "next/server";
import Property from "@/models/property";
import connectDB from "@/lib/db";
import { isValidObjectId } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!isValidObjectId(slug)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await Property.find({ owner: slug })
      .populate("owner", "name email")
      .populate("reviews.customer", "firstName lastName email");

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
