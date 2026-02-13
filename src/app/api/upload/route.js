import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const res = await cloudinary.uploader.upload(
    `data:${file.type};base64,${base64}`,
    { folder: "menu" }
  );

  return NextResponse.json({ url: res.secure_url });
}
