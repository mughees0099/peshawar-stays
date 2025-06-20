import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Property address is required"],
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price must be a positive number"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, trim: true },
      },
    ],
    amenities: {
      type: [String],
      required: [true, "Amenities are required"],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: "At least one amenity is required",
      },
    },

    reviews: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
          required: true,
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating must be at most 5"],
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    roomDetails: [
      {
        type: {
          type: String,
          required: true,
          enum: ["standard", "deluxe", "executive", "presidential"],
        },
        totalRooms: {
          type: Number,
          required: true,
          min: [0, "At least 1 room is required per type"],
        },
        availableRooms: {
          type: Number,
          required: true,
          min: [0, "Available rooms cannot be negative"],
        },
        pricePerNight: {
          type: Number,
          required: true,
          min: [0, "Price must be a positive number"],
        },
        amenities: {
          type: [String],
          default: [],
        },
        customerCapacity: {
          type: Number,
          required: true,
          min: [1, "At least 1 person must be accommodated"],
        },
        images: [
          {
            url: { type: String },
            altText: { type: String },
          },
        ],
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
export default Property;
