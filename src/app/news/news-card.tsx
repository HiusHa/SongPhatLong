"use client";
// src/components/news/NewsCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author?: string;
  Image?: {
    url: string;
    alternativeText?: string | null;
  };
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

export default function NewsCard({ n }: { n: NewsItem }) {
  const computed =
    (n.SlugURL && n.SlugURL.trim()) || slugify(n.Title) || n.documentId;
  const href = `/news/${encodeURIComponent(computed)}`;

  return (
    <Link
      href={href}
      prefetch={false}
      className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden"
    >
      <div className="relative aspect-video bg-gray-100">
        {n.Image?.url ? (
          <Image
            src={n.Image.url}
            alt={n.Image.alternativeText || n.Title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{n.Title}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(n.Date).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </Link>
  );
}
