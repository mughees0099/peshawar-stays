"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { generateOTP } from "@/lib/otp";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/currentUser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });
  const router = useRouter();
  const { user: currentUser, loading } = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = generateOTP();

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register/send-otp", {
        email,
        otp,
        subject: "Password Reset Request",
        text: `Your OTP for password reset is ${otp}`,
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Password Reset OTP</title>
            <style>
              body {
                background-color: #fef2f2;
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
                border-left: 6px solid #dc2626;
              }
        
              .header {
                text-align: center;
                margin-bottom: 24px;
              }
        
              .header h1 {
                font-size: 22px;
                color: #dc2626;
                margin: 0;
              }
        
              .content {
                font-size: 15px;
                color: #444444;
                line-height: 1.6;
              }
        
              .otp-box {
                background-color: #fff1f2;
                color: #b91c1c;
                padding: 16px;
                text-align: center;
                font-size: 28px;
                font-weight: bold;
                border-radius: 6px;
                margin: 24px 0;
                letter-spacing: 4px;
                border: 2px dashed #f87171;
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
                <h1>Password Reset OTP</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>
                  We received a request to reset your password. Please use the OTP code below to complete the process:
                </p>
                <div class="otp-box">${otp}</div>
                <p>This OTP is valid for <strong>15 minutes</strong>.</p>
                <p>
                  <strong>Didn't request this?</strong> You can safely ignore this email.
                </p>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Peshawar Stays. All rights reserved.
              </div>
            </div>
          </body>
        </html>`,
      });
      if (response.status === 200) {
        setIsSubmitted(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      toast.error(
        err.response.data.error || "Failed to send OTP. Please try again."
      );
      setIsLoading(false);
    }
    setOtp("");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register/verify-otp", {
        email,
        otp,
      });
      if (response.status === 200) {
        setIsOtpVerified(true);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      toast.error(
        err.response.data.error || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const validatePassword = (password: string) => {
    setPasswordStrength({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasMinLength: password.length >= 8,
    });

    return (
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) &&
      password.length >= 8
    );
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/login");
      }
    } catch (err) {
      toast.error(
        err.response.data.error || "Failed to reset password. Please try again."
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsOtpVerified(false);
      setIsSubmitted(false);
      setEmail("");
      setOtp("");
      setPassword("");
    }
    setPasswordStrength({
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
      hasMinLength: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  if (currentUser) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-luxury-cream
  to-white flex items-center justify-center p-4"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            You are already logged in!
          </h1>
          <Link href="/" className="text-lg text-luxury-gold hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-cream to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            PeshawarStays
          </Link>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        {!isOtpVerified &&
          (!isSubmitted ? (
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mx-auto mb-4 w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center"
                >
                  <Mail className="h-8 w-8 text-luxury-gold" />
                </motion.div>
                <CardTitle className="text-primary">Forgot Password?</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset
                  your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-primary hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center relative">
                <ArrowLeft
                  className="absolute left-4 top-4 h-5 w-5 text-primary cursor-pointer"
                  onClick={() => setIsSubmitted(false)}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mx-auto mb-4 w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-luxury-gold" />
                </motion.div>
                <CardTitle className="text-primary">Forgot Password?</CardTitle>
                <CardDescription>
                  We have sent an OTP to your email address. Please enter it
                  below to verify your identity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Enter OTP
                    </label>
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
                      className="w-full px-4 py-2 border rounded-md  mb-4"
                      placeholder="Enter 6-digit OTP"
                      required
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                      disabled={isLoading}
                      onClick={verifyOtp}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </motion.div>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 my-5"
                >
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          ))}
        {isOtpVerified && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mx-auto mb-4 w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <CardTitle className="text-primary">
                Create New Password
              </CardTitle>
              <CardDescription>
                Please enter a new password to reset your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      validatePassword(e.target.value);
                      setPassword(e.target.value);
                    }}
                    className="w-full px-4 py-2 border rounded-md mb-4"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium">Password must contain:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p
                      className={`text-xs ${
                        passwordStrength.hasUpperCase
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      ✓ Uppercase letter
                    </p>
                    <p
                      className={`text-xs ${
                        passwordStrength.hasLowerCase
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      ✓ Lowercase letter
                    </p>
                    <p
                      className={`text-xs ${
                        passwordStrength.hasNumber
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      ✓ Number
                    </p>
                    <p
                      className={`text-xs ${
                        passwordStrength.hasSymbol
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      ✓ Symbol
                    </p>
                    <p
                      className={`text-xs ${
                        passwordStrength.hasMinLength
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      ✓ 8+ characters
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                    disabled={isLoading}
                    onClick={resetPassword}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
