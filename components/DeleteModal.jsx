"use client";

export default function DeleteModal({ open, onClose, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 sm:w-96 p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Silmək istədiyinizə əminsiniz?
        </h3>

        <p className="text-gray-500 text-sm mb-6 text-center">
          Bu əməliyyatı geri qaytarmaq mümkün deyil.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Ləğv et
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
