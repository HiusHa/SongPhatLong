"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/_utils/globalApi";
import { Loader } from "@/components/loader";
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
  SlugURL?: string | null;
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
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

// Hàm resolveHref đã được tích hợp vào LinkRenderer, không cần định nghĩa riêng
// function resolveHref(raw?: string): string { ... }

// Định nghĩa component LinkRenderer để sử dụng trong ReactMarkdown
const LinkRenderer = ({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (!href) return <a {...props}>{children}</a>;

  const trimmed = href.trim();

  // internal route (relative)
  if (trimmed.startsWith("/")) {
    return (
      <Link href={trimmed} className="text-blue-600 hover:underline" {...props}>
        {children}
      </Link>
    );
  }

  // external (open new tab)
  const resolvedHref = (() => {
    // Keep mailto / tel
    if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
    // Already absolute
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // Scheme-relative //example.com -> add https:
    if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
    // Common domain without protocol (e.g. "www.facebook.com/...")
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
  const params = useParams();
  const router = useRouter();
  const slugParam = (params?.slug as string) ?? "";
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slugParam) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allResp = await api.getNews();
        type NewsApiResponse = {
          data?: { data?: NewsItem[] } | NewsItem[];
        };
        const typed = allResp as NewsApiResponse;
        let list: NewsItem[] = [];
        if (
          typed &&
          typeof typed === "object" &&
          "data" in typed &&
          Array.isArray((typed.data as { data?: NewsItem[] })?.data)
        ) {
          list = (typed.data as { data?: NewsItem[] }).data!;
        } else if (
          typed &&
          typeof typed === "object" &&
          "data" in typed &&
          Array.isArray(typed.data)
        ) {
          list = typed.data as NewsItem[];
        } else if (Array.isArray(typed)) {
          list = typed as NewsItem[];
        }

        let found = list.find((n) => readSlugField(n) === slugParam);
        if (!found) {
          found = list.find((n) => slugify(n.Title) === slugParam);
        }
        if (!found) {
          found = list.find(
            (n) => String(n.documentId ?? n.id ?? "") === slugParam
          );
        }

        if (!found) {
          router.replace("/news");
        } else {
          setItem(found);
        }
      } catch (err) {
        console.error("Fetch news detail error:", err);
        router.replace("/news");
      } finally {
        setLoading(false);
      }
    })();
  }, [slugParam, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!item) return null;

  const img = item.Image;
  const imgUrl = img?.url ?? "";
  const imgAlt = img?.alternativeText ?? item.Title;

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

        {imgUrl && !imageError && (
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
              onError={() => setImageError(true)}
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
                  <ReactMarkdown
                    components={{
                      a: LinkRenderer,
                    }}
                  >
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
