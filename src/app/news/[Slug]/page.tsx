// app/news/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/components/loader";
import {
  firstImageUrl,
  type NewsDetail,
  type StrapiListResponse,
  type StrapiNewsItem,
} from "@/app/lib/news";
import { toSlug } from "@/app/lib/slug";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";

// Link renderer
function LinkRenderer(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
) {
  const href = props.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  return isInternal ? (
    <Link href={href} className="text-red-600 underline">
      {props.children}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 underline"
    >
      {props.children}
    </a>
  );
}

// mở rộng để có updatedAt
type NewsDetailWithUpdated = NewsDetail & { updatedAt?: string | null };

// Helper function to safely read slug field (handle both SlugURL and slugURL)
function readSlugField(n: StrapiNewsItem): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetailWithUpdated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        // Use the API function
        const resp = await api.getNews();
        const typed = resp as AxiosResponse<StrapiListResponse<StrapiNewsItem>>;
        const list: StrapiNewsItem[] = Array.isArray(typed.data?.data)
          ? typed.data.data
          : [];

        // 1) Try custom SlugURL
        let found = list.find((n) => {
          const customSlug = readSlugField(n);
          return customSlug === slug;
        });

        // 2) Fallback to generated slug from title
        if (!found) {
          found = list.find((n) => toSlug(n.Title) === slug);
        }

        // 3) Fallback to documentId or id
        if (!found) {
          found = list.find((n) => String(n.documentId ?? n.id) === slug);
        }

        if (!found) {
          router.replace("/news");
        } else {
          const detail: NewsDetailWithUpdated = {
            id: found.id,
            title: found.Title,
            slug:
              found.SlugURL?.trim() || toSlug(found.Title) || String(found.id),
            dateISO: found.Date,
            author: found.Author ?? undefined,
            imageUrl: firstImageUrl(found.Image ?? undefined),
            sections:
              found.ContentSection?.map((s) => ({
                id: s.id,
                title: s.SectionTitle ?? undefined,
                content: s.SectionContent ?? undefined,
              })) ?? [],
            updatedAt:
              (found as { updatedAt?: string | null }).updatedAt ?? undefined,
          };
          setNews(detail);
        }
      } catch (err) {
        console.error("Fetch news error:", err);
        router.replace("/news");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!news) return null; // already redirected or not found

  // Use imageError state to determine the image source
  const imgUrl = imageError
    ? "/placeholder.svg"
    : news.imageUrl || "/placeholder.svg";
  const imgAlt = news.title;

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>
      <article className="bg-white rounded-xl shadow overflow-hidden">
        <header className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>
              {news.dateISO
                ? new Date(news.dateISO).toLocaleDateString("vi-VN")
                : "-"}
            </time>
            <span>{news.author ?? "-"}</span>
          </div>
        </header>
        {!!imgUrl && (
          <div
            className="my-8 mx-8 rounded-lg overflow-hidden relative"
            style={{ height: 400 }}
          >
            <Image
              src={imgUrl}
              alt={imgAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              style={{ objectFit: "cover" }}
              onError={() => setImageError(true)}
              unoptimized={imgUrl.startsWith("http")}
            />
          </div>
        )}
        <div className="p-8 space-y-16">
          {news.sections.map((sec) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              {sec.title && (
                <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
              )}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-gray-700 leading-relaxed prose max-w-none">
                  <ReactMarkdown
                    components={{ a: (props) => <LinkRenderer {...props} /> }}
                  >
                    {sec.content ?? ""}
                  </ReactMarkdown>
                </div>
              </div>
            </section>
          ))}
          <div className="mt-16 pt-8 border-t flex justify-between">
            <span className="text-gray-500">
              Cập nhật:{" "}
              {news.updatedAt
                ? new Date(news.updatedAt).toLocaleDateString("vi-VN")
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
