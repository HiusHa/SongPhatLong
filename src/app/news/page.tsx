"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/app/_utils/globalApi";
import { Loader } from "@/components/loader";

type NewsItem = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author: string;
  Image: {
    url: string;
    alternativeText: string | null;
  };
};

type ApiWrapped<T> = { data: T[]; meta?: unknown };

// helper slugify giống bên products
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Safely extract list of items from API response.
 * Accept shapes:
 *  - [{...}, {...}]
 *  - { data: [{...}, {...}], meta: ... }
 */
function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) {
    return raw as T[];
  }
  if (
    typeof raw === "object" &&
    raw !== null &&
    Array.isArray((raw as ApiWrapped<T>).data)
  ) {
    return (raw as ApiWrapped<T>).data;
  }
  return [];
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getNews();
        const raw = resp.data as unknown;
        const list = extractList<NewsItem>(raw);
        setItems(list);
      } catch (e) {
        console.error("Fetch news error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => {
        const slug = n.SlugURL?.trim() || slugify(n.Title) || n.documentId;
        return (
          <Link
            key={n.documentId}
            href={`/news/${slug}`}
            className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden"
          >
            <div className="relative aspect-video">
              <Image
                src={n.Image.url || "/placeholder.svg"}
                alt={n.Image.alternativeText || n.Title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold line-clamp-2">{n.Title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(n.Date).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
