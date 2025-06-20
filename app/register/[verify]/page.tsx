"use client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { generateOTP } from "@/lib/otp";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchparams = useSearchParams();
  const email = searchparams.get("email");
  if (!email) {
    router.push("/register");
  }

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register/verify-otp", {
        email,
        otp,
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    try {
      const otp = generateOTP();
      if (!otp) {
        toast.error("Failed to generate OTP. Please try again.");
        return;
      }

      const response = await axios.post("/api/auth/register/send-otp", {
        email,
        otp,
        subject: "Your OTP Code",
        text: `Your new OTP is ${otp}`,
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        background-color: #f4f4f7;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 480px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
      }

      .header h1 {
        font-size: 24px;
        color: #333333;
        margin: 0;
      }

      .content {
        font-size: 16px;
        color: #555555;
        line-height: 1.6;
      }

      .otp-box {
        background-color: #f0f9ff;
        color: #007bff;
        padding: 16px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        border-radius: 6px;
        margin: 24px 0;
        letter-spacing: 4px;
      }

      .footer {
        font-size: 13px;
        text-align: center;
        color: #999999;
        margin-top: 32px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Resend OTP Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>
          You recently requested a new OTP code. Please use the code below to
          complete your account verification or continue with your login
          process:
        </p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for <strong>15 minutes</strong>.</p>
        <p>
          If you didn’t request this OTP, please ignore this email or contact
          our support.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Peshawar Stays. All rights reserved.
      </div>
    </div>
  </body>
</html>

          `,
      });
      if (response.status === 200) {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Account Verification
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please enter the OTP sent to your email: <strong>{email}</strong>
        </p>
        <div className="space-y-4">
          <form className="" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setOtp(value);
                  }
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 mb-4"
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleVerify}
              className={`w-full py-3 px-4 rounded-md text-white flex justify-center
               ${
                 loading === true
                   ? "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
                   : "bg-green-500 text-white hover:bg-green-600"
               }  
              ${
                otp.length > 5
                  ? "bg-green-500  hover:bg-green-600 cursor-pointer"
                  : " bg-gray-500  hover:bg-gray-600 cursor-not-allowed"
              }
              `}
              disabled={otp.length <= 5}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
              ) : otp.length <= 5 ? (
                <span className="text-sm">Enter OTP</span>
              ) : (
                otp.length > 5 &&
                loading === false && <span className="text-sm">Verify OTP</span>
              )}
            </button>
          </form>
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>
              Didn't receive the OTP?{" "}
              <button
                onClick={resend}
                className="text-blue-500 hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
