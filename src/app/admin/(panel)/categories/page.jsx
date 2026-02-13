"use client";

import { useEffect, useState } from "react";

import { Toaster, toast } from "react-hot-toast";
import { Pencil, Trash2, FolderPlus } from "lucide-react";
import DeleteModal from "../../../../../components/DeleteModal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const load = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    toast.success("Kateqoriya əlavə edildi");
    setName("");
    load();
  };

  const remove = async () => {
    await fetch(`/api/categories?id=${selected}`, { method: "DELETE" });
    toast.success("Kateqoriya silindi");
    setSelected(null);
    load();
  };

  const saveEdit = async () => {
    if (!editing || !editing._id) return;
    await fetch(`/api/categories?id=${editing._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name }),
    });
    toast.success("Kateqoriya yeniləndi");
    setEditModalOpen(false);
    setEditing(null);
    load();
  };

  return (
    <div className="min-h-screen  from-gray-100 to-gray-200 p-6">
      <Toaster position="top-right" />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Ümumi Kateqoriya</p>
          <h2 className="text-3xl font-bold">{categories.length}</h2>
        </div>
      </div>

      {/* Add */}
      <div className="bg-white rounded-xl shadow p-4 flex gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yeni kateqoriya adı"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={add}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FolderPlus size={18} />
          Əlavə et
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((c) => (
          <div
            key={c._id}
            className="group bg-white rounded-xl shadow hover:shadow-xl transition p-5 flex justify-between items-center"
          >
            <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {c.name}
            </span>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => {
                  setEditing(c);
                  setEditModalOpen(true);
                }}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setSelected(c._id)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete */}
      <DeleteModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onDelete={remove}
      />

      {/* Edit */}
      {editModalOpen && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              Kateqoriyanı Redaktə Et
            </h2>

            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Yadda Saxla
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Ləğv et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
