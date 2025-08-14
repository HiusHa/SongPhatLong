// app/news/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";
import NewsCard, { NewsItem } from "./news-card";

type ApiResp<T> = { data: T[]; meta?: unknown };

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
        console.error("Lỗi getNews (list):", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => (
        <div key={n.documentId}>
          <NewsCard n={n} />
        </div>
      ))}
    </div>
  );
}
