"use client";

import Link from "next/link";
// import Image from "next/image";
import React from "react";

export type NewsImage = {
  url?: string;
  alternativeText?: string | null;
};

export type ContentSection = {
  id: number;
  SectionTitle?: string | null;
  SectionContent?: string | null;
};

export type NewsItem = {
  id: number;
  documentId?: string | null;
  Title: string;
  Date?: string | null;
  Author?: string | null;
  Image?: NewsImage | null;
  ContentSection?: ContentSection[] | null;
};

export function NewsCard({ news, slug }: { news: NewsItem; slug: string }) {
  const thumb = news.Image?.url ?? "";
  const title = news.Title ?? "";

  return (
    <article className="border rounded-md overflow-hidden shadow-sm">
      <Link href={`/news/${encodeURIComponent(slug)}`} prefetch={false}>
        <div className="h-48 w-full relative bg-gray-100">
          {thumb ? (
            // next/image optional, keep simple if external urls
            // you can replace with Image component if domains configured
            // <Image src={thumb} alt={news.Image?.alternativeText ?? title} fill />
            <img
              src={thumb}
              alt={news.Image?.alternativeText ?? title}
              className="object-cover w-full h-48"
            />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No image
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          {news.Date && (
            <p className="text-sm text-gray-500 mt-2">
              {new Date(news.Date).toLocaleDateString()}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
