import { connectDB } from "../../../../lib/db.js";
import Product from "../../../../models/Product.js";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

/* ================= GET ================= */
export async function GET() {
  await connectDB();
  const products = await Product.find({}).populate("category");

  return NextResponse.json(products);
}

/* ================= POST (ADD + IMAGE) ================= */
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const discountPrice = formData.get("discountPrice");
    const category = formData.get("category");
    const image = formData.get("image");

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Vacib sahələr boşdur" },
        { status: 400 }
      );
    }

    let imagePath = "";

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/${fileName}`;
    }

    await Product.create({
      name,
      price,
      description,
      discountPrice,
      category,
      image: imagePath,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

/* ================= PUT (EDIT + optional IMAGE) ================= */
export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID yoxdur" }, { status: 400 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const discountPrice = formData.get("discountPrice");
    const category = formData.get("category");
    const image = formData.get("image");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Məhsul tapılmadı" }, { status: 404 });
    }

    let imagePath = product.image;

    if (image && image.name) {
      // köhnə şəkli sil
      if (product.image) {
        const oldPath = path.join(process.cwd(), "public", product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${image.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/${fileName}`;
    }

    await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      discountPrice,
      category,
      image: imagePath,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
    }

    // şəkli sil
    if (product.image) {
      const imgPath = path.join(process.cwd(), "public", product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
