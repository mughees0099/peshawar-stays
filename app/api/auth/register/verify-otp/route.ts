import Host from "@/models/host";
import Customer from "@/models/customer";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp } = body;

    const referer = req.headers.get("referer");

    const isForgotPasswordFlow = referer?.includes("/forgot-password");

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const customer = await Customer.findOne({ email });
    const host = await Host.findOne({ email });

    const user = customer || host;

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    if (!isForgotPasswordFlow) {
      if (user.isVerified) {
        return NextResponse.json(
          { error: "User is already verified" },
          { status: 400 }
        );
      }
      user.isVerified = true;
    }

    if (user.otpExpires && new Date(user.otpExpires) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    user.isVerified = true;

    await user.updateOne({
      $unset: {
        otp: "",
        otpExpires: "",
      },
    });

    await user.save();
    if (!isForgotPasswordFlow) {
      // If not in forgot password flow, send a welcome email
      const subject = "Welcome to Our Service!";
      const text = `Hello ${
        user.firstName || user.email
      },\n\nYour account has been successfully verified. Welcome aboard!`;
      const html = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #FFD700; padding: 30px;">
                <h1 style="margin: 0; color: #111;">Welcome to PeshawarStays</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hello <strong>${user.firstName}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  Your account has been successfully verified. 🎉
                </p>
                <p style="font-size: 16px; color: #333;">
                  We're thrilled to have you on board! You can now log in and start exploring unique properties, make bookings, and connect with amazing hosts across Peshawar.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you ever need help, just reply to this email. We're always here to assist.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="https://peshawarstays.com/login" style="background-color: #FFD700; color: #111; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                    Login Now
                  </a>
                </div>
                <p style="font-size: 14px; color: #999;">
                  Thanks again for joining us! <br />– The PeshawarStays Team
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} PeshawarStays. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
      await sendEmail(user.email, subject, text, html);
    }

    return NextResponse.json(
      { message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
