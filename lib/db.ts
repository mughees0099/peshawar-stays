import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectDB() {
  if (global.mongooseCache.conn) {
    console.log("Using existing MongoDB connection");
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    console.log("Creating new MongoDB connection");

    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
      });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}

export default connectDB;
