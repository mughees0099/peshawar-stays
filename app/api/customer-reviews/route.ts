import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Property from "@/models/property";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("token") || req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.id;

    const reviewedProperties = await Property.find({
      "reviews.customer": customerId,
    }).select("name address images reviews");

    const customerReviews = reviewedProperties.flatMap((property) =>
      property.reviews
        .filter((review) => review.customer.toString() === customerId)
        .map((review) => ({
          id: property._id,
          propertyName: property.name,
          propertyAddress: property.address,
          propertyImage: property.images?.[0]?.url || "/placeholder.jpg",
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        }))
    );

    return NextResponse.json(customerReviews);
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
