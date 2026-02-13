import DashboardClient from "./DashboardClient";
import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers(); // ✅ await lazımdır
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function getStats() {
  const baseUrl = await getBaseUrl(); // ✅ await

  const [products, categories] = await Promise.all([
    fetch(`${baseUrl}/api/products`, { cache: "no-store" }).then((r) =>
      r.json(),
    ),
    fetch(`${baseUrl}/api/categories`, { cache: "no-store" }).then((r) =>
      r.json(),
    ),
  ]);

  const discounted = products.filter((p) => p.discountPrice);

  return {
    products,
    categories,
    discounted,
    counts: {
      products: products.length,
      categories: categories.length,
      discounted: discounted.length,
    },
  };
}

export default async function DashboardPage() {
  const data = await getStats();
  return <DashboardClient data={data} />;
}
