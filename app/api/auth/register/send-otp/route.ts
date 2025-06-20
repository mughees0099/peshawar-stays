import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import { sendEmail } from "@/lib/mailer";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp, subject, text, html } = await req.json();

    const user =
      (await Customer.findOne({ email })) || (await Host.findOne({ email }));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.otp = otp;
    user.otpExpires = otpExpiresAt;
    await user.save();

    await sendEmail(
      user.email,
      subject || "Your OTP Code",
      text || `Your new OTP is ${otp}`,
      html || `<p>Your new OTP is <strong>${otp}</strong></p>`
    );

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}
