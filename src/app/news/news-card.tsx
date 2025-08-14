"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
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
  } | null;
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

function computeSlugFor(n: NewsItem) {
  const fromSlug = n.SlugURL?.trim();
  if (fromSlug) return fromSlug;
  const s = slugify(n.Title);
  if (s) return s;
  if (n.documentId) return n.documentId;
  return String(n.id);
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const imageUrl =
    item.Image?.formats?.large?.url || item.Image?.url || "/placeholder.svg";
  const href = `/news/${encodeURIComponent(computeSlugFor(item))}`;

  return (
    <Link
      href={href}
      // disable prefetch to avoid Next automatic prefetch that can alter client-fetch behaviour
      prefetch={false}
      className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden"
    >
      <div className="relative aspect-video w-full h-0">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={item.Image?.alternativeText || item.Title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{item.Title}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(item.Date).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </Link>
  );
}
