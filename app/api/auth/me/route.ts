import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";

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

    const customer = await Customer.findOne({ email }).lean();
    const host = await Host.findOne({ email }).lean();

    if (!customer && !host) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (customer) {
      delete customer.password;
    }
    if (host) {
      delete host.password;
    }
    return NextResponse.json(customer || host);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
