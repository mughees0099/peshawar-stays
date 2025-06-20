import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import bcrypt from "bcrypt";

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

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      favoriteProperties,
      remove,
      password,
    } = body;

    if (!firstName && !lastName && !email && !phone && !password) {
      return NextResponse.json(
        { error: "At least one field is required" },
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

    const { email: userEmail } = decoded;
    let customer = null;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!email) {
        return NextResponse.json(
          { error: "Email is required to update password" },
          { status: 400 }
        );
      }
      await Customer.findOneAndUpdate(
        { email: userEmail },
        { $set: { password: hashedPassword } },
        { new: true, runValidators: true }
      ).lean();
      await Host.findOneAndUpdate(
        { email: userEmail },
        { $set: { password: hashedPassword } },
        { new: true, runValidators: true }
      ).lean();

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    }

    if (favoriteProperties) {
      const updateOperation = remove
        ? {
            $set: { firstName, lastName, email, phone },
            $pull: { favoriteProperties: favoriteProperties },
          }
        : {
            $set: { firstName, lastName, email, phone },
            $addToSet: {
              favoriteProperties: {
                $each: Array.isArray(favoriteProperties)
                  ? favoriteProperties
                  : [favoriteProperties],
              },
            },
          };

      customer = await Customer.findOneAndUpdate(
        { email: userEmail },
        updateOperation,
        { new: true, runValidators: true }
      ).lean();
    } else {
      customer = await Customer.findOneAndUpdate(
        { email: userEmail },
        { $set: { firstName, lastName, email, phone } },
        { new: true, runValidators: true }
      ).lean();
    }

    const host = await Host.findOneAndUpdate(
      { email: userEmail },
      { firstName, lastName, email, phone },
      { new: true, runValidators: true }
    ).lean();

    if (!customer && !host) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (customer) delete customer.password;
    if (host) delete host.password;

    return NextResponse.json(customer || host);
  } catch (error) {
    console.log("PATCH Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
