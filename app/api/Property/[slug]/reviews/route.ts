import Property from "@/models/property";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

    const body = await request.json();
    const { customer, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      slug,
      {
        $push: {
          reviews: {
            rating,
            comment,
            date: new Date(),
            customer: customer,
          },
        },
      },
      { new: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error("Error updating property reviews:", error);
    return NextResponse.json(
      { error: "Failed to update property reviews" },
      { status: 500 }
    );
  }
}
