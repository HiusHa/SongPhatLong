"use client";
import Link from "next/link";
import Image from "next/image";

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
  SlugURL?: string | null;
  slugURL?: string | null;
  updatedAt?: string | null;
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function NewsCard({ news }: { news: NewsItem }) {
  const thumb = news.Image?.url ?? "";
  const title = news.Title ?? "";

  const slug = news.SlugURL?.trim() || slugify(title);

  return (
    <article className="border rounded-md overflow-hidden shadow-sm">
      <Link href={`/news/${encodeURIComponent(slug)}`} prefetch={false}>
        <div className="h-48 w-full relative bg-gray-100">
          {thumb ? (
            <Image
              src={thumb || "/placeholder.svg"}
              alt={news.Image?.alternativeText ?? title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              unoptimized={!thumb.startsWith("/")}
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

export default NewsCard;
