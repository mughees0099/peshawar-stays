import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/property";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Admin from "@/models/admin";
import Booking from "@/models/Bookings";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    let token = req.headers.get("token");

    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is required" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { email } = decoded;
    const admin = await Admin.findOne({ email }).lean();
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const properties = await Property.find()
      .lean()
      .populate("owner", "firstName lastName email phone");

    if (!properties || properties.length === 0) {
      return NextResponse.json(
        { message: "No properties found" },
        { status: 404 }
      );
    }

    const revenues = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: "$property",
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const revenueMap = new Map();
    revenues.forEach((item) => {
      revenueMap.set(item._id.toString(), item.totalRevenue);
    });

    const enrichedProperties = properties.map((property) => ({
      ...property,
      totalRevenue: revenueMap.get(property._id.toString()) || 0,
    }));

    return NextResponse.json(
      { properties: enrichedProperties },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching properties with revenue:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, isApproved } = await req.json();
    console.log("Received data:", { id, isApproved });
    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id).lean();
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, {
      isApproved,
    }).lean();

    return NextResponse.json({ property: updatedProperty }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
