"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";
import { Loader } from "@/components/loader";
import { NewsCard, NewsItem } from "./news-card";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

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
  const [news, setNews] = useState<(NewsItem & { __slug?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getNews();
        // resp might be AxiosResponse<{ data: NewsItem[] }> OR already data array depending on your util
        const typed = resp as AxiosResponse<{ data: NewsItem[] }>;
        const list: NewsItem[] =
          (typed && Array.isArray(typed.data?.data) ? typed.data.data : []) ||
          (Array.isArray((resp as unknown as { data?: unknown })?.data)
            ? (resp as unknown as { data: NewsItem[] }).data
            : []);

        const withSlug = list.map((n) => {
          const r =
            (n as unknown as Record<string, unknown>)["SlugURL"] ??
            (n as unknown as Record<string, unknown>)["slugURL"];
          const rawSlug = typeof r === "string" ? (r as string).trim() : "";
          const generated =
            rawSlug || slugify(n.Title) || String(n.documentId ?? n.id ?? "");
          return { ...n, __slug: generated };
        });

        setNews(withSlug);
      } catch (err) {
        console.error("Error fetching news:", err);
        setNews([]);
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tin tức</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <NewsCard
              key={n.id}
              news={n}
              slug={n.__slug ?? String(n.documentId ?? n.id)}
            />
          ))}
        </div>

        {news.length === 0 && (
          <p className="text-center text-gray-600 mt-8">Không có tin tức.</p>
        )}
      </div>
    </motion.div>
  );
}
