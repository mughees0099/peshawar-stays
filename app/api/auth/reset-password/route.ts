import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/customer";
import Host from "@/models/host";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user =
      (await Customer.findOne({ email })) || (await Host.findOne({ email }));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.password = hashedPassword;

    await user.save();
    const subject = "Your Password Has Been Reset";
    const text = `Hello ${user.firstName},\n\nYour password has been successfully updated.`;
    const html = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset Successful</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #FFD700; padding: 30px;">
                <h2 style="margin: 0; color: #111;">Password Reset Successful</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hello <strong>${user.firstName}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  We've successfully updated your password.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you didn’t request this change, please contact our support team immediately, or reset your password again to secure your account.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="https://peshawar-stays.vercel.app/login" style="background-color: #FFD700; color: #111; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                    Login to Your Account
                  </a>
                </div>
                <p style="font-size: 14px; color: #999;">
                  Stay safe,<br />– The PeshawarStays Team
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

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
