// app/news/news-card.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

export type NewsItem = {
  id: number;
  documentId?: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author?: string;
  Image?: {
    url?: string;
    alternativeText?: string | null;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    width?: number;
    height?: number;
  } | null;
  ContentSection?: ContentSection[] | null;
};

export function NewsCard({
  news,
  slug,
}: {
  news: NewsItem & { __slug?: string };
  slug: string;
}) {
  const imgUrl =
    news.Image?.formats?.thumbnail?.url ||
    news.Image?.formats?.small?.url ||
    news.Image?.url ||
    null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <Link href={`/news/${slug}`} className="block">
        <div className="w-full h-48 relative bg-gray-100">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={news.Image?.alternativeText || news.Title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {news.Title}
          </h3>

          <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
            <span>{new Date(news.Date).toLocaleDateString("vi-VN")}</span>
            <span className="ml-3">{news.Author}</span>
          </div>

          {news.ContentSection && news.ContentSection.length > 0 && (
            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {/* show small excerpt from first section */}
              {String(news.ContentSection[0].SectionContent).slice(0, 140)}
              {String(news.ContentSection[0].SectionContent).length > 140
                ? "…"
                : ""}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
