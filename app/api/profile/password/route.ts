import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old and new passwords are required" },
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

    const customer = await Customer.findOne({ email });
    const host = await Host.findOne({ email });

    if (!customer && !host) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = customer || host;

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
