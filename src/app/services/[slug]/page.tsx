// src/app/news/[slug]/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import type { AxiosResponse } from "axios";
import api from "@/app/_utils/globalApi"; // đảm bảo export getNews() ở đây
import { Loader } from "@/components/loader";
import Image from "next/image";

/* --- Types --- */
type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

type NewsDetail = {
  id: number;
  documentId?: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author?: string;
  updatedAt?: string;
  Image?: {
    id?: number;
    alternativeText?: string | null;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  } | null;
  ContentSection?: ContentSection[] | null;
};

/* --- util helpers --- */
function slugify(text?: string) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * đọc trường SlugURL với hai khả năng SlugURL / slugURL (để tương thích)
 */
function readSlugField(n: NewsDetail): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

/* --- Component --- */
export default function NewsDetails() {
  const params = useParams() as { slug?: string | string[] };
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const router = useRouter();

  const [item, setItem] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);
      setItem(null);
      setImageError(false);

      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        // call API to get all news (same approach as services)
        const resp = (await api.getNews()) as AxiosResponse<{
          data: NewsDetail[];
        }>;
        // Strapi style: resp.data.data (safety check)
        const list: NewsDetail[] = Array.isArray(resp.data?.data)
          ? resp.data.data
          : [];

        // 1) try custom SlugURL field (supports SlugURL / slugURL)
        let found = list.find((n) => {
          const raw = readSlugField(n);
          return raw === slug;
        });

        // 2) fallback: generated slug from Title
        if (!found) {
          found = list.find((n) => slugify(n.Title) === slug);
        }

        // 3) fallback: documentId or id
        if (!found) {
          found = list.find(
            (n) =>
              String(n.documentId ?? n.id) === slug || String(n.id) === slug
          );
        }

        if (!found) {
          // not found -> redirect to list
          if (mounted) router.replace("/news");
        } else {
          if (mounted) setItem(found);
        }
      } catch (err) {
        // log and redirect to list page (same behavior as services)
        console.error("Fetch news error:", err);
        if (mounted) router.replace("/news");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!item) return null; // already redirected

  // image handling: nếu api trả object Image (không phải array)
  const img = item.Image ?? null;
  const imgUrl =
    !imageError && (img?.formats?.large?.url || img?.url)
      ? img?.formats?.large?.url ?? img?.url
      : `/placeholder.svg?height=600&width=1000&text=${encodeURIComponent(
          item.Title ?? "News Image"
        )}`;

  const imgAlt = img?.alternativeText || item.Title || "News Image";

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>

      <article className="bg-white rounded-xl shadow overflow-hidden">
        <header className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{item.Title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>{new Date(item.Date).toLocaleDateString("vi-VN")}</time>
            <span>{item.Author}</span>
          </div>
        </header>

        {imgUrl && (
          <div className="my-8 mx-8 rounded-lg overflow-hidden">
            {/* dùng <img> để dễ bắt lỗi onError; bạn có thể thay bằng next/image nếu muốn */}
            <Image
              src={imgUrl}
              alt={imgAlt}
              className="object-cover w-full"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="p-8 space-y-16">
          {item.ContentSection?.map((sec) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              <h2 className="text-2xl font-bold mb-4">{sec.SectionTitle}</h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                {/* nếu nội dung markdown/HTML, bạn có thể xử lý parse; ở đây render raw with line breaks */}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: sec.SectionContent.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </section>
          ))}

          <div className="mt-16 pt-8 border-t flex justify-between">
            <span className="text-gray-500">
              Cập nhật:{" "}
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString("vi-VN")
                : "-"}
            </span>
            <Link href="/news" className="text-red-600 hover:underline">
              ← Xem thêm tin tức
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
