"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/categories", label: "Kateqoriyalar" },
    { href: "/admin/products", label: "Məhsullar" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-transparent p-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl bg-white/90 shadow"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg p-6 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen
        `}
      >
        {/* Close Button (mobile only) */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold">Admin</h2>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Desktop Title */}
        <h2 className="text-2xl font-bold mb-6 hidden lg:block">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2 rounded font-medium transition
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
