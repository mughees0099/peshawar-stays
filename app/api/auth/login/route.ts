import Host from "@/models/host";
import bcrypt from "bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let customer, host;
    try {
      [customer, host] = await Promise.all([
        Customer.findOne({ email }).lean(),
        Host.findOne({ email }).lean(),
      ]);
    } catch (dbError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    const user: any = customer || host;

    if (!user) {
      return NextResponse.json(
        { error: "No user found with email" },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 500 }
      );
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      return NextResponse.json(
        { error: "Password verification error" },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userType = user.userType || (customer ? "customer" : "host");

    let token;
    try {
      token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          userType: userType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: rememberMe ? "7d" : "1h",
        }
      );
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 }
      );
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
      path: "/",
    };

    const responseData = {
      success: true,
      token,
      userType,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || user.firstName || "User",
      },
    };

    const response = NextResponse.json(responseData);

    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Error stack:", error.stack);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
