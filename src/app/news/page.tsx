"use client";

import { useState, useEffect } from "react";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";
import { NewsCard, type NewsItem } from "./news-card";

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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("[v0] [CLIENT] Starting news fetch");
        console.log(
          "[v0] [CLIENT] API Key present:",
          !!process.env.NEXT_PUBLIC_API_KEY
        );

        const resp = await api.getNews();
        console.log("[v0] [CLIENT] News API response status:", resp.status);

        const typed = resp as AxiosResponse<{ data: NewsItem[] }>;
        const list: NewsItem[] = typed.data?.data ?? [];
        console.log("[v0] [CLIENT] News items count:", list.length);

        setNews(list);
      } catch (err: unknown) {
        const error = err as Error & {
          response?: {
            status?: number;
            data?: {
              error?: {
                message?: string;
                status?: number;
                name?: string;
              };
            };
          };
        };
        console.error("[v0] [CLIENT] News API Error:", error);
        setError(error.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Tin tức</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải tin tức...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Tin tức</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Không thể tải tin tức.</p>
            <p className="text-red-600 text-sm mt-2">Lỗi: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const withSlug = news.map((n) => {
    const newsItem = n as NewsItem;
    const r =
      (newsItem as unknown as Record<string, unknown>)["SlugURL"] ??
      (newsItem as unknown as Record<string, unknown>)["slugURL"];
    const rawSlug = typeof r === "string" ? r.trim() : "";
    const generated =
      rawSlug ||
      slugify(newsItem.Title) ||
      String(newsItem.documentId ?? newsItem.id);
    return { newsItem, slug: generated };
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tin tức</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {withSlug.map((item, index) => (
            <NewsCard
              key={item.newsItem.id || index}
              news={item.newsItem}
              slug={item.slug}
            />
          ))}
        </div>

        {withSlug.length === 0 && (
          <p className="text-center text-gray-600 mt-8">Không có tin tức.</p>
        )}
      </div>
    </div>
  );
}
