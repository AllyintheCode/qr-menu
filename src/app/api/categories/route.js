import { connectDB } from "../../../../lib/db.js";
import Category from "../../../../models/Category";

export async function GET() {
  await connectDB();

  try {
    const categories = await Category.find({}); // collection mövcud olmalıdır
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("DB Error:", err);
    return new Response(JSON.stringify({ error: "DB error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json(); // { name: "Yeni Kateqoriya" }
    const category = await Category.create({
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Category creation failed" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });

  const data = await req.json();
  if (!data.name)
    return new Response(JSON.stringify({ error: "Name required" }), {
      status: 400,
    });

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true }
    );
    return new Response(JSON.stringify(updatedCategory), { status: 200 });
  } catch (err) {
    console.error("PUT /api/categories error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });

  await Category.findByIdAndDelete(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
