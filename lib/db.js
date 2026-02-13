import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;

  if (!uri || !uri.startsWith("mongodb")) {
    throw new Error(
      "MONGO_URI düzgün deyil (mongodb:// və ya mongodb+srv:// ilə başlamalıdır)",
    );
  }

  await mongoose.connect(uri, { dbName: "qrmenu" });
  isConnected = true;
  console.log("MongoDB connected");
};
