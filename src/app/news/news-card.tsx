// app/news/news-card.tsx
"use client";

import React from "react";
import Image from "next/image";

type NewsItem = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author: string;
  Image?: {
    url: string;
    alternativeText?: string | null;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const img =
    item.Image?.formats?.medium?.url ?? item.Image?.url ?? "/placeholder.svg";
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={img}
          alt={item.Image?.alternativeText ?? item.Title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{item.Title}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(item.Date).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </div>
  );
}
