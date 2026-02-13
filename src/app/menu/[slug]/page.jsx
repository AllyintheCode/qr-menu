import MenuCard from "../../../../components/MenuCard";
import { connectDB } from "../../../../lib/db";
import Category from "../../../../models/Category";
import Product from "../../../../models/Product";

// Bu fayl server componentdir
export default async function CategoryPage({ params }) {
  // server component-də params birbaşa destructure edilə bilər
  const { slug } = await params;

  // DB-ə qoşul
  await connectDB();

  // Category tap
  const category = await Category.findOne({ slug });
  let products = [];
  if (category) {
    products = await Product.find({ category: category._id });
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 capitalize">{slug}</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Bu kateqoriyada heç bir məhsul yoxdur</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <MenuCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
