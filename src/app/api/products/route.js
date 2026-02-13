import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/Product";

/* ================= HELPER ================= */
function toDataUri(file, buffer) {
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

/* ================= GET ================= */
export async function GET() {
  await connectDB();
  const products = await Product.find({}).populate("category");
  return NextResponse.json(products);
}

/* ================= POST ================= */
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
        { status: 400 },
      );
    }

    let imagePath = "";
    let publicId = "";

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await cloudinary.uploader.upload(
        toDataUri(image, buffer),
        {
          folder: "qrmenu/products",
        },
      );

      imagePath = uploadRes.secure_url;
      publicId = uploadRes.public_id;
    }

    await Product.create({
      name,
      price,
      description,
      discountPrice,
      category,
      image: imagePath,
      imagePublicId: publicId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

/* ================= PUT ================= */
export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID yoxdur" }, { status: 400 });

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const discountPrice = formData.get("discountPrice");
    const category = formData.get("category");
    const image = formData.get("image");

    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });

    let imagePath = product.image;
    let publicId = product.imagePublicId;

    if (image && image.name) {
      // köhnə şəkli sil
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await cloudinary.uploader.upload(
        toDataUri(image, buffer),
        {
          folder: "qrmenu/products",
        },
      );

      imagePath = uploadRes.secure_url;
      publicId = uploadRes.public_id;
    }

    await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      discountPrice,
      category,
      image: imagePath,
      imagePublicId: publicId,
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
    if (!product)
      return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
