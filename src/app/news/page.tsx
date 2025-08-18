// app/news/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader } from "@/components/loader";
import {
  firstImageUrl,
  NewsCardItem,
  StrapiListResponse,
  StrapiNewsItem,
} from "../lib/news";
import { toSlug } from "../lib/slug";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";

// Helper function to safely read slug field (handle both SlugURL and slugURL)
function readSlugField(n: StrapiNewsItem): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<
    (NewsCardItem & { __slug?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Use the API function
        const resp = await api.getNews();
        const typed = resp as AxiosResponse<StrapiListResponse<StrapiNewsItem>>;
        const list: StrapiNewsItem[] = typed.data?.data ?? [];

        const itemsWithSlug = list.map((n) => {
          const customSlug = readSlugField(n);
          const generatedSlug =
            customSlug || toSlug(n.Title) || String(n.documentId ?? n.id);

          return {
            id: n.id,
            title: n.Title,
            slug: generatedSlug,
            dateISO: n.Date,
            author: n.Author ?? undefined,
            imageUrl: firstImageUrl(n.Image ?? undefined),
            __slug: generatedSlug,
          };
        });

        setNewsItems(itemsWithSlug);
      } catch (e: any) {
        console.error("Error fetching news:", e);
        setError(e?.message ?? String(e));
        setNewsItems([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <Link href="/" className="text-blue-600">
          &larr; Quay lại
        </Link>
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-4 text-red-700">
          Lỗi tải tin tức
          <br /> {error}
        </div>
      </main>
    );
  }

  if (!newsItems.length) {
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
        {newsItems.map((it) => (
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
              <Link
                href={`/news/${encodeURIComponent(it.__slug || it.slug)}`}
                className="hover:underline"
              >
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
