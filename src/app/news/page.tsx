"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";
import NewsCard, { NewsItem } from "./news-card";

type ApiResp<T> = { data: T[]; meta?: unknown };

export default function NewsListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = (await api.getNews()) as AxiosResponse<ApiResp<NewsItem>>;
        const list = resp?.data?.data ?? [];
        if (mounted) setItems(list);
      } catch (err) {
        console.error("getNews list error:", err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
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
        <NewsCard key={n.documentId || n.id} item={n} />
      ))}
    </div>
  );
}
