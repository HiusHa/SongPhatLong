// app/news/page.tsx
import Link from "next/link";
import {
  firstImageUrl,
  NewsCardItem,
  StrapiListResponse,
  StrapiNewsItem,
} from "../lib/news";
import { toSlug } from "../lib/slug";

async function fetchNews(): Promise<StrapiListResponse<StrapiNewsItem>> {
  const base = process.env.STRAPI_URL!;
  const token = process.env.STRAPI_API_TOKEN;

  const res = await fetch(`${base}/api/news?populate=*`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // cache: "no-store",
  });

  if (!res.ok) throw new Error(`News API ${res.status}`);
  return res.json();
}
export default async function NewsPage() {
  let payload: StrapiListResponse<StrapiNewsItem>;
  try {
    payload = await fetchNews();
  } catch (e: any) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <Link href="/" className="text-blue-600">
          &larr; Quay lại
        </Link>
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-4 text-red-700">
          Lỗi tải tin tức
          <br /> {String(e?.message ?? e)}
        </div>
      </main>
    );
  }

  const items: NewsCardItem[] = (payload.data ?? []).map((n) => ({
    id: n.id,
    title: n.Title,
    slug:
      n.SlugURL && n.SlugURL.trim() !== ""
        ? n.SlugURL
        : toSlug(n.Title) || String(n.id),
    dateISO: n.Date,
    author: n.Author ?? undefined,
    imageUrl: firstImageUrl(n.Image ?? undefined),
  }));

  if (!items.length) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <Link href="/" className="text-blue-600">
          &larr; Quay lại
        </Link>
        <p className="mt-4">Chưa có bài viết nào.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Tin tức</h1>
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.id} className="rounded border p-4 hover:shadow">
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.imageUrl}
                alt={it.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            ) : null}
            <h2 className="text-lg font-semibold mb-1">
              <Link href={`/news/${it.slug}`} className="hover:underline">
                {it.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600">
              {new Date(it.dateISO).toLocaleDateString("vi-VN")}
              {it.author ? ` • ${it.author}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
