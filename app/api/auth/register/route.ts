import connectDB from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import Customer from "@/models/customer";
import Host from "@/models/host";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      password,
      userType,
      propertyName,
      propertyType,
      propertyAddress,
    } = body;
    console.log(
      firstName,
      lastName,
      email,
      phone,
      gender,
      password,
      userType,
      propertyName,
      propertyType,
      propertyAddress
    );

    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingCustomer = await Customer.findOne({ email }).lean();
    const existingHost = await Host.findOne({ email }).lean();

    if (existingCustomer || existingHost) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    if (userType === "host") {
      if (!propertyName || !propertyType || !propertyAddress) {
        return NextResponse.json(
          { error: "Property details are required for hosts" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      const newHost = new Host({
        firstName,
        lastName,
        email,
        phone,
        gender,
        password: hashedPassword,
        propertyName,
        propertyType,
        propertyAddress,
        role: "host",
      });

      await newHost.save();
      return NextResponse.json(
        {
          message:
            "Host registration successful. Your account is pending approval.",
        },
        { status: 201 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        phone,
        gender,
        password: hashedPassword,
        role: "customer",
      });
      await newCustomer.save();
      return NextResponse.json(
        { message: "Customer registration successful" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("Error in registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
