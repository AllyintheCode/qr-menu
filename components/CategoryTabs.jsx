import Link from "next/link";

export default function CategoryTabs({ categories }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((c) => (
        <Link
          key={c._id}
          href={`/menu/${c.slug}`}
          className="px-4 py-2 bg-white rounded-full shadow text-sm"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
