"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import cookies from "js-cookie";
import { toast } from "react-toastify";
import { generateOTP } from "@/lib/otp";
import { se } from "date-fns/locale";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberedEmail, setRememberedEmail] = useState("");
  const router = useRouter();

  const validateForm = (email: string, password: string) => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setLoginError(null);

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const rememberMe = form.remember?.checked || false;

    const validationErrors = validateForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      const { token, userType } = response.data;
      if (rememberMe) {
        cookies.set("token", token, {
          expires: rememberMe ? 7 : 1,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      if (userType === "customer") {
        toast.success("Login successful! Redirecting to customer dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard/customer";
        }, 2000);
      } else if (userType === "host") {
        toast.success("Login successful! Redirecting to host dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard/host";
        }, 2000);
      } else if (userType === "admin") {
        toast.success("Login successful! Redirecting to admin dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard/admin";
        }, 2000);
      } else {
        setLoginError("Unknown user type. Please contact support.");
      }

      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error: any) {
      console.log("Login error:", error);
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
      if (
        error.response.data.error ===
        "Account verification required. Please check your email for the OTP or register again."
      ) {
        const otp = generateOTP();
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
                  <h1>Email Verification</h1>
                </div>
                <div class="content">
                  <p>Hello, </p>
                  <p>
                    Thank you for creating an account with us. To complete your
                    registration, please use the OTP code below:
                  </p>
                  <div class="otp-box">${otp}</div>
                  <p>This OTP is valid for <strong>15 minutes</strong>.</p>
                  <p>If you didn’t request this, please ignore this email.</p>
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
          toast.success("OTP sent to your email. Please verify to continue.");
          router.push(
            `/register/${encodeURIComponent(email)}?email=${encodeURIComponent(
              email
            )}`
          );
        }
        // Redirect to register page with email
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("rememberedEmail");
      if (storedEmail) {
        setRememberedEmail(storedEmail);
        // Set the remember checkbox to checked
        const rememberCheckbox = document.getElementById(
          "remember"
        ) as HTMLInputElement;
        if (rememberCheckbox) {
          rememberCheckbox.checked = true;
        }
      }
    }
  }, []);

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
          <p className="text-muted-foreground mt-2">Welcome back</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Sign In</CardTitle>
            <br />
            <CardDescription>
              Sign in to your account to continue exploring luxury stays in
              Peshawar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                  defaultValue={rememberedEmail}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-2"
              >
                <Checkbox id="remember" name="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
