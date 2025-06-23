import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import Admin from "@/models/admin";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "customer",
          as: "bookings",
        },
      },
      {
        $project: {
          _id: 1,
          type: { $literal: "customer" },
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          totalBookings: { $size: "$bookings" },
          createdAt: 1,
        },
      },
    ]);

    const hosts = await Host.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "owner",
          as: "properties",
        },
      },
      {
        $project: {
          _id: 1,
          type: { $literal: "host" },
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          totalProperties: { $size: "$properties" },
          createdAt: 1,
        },
      },
    ]);

    const allUsers = [...customers, ...hosts];

    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error("Error in user data API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
