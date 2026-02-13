"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Pencil,
  Package,
  Save,
  X,
  ImageIcon,
} from "lucide-react";
import DeleteModal from "../../../../../components/DeleteModal";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  image: null,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);

      if (!pRes.ok || !cRes.ok) throw new Error("Load failed");

      const [p, c] = await Promise.all([pRes.json(), cRes.json()]);

      setProducts(Array.isArray(p) ? p.filter((prod) => prod && prod._id) : []);
      setCategories(Array.isArray(c) ? c.filter((cat) => cat && cat._id) : []);
    } catch (e) {
      toast.error("Məlumatlar yüklənmədi");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- ADD ---------------- */
  const add = async () => {
    try {
      if (!form.name || !form.price || !form.category) {
        toast.error("Vacib sahələr boşdur");
        return;
      }

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description || "");
      fd.append("price", String(form.price));
      fd.append("discountPrice", String(form.discountPrice || ""));
      fd.append("category", form.category);
      if (form.image) fd.append("image", form.image);

      const res = await fetch("/api/products", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let msg = "Əlavə edilərkən xəta baş verdi";
        try {
          const d = await res.json();
          msg = d?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      setForm(emptyForm);
      toast.success("Məhsul əlavə edildi");
      load();
    } catch (err) {
      toast.error(err?.message || "Əlavə edilərkən xəta baş verdi");
    }
  };

  /* ---------------- DELETE ---------------- */
  const remove = async () => {
    try {
      const res = await fetch(`/api/products?id=${selected}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinərkən xəta baş verdi");
      setSelected(null);
      toast.success("Silindi");
      load();
    } catch (err) {
      toast.error(err?.message || "Silinərkən xəta baş verdi");
    }
  };

  /* ---------------- EDIT ---------------- */
  const saveEdit = async () => {
    try {
      if (!editing || !editing._id) return;

      const fd = new FormData();
      fd.append("name", editing.name || "");
      fd.append("description", editing.description || "");
      fd.append("price", String(editing.price || ""));
      fd.append("discountPrice", String(editing.discountPrice || ""));
      fd.append("category", editing.category || "");
      if (editing.image instanceof File) fd.append("image", editing.image);

      const res = await fetch(`/api/products?id=${editing._id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        let msg = "Yenilənərkən xəta baş verdi";
        try {
          const d = await res.json();
          msg = d?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      setEditOpen(false);
      setEditing(null);
      toast.success("Yeniləndi");
      load();
    } catch (err) {
      toast.error(err?.message || "Yenilənərkən xəta baş verdi");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <Toaster />

      {/* ADD */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-8 mb-8 sm:mb-10">
        <h2 className="flex items-center gap-3 font-bold text-xl mb-6 text-gray-800">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Plus size={20} className="text-white" />
          </div>
          Yeni Məhsul
        </h2>

        {/* responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
            placeholder="Ad"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <input
            className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
            type="number"
            placeholder="Qiymət"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />

          <input
            className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
            type="number"
            placeholder="Endirim"
            value={form.discountPrice}
            onChange={(e) =>
              setForm((f) => ({ ...f, discountPrice: e.target.value }))
            }
          />

          <select
            className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option value="">Kateqoriya</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <label
            className="input border-2 border-gray-200 hover:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            htmlFor="add-image-input"
          >
            <ImageIcon size={18} />
            <span className="text-sm truncate">
              {form.image ? form.image.name : "Şəkil"}
            </span>
            <input
              id="add-image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
              }
            />
          </label>
        </div>

        <textarea
          className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mt-4 transition-all duration-200 w-full"
          placeholder="Məhsulun tərkibi / açıqlaması"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />

        <button
          onClick={add}
          className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99]"
        >
          <Plus size={18} /> Əlavə et
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="mb-6 text-gray-600 text-sm">Yüklənir...</div>}

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300 lg:hover:scale-105 lg:hover:-translate-y-1"
          >
            {p.image ? (
              <img
                src={p.image}
                className="h-40 w-full object-cover rounded-2xl mb-4 shadow-lg"
                alt=""
              />
            ) : (
              <div className="h-40 w-full bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl mb-4 flex items-center justify-center shadow-lg">
                <Package size={48} className="text-gray-400" />
              </div>
            )}

            <h3 className="font-bold text-lg text-gray-800 mb-2">{p.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {p.description}
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setEditing({
                    _id: p._id,
                    name: p.name || "",
                    description: p.description || "",
                    price: p.price || "",
                    discountPrice: p.discountPrice || "",
                    category:
                      typeof p.category === "object"
                        ? p.category?._id
                        : p.category || "",
                    image: null,
                  });
                  setEditOpen(true);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                <Pencil size={16} /> Edit
              </button>

              <button
                onClick={() => setSelected(p._id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              >
                <Trash2 size={16} /> Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onDelete={remove}
      />

      {/* EDIT MODAL */}
      {editOpen && editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-800">Redaktə</h3>
              <button
                onClick={() => setEditOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <input
              className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mb-4 w-full transition-all duration-200"
              placeholder="Ad"
              value={editing.name}
              onChange={(e) =>
                setEditing((x) => ({ ...x, name: e.target.value }))
              }
            />

            <textarea
              className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mb-4 w-full transition-all duration-200"
              placeholder="Tərkib"
              rows={3}
              value={editing.description}
              onChange={(e) =>
                setEditing((x) => ({ ...x, description: e.target.value }))
              }
            />

            <input
              className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mb-4 w-full transition-all duration-200"
              type="number"
              placeholder="Qiymət"
              value={editing.price}
              onChange={(e) =>
                setEditing((x) => ({ ...x, price: e.target.value }))
              }
            />

            <input
              className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mb-4 w-full transition-all duration-200"
              type="number"
              placeholder="Endirim"
              value={editing.discountPrice}
              onChange={(e) =>
                setEditing((x) => ({ ...x, discountPrice: e.target.value }))
              }
            />

            <select
              className="input border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 mb-4 w-full transition-all duration-200"
              value={editing.category}
              onChange={(e) =>
                setEditing((x) => ({ ...x, category: e.target.value }))
              }
            >
              <option value="">Kateqoriya</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label
              className="input border-2 border-gray-200 hover:border-blue-500 rounded-xl px-4 py-3 mb-6 w-full transition-all duration-200 flex gap-2 cursor-pointer hover:bg-blue-50"
              htmlFor="edit-image-input"
            >
              <ImageIcon size={18} /> Şəkli dəyiş
              <input
                id="edit-image-input"
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditing((x) => ({
                    ...x,
                    image: e.target.files?.[0] || null,
                  }))
                }
              />
            </label>

            <button
              onClick={saveEdit}
              className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-full py-4 rounded-xl flex justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <Save size={18} /> Yadda saxla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}