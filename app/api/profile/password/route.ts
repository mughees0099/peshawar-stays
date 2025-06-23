import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/mailer";

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

    const subject = "Password Updated Successfully";
    const text = `Dear ${user.firstName},\n\nYour password has been updated successfully. If you did not make this change, please contact support immediately and change your password.\n\nBest regards,\nYour Team`;
    const html = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <head>
    <meta charset="UTF-8" />
    <title>Password Changed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #FFD700; padding: 30px;">
                <h1 style="margin: 0; color: #111;">Password Changed</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hello <strong>${user.firstName}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  We’re writing to confirm that the password for your account <strong>${
                    user.email
                  }</strong> was changed successfully.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you made this change, no further action is needed.
                </p>
                <p style="font-size: 16px; color: #e53935;">
                  If you did not change your password, please log in to your account immediately and update your password, or use the "Forgot Password" option to secure your account.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="https://peshawar-stays.vercel.app/login" style="background-color: #FFD700; color: #111; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                    Go to Login
                  </a>
                </div>
                <p style="font-size: 14px; color: #999;">
                  Stay safe and secure! <br />– The PeshawarStays Team
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

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
