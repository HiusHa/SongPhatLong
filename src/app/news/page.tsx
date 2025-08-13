"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";

type NewsItem = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author: string;
  Image: { url: string; alternativeText?: string | null };
};

type ApiResp<T> = { data: T[]; meta?: unknown };

function slugify(text?: string) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = (await api.getNews()) as AxiosResponse<ApiResp<NewsItem>>;
        const list = resp?.data?.data ?? [];
        setItems(list);
      } catch (err) {
        console.error("Lỗi khi gọi getNews (list):", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => {
        const computed =
          (n.SlugURL && n.SlugURL.trim()) || slugify(n.Title) || n.documentId;
        const href = `/news/${encodeURIComponent(computed)}`;
        return (
          // IMPORTANT: prefetch={false} để tránh RSC prefetch khiến client không remount
          <Link
            key={n.documentId}
            href={href}
            prefetch={false}
            className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden"
          >
            <div className="relative aspect-video">
              <Image
                src={n.Image.url}
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
