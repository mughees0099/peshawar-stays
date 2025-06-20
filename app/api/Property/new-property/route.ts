import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/property";
import Host from "@/models/host";
import connectDB from "@/lib/db";
import { isValidObjectId } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      description,
      address,
      pricePerNight,
      owner,
      images,
      amenities,
      roomDetails,
    } = body;

    if (
      !name ||
      !description ||
      !address ||
      !pricePerNight ||
      !owner ||
      !images ||
      !amenities ||
      !roomDetails
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(owner)) {
      return NextResponse.json({ error: "Invalid host ID" }, { status: 400 });
    }

    const hostExists = await Host.findById(owner);
    if (!hostExists) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    const newProperty = await Property.create({
      name,
      description,
      address,
      pricePerNight,
      owner,
      images,
      amenities,
      roomDetails,
    });

    return NextResponse.json(
      { message: "Property created successfully", property: newProperty },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
