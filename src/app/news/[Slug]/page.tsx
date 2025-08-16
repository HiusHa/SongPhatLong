"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/_utils/globalApi";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type NewsImage = {
  url?: string;
  alternativeText?: string | null;
};

type ContentSection = {
  id: number;
  SectionTitle?: string | null;
  SectionContent?: string | null;
};

type NewsItem = {
  id: number;
  documentId?: string | null;
  Title: string;
  Date?: string | null;
  Author?: string | null;
  Image?: NewsImage | null;
  ContentSection?: ContentSection[] | null;
  SlugURL?: string | null; // Strapi can send either
  slugURL?: string | null;
  updatedAt?: string | null;
};

function slugify(s?: string) {
  if (!s) return "";
  return s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readSlugField(n: NewsItem): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? r.trim() : null;
}

const LinkRenderer = ({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (!href) return <a {...props}>{children}</a>;

  const trimmed = href.trim();

  if (trimmed.startsWith("/")) {
    return (
      <Link href={trimmed} className="text-blue-600 hover:underline" {...props}>
        {children}
      </Link>
    );
  }

  const resolvedHref = (() => {
    if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
    return `https://${trimmed}`;
  })();

  return (
    <a
      href={resolvedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
      {...props}
    >
      {children}
    </a>
  );
};

export default function NewsDetailPage() {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    if (!slugParam) {
      router.push("/news");
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        console.log("[v0][CLIENT] Fetching news for slug:", slugParam);

        // api.getNews() should return either { data: NewsItem[] } or { data: { data: NewsItem[] } }
        type NewsApiResponse =
          | { data: { data: NewsItem[] } }
          | { data: NewsItem[] }
          | { data?: unknown };

        const allResp = (await api.getNews()) as NewsApiResponse;

        let list: NewsItem[] = [];
        if (
          allResp &&
          typeof allResp === "object" &&
          "data" in allResp &&
          allResp.data &&
          typeof allResp.data === "object" &&
          "data" in (allResp.data as Record<string, unknown>) &&
          Array.isArray((allResp.data as { data: unknown }).data)
        ) {
          list = (allResp.data as { data: NewsItem[] }).data;
        } else if (
          allResp &&
          typeof allResp === "object" &&
          "data" in allResp &&
          Array.isArray((allResp as { data: unknown }).data)
        ) {
          list = (allResp as { data: NewsItem[] }).data;
        }

        const found =
          list.find((n) => readSlugField(n) === slugParam) ??
          list.find((n) => slugify(n.Title) === slugParam) ??
          list.find((n) => String(n.documentId ?? n.id ?? "") === slugParam);

        if (found) {
          setItem(found);
        } else {
          setError("Không tìm thấy tin tức");
        }
      } catch (err) {
        const e = err as Error;
        console.error("[v0][CLIENT] Fetch news detail error:", e);
        setError(e.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [slugParam, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <Link href="/news" className="text-red-600 hover:underline mb-6 block">
          ← Quay lại tin tức
        </Link>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Link href="/news" className="text-red-600 hover:underline mb-6 block">
          ← Quay lại tin tức
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-bold mb-2">Lỗi tải tin tức</h2>
          <p className="text-red-700 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const imgUrl = item.Image?.url ?? "";
  const imgAlt = item.Image?.alternativeText ?? item.Title;

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>

      <article className="bg-white rounded-xl shadow overflow-hidden">
        <header className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{item.Title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>
              {item.Date
                ? new Date(item.Date).toLocaleDateString("vi-VN")
                : "-"}
            </time>
            <span>{item.Author ?? "-"}</span>
          </div>
        </header>

        {imgUrl && (
          <div
            className="my-8 mx-8 rounded-lg overflow-hidden relative"
            style={{ height: 400 }}
          >
            <Image
              src={imgUrl || "/placeholder.svg"}
              alt={imgAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              style={{ objectFit: "cover" }}
              unoptimized={!imgUrl.startsWith("/")}
            />
          </div>
        )}

        <div className="p-8 space-y-16">
          {item.ContentSection?.map((sec) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              {sec.SectionTitle && (
                <h2 className="text-2xl font-bold mb-4">{sec.SectionTitle}</h2>
              )}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-gray-700 leading-relaxed">
                  <ReactMarkdown components={{ a: LinkRenderer }}>
                    {sec.SectionContent ?? ""}
                  </ReactMarkdown>
                </div>
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
