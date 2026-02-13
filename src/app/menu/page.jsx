"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

function Hero() {
  return (
    <section className="mb-6">
      <div className="rounded-3xl overflow-hidden p-4 bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center bg-white/10 rounded-lg">
            <svg
              viewBox="0 0 64 64"
              className="w-16 h-16"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <g>
                <ellipse cx="32" cy="36" rx="18" ry="10" fill="#F59E0B" />
                <path
                  d="M12 36c0-6.627 8.954-12 20-12s20 5.373 20 12"
                  fill="#F97316"
                />
                <rect
                  x="22"
                  y="18"
                  width="20"
                  height="6"
                  rx="3"
                  fill="#FFD580"
                />
                <path
                  d="M52 30c3 0 6-2 8-4s0-6-4-6h-4"
                  stroke="#92400E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 30c-3 0-6-2-8-4s0-6 4-6h4"
                  stroke="#92400E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              <g fill="#fff" opacity="0.9">
                <ellipse cx="26" cy="12" rx="2" ry="4">
                  <animate
                    attributeName="cy"
                    dur="2s"
                    values="14;8;14"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur="2s"
                    values="0;0.85;0"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse cx="32" cy="9" rx="1.6" ry="3">
                  <animate
                    attributeName="cy"
                    dur="2.2s"
                    values="12;6;12"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur="2.2s"
                    values="0;0.75;0"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse cx="36" cy="13" rx="1.8" ry="3.6">
                  <animate
                    attributeName="cy"
                    dur="2.4s"
                    values="15;9;15"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur="2.4s"
                    values="0;0.8;0"
                    repeatCount="indefinite"
                  />
                </ellipse>
              </g>

              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0;0 -6;0 0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </g>
            </svg>
          </div>

          <div className="text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Xilə Çay Evi
            </h2>
            <p className="mt-1 text-sm opacity-90">
              İsti çay, gözəl atmosfer və maraqlı dadlar — gəlib sınayın!
            </p>
          </div>

          <div className="ml-auto">
            <button className="bg-white text-amber-600 px-4 py-2 rounded-full font-semibold shadow">
              Sifariş et
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);
      setCategories(await catRes.json());
      setProducts(await prodRes.json());
    };
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category?._id === selectedCategory;
    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 max-w-7xl mx-auto">
        <Hero />
        <h1 className="text-2xl font-bold mb-4">Menyu</h1>

        {/* SEARCH */}
        <div className="relative mb-5">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Məhsul axtar..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          <CategoryBtn
            active={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          >
            Hamısı
          </CategoryBtn>

          {categories.map((c) => (
            <CategoryBtn
              key={c._id}
              active={selectedCategory === c._id}
              onClick={() => setSelectedCategory(c._id)}
            >
              {c.name}
            </CategoryBtn>
          ))}
        </div>

        {/* PRODUCTS */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Məhsul tapılmadı</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                onClick={() => setActiveProduct(p)}
                className="bg-white/5 rounded-3xl shadow-xl hover:shadow-2xl border border-white/10 cursor-pointer overflow-hidden transition-all duration-300 lg:hover:scale-105 lg:hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-white/5">
                  <img
                    src={p.image || "/placeholder-food.jpg"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.discountPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      ENDİRİM
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base text-white mb-2 line-clamp-2">
                    {p.name}
                  </h3>

                  <div className="mt-2">
                    {p.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm line-through text-gray-400">
                          {p.price}₼
                        </span>
                        <span className="text-lg text-green-400 font-bold">
                          {p.discountPrice}₼
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {p.price}₼
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT MODAL */}
        {activeProduct && (
          <ProductModal
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

/* CATEGORY BUTTON */
function CategoryBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border
        ${
          active
            ? "bg-white text-black border-white"
            : "bg-white/10 text-gray-200 border-white/10 hover:bg-white/15"
        }`}
    >
      {children}
    </button>
  );
}

/* PRODUCT DETAIL MODAL */
function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-black/90 text-white rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl border border-white/10 transform animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/15 rounded-full p-2 transition-all duration-200 z-10"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="relative">
          <div className="aspect-[4/3] bg-white/5">
            <img
              src={product.image || "/placeholder-food.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.discountPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ENDİRİM
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">{product.name}</h2>

          <div className="mb-4">
            {product.discountPrice ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl line-through text-gray-400">
                  {product.price}₼
                </span>
                <span className="text-3xl text-green-400 font-bold">
                  {product.discountPrice}₼
                </span>
                <div className="bg-green-500/15 text-green-300 px-2 py-1 rounded-lg text-sm font-semibold border border-green-500/20">
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) *
                      100,
                  )}
                  % endirim
                </div>
              </div>
            ) : (
              <span className="text-3xl font-bold">{product.price}₼</span>
            )}
          </div>

          {product.description && (
            <div className="mb-2">
              <h3 className="font-semibold text-gray-200 mb-2">Tərkib:</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
