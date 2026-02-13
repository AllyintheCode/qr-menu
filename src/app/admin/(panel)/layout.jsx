import { redirect } from "next/navigation";
import AdminClientLayout from "../AdminClientLayout";
import { verifyAdmin } from "../../../../lib/auth";

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) redirect("/admin/login");

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
