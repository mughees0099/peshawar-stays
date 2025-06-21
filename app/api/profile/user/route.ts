import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { firstName, lastName, phone, imageUrl, gender } = await req.json();
    if (!firstName || !lastName || !phone || !gender) {
      return NextResponse.json(
        { error: "First name, last name, and phone are required" },
        { status: 400 }
      );
    }
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
      customer.firstName = firstName;
      customer.lastName = lastName;
      customer.phone = phone;
      customer.gender = gender;
      if (imageUrl) {
        customer.imageUrl = imageUrl;
      }
      await Customer.updateOne({ email }, customer);
      return NextResponse.json(
        { message: "Customer profile updated successfully" },
        { status: 200 }
      );
    }
    if (host) {
      host.firstName = firstName;
      host.lastName = lastName;
      host.phone = phone;
      host.gender = gender;
      if (imageUrl) {
        host.imageUrl = imageUrl;
      }
      await Host.updateOne({ email }, host);
      return NextResponse.json(
        { message: "Host profile updated successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
