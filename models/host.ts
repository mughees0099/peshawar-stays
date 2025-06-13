import mongoose from "mongoose";

// Define the Host schema
const hostSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    propertyName: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["hotel", "guest-house", "resort", "apartment"],
    },
    propertyAddress: {
      type: String,
      required: [true, "Property address is required"],
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting during hot reloads
const Host = mongoose.models.Host || mongoose.model("Host", hostSchema);

export default Host;
