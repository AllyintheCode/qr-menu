"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";

export default function AdminClientLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:ml-0">{children}</div>
    </div>
  );
}
