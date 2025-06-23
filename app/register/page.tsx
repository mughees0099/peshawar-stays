"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { generateOTP } from "@/lib/otp";
import { text } from "stream/consumers";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"customer" | "host">("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";

  useEffect(() => {
    if (role === "host") {
      setUserType("host");
    } else {
      setUserType("customer");
    }
  }, [role]);

  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });

  // Password validation function
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

  const validateForm = (formData: FormData, formType: "customer" | "host") => {
    const newErrors: Record<string, string> = {};

    const fields =
      formType === "customer"
        ? [
            "first_name",
            "last_name",
            "email",
            "phone",
            "password",
            "confirm_password",
          ]
        : [
            "first_name",
            "last_name",
            "email",
            "phone",
            "password",
            "confirm_password",
          ];

    const specialFields =
      formType === "host"
        ? ["property_name", "property-type", "property-address"]
        : [];

    fields.forEach((field) => {
      const prefix = formType === "customer" ? "customer_" : "host_";
      const fieldName = prefix + field;
      const value = formData.get(fieldName);

      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[fieldName] = "This field is required";
      }
    });

    const genderField =
      formType === "customer" ? "customer_gender" : "host_gender";
    const genderValue = formData.get(genderField);
    if (
      !genderValue ||
      (typeof genderValue === "string" && genderValue.trim() === "")
    ) {
      newErrors[genderField] = "Please select your gender";
    }

    specialFields.forEach((field) => {
      const value = formData.get(field);

      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[field] = "This field is required";
      }
    });

    const emailField =
      formType === "customer" ? "customer_email" : "host_email";
    const email = formData.get(emailField) as string;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors[emailField] = "Please enter a valid email address";
    }

    const phoneField =
      formType === "customer" ? "customer_phone" : "host_phone";
    const phone = formData.get(phoneField) as string;
    if (phone && !/^\d{10,}$/.test(phone)) {
      newErrors[phoneField] =
        "Please enter a valid phone number (at least 10 digits)";
    }

    const passwordField =
      formType === "customer" ? "customer_password" : "host_password";
    const confirmPasswordField =
      formType === "customer"
        ? "customer_confirm_password"
        : "host_confirm_password";
    const password = formData.get(passwordField) as string;
    const confirmPassword = formData.get(confirmPasswordField) as string;

    if (password && !validatePassword(password)) {
      newErrors[passwordField] = "Password doesn't meet security requirements";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors[confirmPasswordField] = "Passwords do not match";
    }

    const termsField =
      formType === "customer" ? "customer_terms" : "host_terms";
    if (!formData.get(termsField)) {
      newErrors[termsField] = "You must agree to the terms";
    }

    return newErrors;
  };

  async function HandleCustomerRegistration(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData(e.target as HTMLFormElement);

    const validationErrors = validateForm(formData, "customer");

    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation failed with errors:", validationErrors);
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      const firstName = formData.get("customer_first_name") as string;
      const lastName = formData.get("customer_last_name") as string;
      const email = formData.get("customer_email") as string;
      const gender = formData.get("customer_gender") as string;
      const phone = formData.get("customer_phone") as string;
      const password = formData.get("customer_password") as string;

      const response = await axios.post("/api/auth/register", {
        firstName:
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        email,
        gender,
        phone,
        password,
        userType: "customer",
      });

      if (response.status == 201) {
        const otp = generateOTP();
        const sentOtp = await axios.post("/api/auth/register/send-otp", {
          email: response.data.email,
          otp,
          subject: "Account Verification",
          text: `Hello ${firstName},\n\nYour OTP for account verification is: ${otp}\n\nThank you!`,
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
                  <p>Hello ${
                    firstName.charAt(0).toUpperCase() +
                    firstName.slice(1).toLowerCase()
                  }</p>
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

        if (sentOtp.status === 200) {
          toast.success("OTP sent to your email. Please verify your account.");
          router.push(
            `/register/${response.data.id}?email=${encodeURIComponent(
              response.data.email
            )}`
          );
        }
      }
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.log("Registration error:", err.message);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setSubmitError(
            "An account with this email already exists. Please use a different email or try logging in."
          );
        } else if (err.response?.data?.error) {
          setSubmitError(err.response.data.error);
        } else {
          setSubmitError("Registration failed. Please try again.");
        }
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function HandleHostRegistration(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData(e.target as HTMLFormElement);

    const validationErrors = validateForm(formData, "host");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      const firstName = formData.get("host_first_name") as string;
      const lastName = formData.get("host_last_name") as string;
      const gender = formData.get("host_gender") as string;
      const email = formData.get("host_email") as string;
      const phone = formData.get("host_phone") as string;
      const propertyName = formData.get("property_name") as string;
      const propertyType = formData.get("property-type") as string;
      const propertyAddress = formData.get("property-address") as string;
      const password = formData.get("host_password") as string;

      const response = await axios.post("/api/auth/register", {
        firstName:
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        email,
        gender,
        phone,
        propertyName,
        propertyType,
        propertyAddress,
        password,
        userType: "host",
      });

      if (response.status == 201) {
        const otp = generateOTP();
        const sentOtp = await axios.post("/api/auth/register/send-otp", {
          email: response.data.email,
          otp,
          subject: "Account Verification",
          text: `Hello ${firstName},\n\nYour OTP for account verification is: ${otp}\n\nThank you!`,
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
                  <p>Hello ${
                    firstName.charAt(0).toUpperCase() +
                    firstName.slice(1).toLowerCase()
                  }</p>
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

        if (sentOtp.status === 200) {
          toast.success("OTP sent to your email. Please verify your account.");
          router.push(
            `/register/${response.data.id}?email=${encodeURIComponent(
              response.data.email
            )}`
          );
        }
      }

      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.log("Registration error:", err.message);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setSubmitError(
            "An account with this email already exists. Please use a different email or try logging in."
          );
        } else if (err.response?.data?.error) {
          setSubmitError(err.response.data.error);
        } else {
          setSubmitError("Registration failed. Please try again.");
        }
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  };

  const handlePropertyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(" ")) {
      e.target.value = value;
    } else if (value.includes(" ")) {
      e.target.value = toTitleCase(value);
    } else if (value.length === 1) {
      e.target.value = value.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            PeshawarStays
          </Link>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Join PeshawarStays as{" "}
              {role == "host" ? "a host" : "a customer or become a host"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
                {submitSuccess}
              </div>
            )}

            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as any)}
              className="w-full"
            >
              <TabsList className={`grid w-full grid-cols-1`}>
                {role === "host" ? (
                  <TabsTrigger value="host" className="w-full">
                    Host Registration
                  </TabsTrigger>
                ) : (
                  <>
                    <TabsTrigger value="customer" className="w-full">
                      Registration
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              <form onSubmit={HandleCustomerRegistration}>
                <TabsContent value="customer" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_first_name">First Name</Label>
                      <Input
                        id="customer_first_name"
                        name="customer_first_name"
                        placeholder="Enter your first name"
                        className={
                          errors.customer_first_name ? "border-red-500" : ""
                        }
                      />
                      {errors.customer_first_name && (
                        <p className="text-xs text-red-500">
                          {errors.customer_first_name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_last_name">Last Name</Label>
                      <Input
                        id="customer_last_name"
                        name="customer_last_name"
                        placeholder="Enter your last name"
                        className={
                          errors.customer_last_name ? "border-red-500" : ""
                        }
                      />
                      {errors.customer_last_name && (
                        <p className="text-xs text-red-500">
                          {errors.customer_last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_gender">Gender</Label>
                    <Select name="customer_gender">
                      <SelectTrigger
                        className={
                          errors["customer_gender"] ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors["customer_gender"] && (
                      <p className="text-xs text-red-500">
                        {errors["customer_gender"]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      placeholder="Enter your email"
                      className={errors.customer_email ? "border-red-500" : ""}
                    />
                    {errors.customer_email && (
                      <p className="text-xs text-red-500">
                        {errors.customer_email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone Number</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      placeholder="Enter your phone number"
                      className={errors.customer_phone ? "border-red-500" : ""}
                    />
                    {errors.customer_phone && (
                      <p className="text-xs text-red-500">
                        {errors.customer_phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_password">Password</Label>
                    <Input
                      id="customer_password"
                      name="customer_password"
                      type="password"
                      placeholder="Create a password"
                      className={
                        errors.customer_password ? "border-red-500" : ""
                      }
                      onChange={(e) => validatePassword(e.target.value)}
                    />
                    {errors.customer_password && (
                      <p className="text-xs text-red-500">
                        {errors.customer_password}
                      </p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">
                        Password must contain:
                      </p>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_confirm_password">
                      Confirm Password
                    </Label>
                    <Input
                      id="customer_confirm_password"
                      name="customer_confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      className={
                        errors.customer_confirm_password ? "border-red-500" : ""
                      }
                    />
                    {errors.customer_confirm_password && (
                      <p className="text-xs text-red-500">
                        {errors.customer_confirm_password}
                      </p>
                    )}
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="customer_terms"
                      name="customer_terms"
                      className={errors.customer_terms ? "border-red-500" : ""}
                    />
                    <div>
                      <Label htmlFor="customer_terms" className="text-sm">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                      {errors.customer_terms && (
                        <p className="text-xs text-red-500">
                          {errors.customer_terms}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Creating Account..."
                      : "Create Customer Account"}
                  </Button>
                </TabsContent>
              </form>
              <form onSubmit={HandleHostRegistration}>
                <TabsContent value="host" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host_first_name">First Name</Label>
                      <Input
                        id="host_first_name"
                        name="host_first_name"
                        placeholder="Enter your first name"
                        className={
                          errors.host_first_name ? "border-red-500" : ""
                        }
                      />
                      {errors.host_first_name && (
                        <p className="text-xs text-red-500">
                          {errors.host_first_name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="host_last_name">Last Name</Label>
                      <Input
                        id="host_last_name"
                        name="host_last_name"
                        placeholder="Enter your last name"
                        className={
                          errors.host_last_name ? "border-red-500" : ""
                        }
                      />
                      {errors.host_last_name && (
                        <p className="text-xs text-red-500">
                          {errors.host_last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host_gender">Gender</Label>
                    <Select name="host_gender">
                      <SelectTrigger
                        className={
                          errors["host_gender"] ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors["host_gender"] && (
                      <p className="text-xs text-red-500">
                        {errors["host_gender"]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host_email">Email</Label>
                    <Input
                      id="host_email"
                      name="host_email"
                      type="email"
                      placeholder="Enter your email"
                      className={errors.host_email ? "border-red-500" : ""}
                    />
                    {errors.host_email && (
                      <p className="text-xs text-red-500">
                        {errors.host_email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host_phone">Phone Number</Label>
                    <Input
                      id="host_phone"
                      name="host_phone"
                      placeholder="Enter your phone number"
                      className={errors.host_phone ? "border-red-500" : ""}
                    />
                    {errors.host_phone && (
                      <p className="text-xs text-red-500">
                        {errors.host_phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property_name">Property Name</Label>
                    <Input
                      id="property_name"
                      name="property_name"
                      placeholder="Enter your hotel/guest house name"
                      className={errors.property_name ? "border-red-500" : ""}
                      onChange={handlePropertyNameChange}
                    />
                    {errors.property_name && (
                      <p className="text-xs text-red-500">
                        {errors.property_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select name="property-type">
                      <SelectTrigger
                        className={
                          errors["property-type"] ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="guest-house">Guest House</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors["property-type"] && (
                      <p className="text-xs text-red-500">
                        {errors["property-type"]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-address">Property Address</Label>
                    <Textarea
                      id="property-address"
                      name="property-address"
                      placeholder="Enter complete address of your property"
                      rows={3}
                      className={
                        errors["property-address"] ? "border-red-500" : ""
                      }
                    />
                    {errors["property-address"] && (
                      <p className="text-xs text-red-500">
                        {errors["property-address"]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host_password">Password</Label>
                    <Input
                      id="host_password"
                      name="host_password"
                      type="password"
                      placeholder="Create a password"
                      className={errors.host_password ? "border-red-500" : ""}
                      onChange={(e) => validatePassword(e.target.value)}
                    />
                    {errors.host_password && (
                      <p className="text-xs text-red-500">
                        {errors.host_password}
                      </p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">
                        Password must contain:
                      </p>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host_confirm_password">
                      Confirm Password
                    </Label>
                    <Input
                      id="host_confirm_password"
                      name="host_confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      className={
                        errors.host_confirm_password ? "border-red-500" : ""
                      }
                    />
                    {errors.host_confirm_password && (
                      <p className="text-xs text-red-500">
                        {errors.host_confirm_password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="host_terms"
                      name="host_terms"
                      className={errors.host_terms ? "border-red-500" : ""}
                    />
                    <div>
                      <Label htmlFor="host_terms" className="text-sm">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        , and{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Host Agreement
                        </Link>
                      </Label>
                      {errors.host_terms && (
                        <p className="text-xs text-red-500">
                          {errors.host_terms}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your property listing will be
                      reviewed by our admin team before going live. You'll
                      receive an email notification once approved.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-primary font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Creating Account..."
                      : "Create Host Account"}
                  </Button>
                </TabsContent>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
