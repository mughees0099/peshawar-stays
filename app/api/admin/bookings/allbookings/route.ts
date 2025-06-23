import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/Bookings";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Admin from "@/models/admin";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    let token = req.headers.get("token");

    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token required" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const admin = await Admin.findOne({ email: decoded.email }).lean();
    if (!admin) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    const bookings = await Booking.find()
      .populate("property", "-__v")
      .populate("owner", "-__v -password")
      .populate("customer", "-__v -password")
      .lean();

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { message: "No bookings found" },
        { status: 404 }
      );
    }
    console.log(bookings);

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
