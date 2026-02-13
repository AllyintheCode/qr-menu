"use client";

import { useMemo, useState } from "react";
import { Package, Layers, BadgePercent, Activity, X } from "lucide-react";

const colorMap = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

export default function DashboardClient({ data }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // "products" | "categories" | "discounted" | "status"

  const modal = useMemo(() => {
    if (!active) return null;

    if (active === "products") {
      return {
        title: `Məhsullar (${data.counts.products})`,
        subtitle: "Son məhsullar",
        items: data.products.slice(0, 20).map((p) => ({
          title: p.title || p.name || p.productName || "Adsız məhsul",
          meta: p.price ? `${p.price} AZN` : "",
        })),
      };
    }

    if (active === "categories") {
      return {
        title: `Kateqoriyalar (${data.counts.categories})`,
        subtitle: "Kateqoriya siyahısı",
        items: data.categories.slice(0, 30).map((c) => ({
          title: c.name || c.title || "Adsız kateqoriya",
          meta: c.slug ? `/${c.slug}` : "",
        })),
      };
    }

    if (active === "discounted") {
      return {
        title: `Endirimdə (${data.counts.discounted})`,
        subtitle: "Endirimli məhsullar",
        items: data.discounted.slice(0, 20).map((p) => ({
          title: p.title || p.name || "Adsız məhsul",
          meta: p.discountPrice ? `Endirim: ${p.discountPrice} AZN` : "",
        })),
      };
    }

    return {
      title: "Status",
      subtitle: "Sistem vəziyyəti",
      items: [
        { title: "Panel aktivdir", meta: "OK" },
        { title: "API işləyir", meta: "OK" },
      ],
    };
  }, [active, data]);

  const openModal = (key) => {
    setActive(key);
    setOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Stat
          title="Məhsullar"
          value={data.counts.products}
          icon={<Package />}
          color="blue"
          onClick={() => openModal("products")}
        />
        <Stat
          title="Kateqoriyalar"
          value={data.counts.categories}
          icon={<Layers />}
          color="purple"
          onClick={() => openModal("categories")}
        />
        <Stat
          title="Endirimdə"
          value={data.counts.discounted}
          icon={<BadgePercent />}
          color="green"
          onClick={() => openModal("discounted")}
        />
        <Stat
          title="Status"
          value="Aktiv"
          icon={<Activity />}
          color="emerald"
          onClick={() => openModal("status")}
        />
      </div>

      {/* Modal */}
      {open && modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            // backdrop click close
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {modal.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{modal.subtitle}</p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-auto">
              {modal.items?.length ? (
                <div className="space-y-3">
                  {modal.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border p-3 hover:shadow-sm transition"
                    >
                      <div className="font-medium text-gray-900">
                        {it.title}
                      </div>
                      <div className="text-sm text-gray-500">{it.meta}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Məlumat tapılmadı.</div>
              )}
            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90 transition"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow p-6 hover:shadow-xl transition active:scale-[0.99]"
    >
      <div
        className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-2">Detala bax</p>
    </button>
  );
}
