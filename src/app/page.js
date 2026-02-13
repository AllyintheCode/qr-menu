// app/page.js
import { redirect } from "next/navigation";

export default function Page() {
  // server-side yönləndirmə
  redirect("/menu");

  // React Component qaytarmalıdır
  return null;
}
