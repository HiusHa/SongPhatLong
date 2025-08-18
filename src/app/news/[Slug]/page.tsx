// app/news/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/components/loader";
import {
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

// Extended type with updatedAt
type NewsDetailWithUpdated = NewsDetail & {
  updatedAt?: string | null;
  imageUrl: string; // Ensure imageUrl is always a string
};

// Helper function to safely read slug field
function readSlugField(n: StrapiNewsItem): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

// Improved image URL extraction function
function extractImageUrl(imageData: any): string | null {
  if (!imageData) return null;

  // Handle different possible image data structures
  // Direct URL property
  if (imageData.url && typeof imageData.url === "string") {
    return imageData.url;
  }

  // Nested structure with attributes
  if (imageData.data?.attributes?.url) {
    return imageData.data.attributes.url;
  }

  // Nested structure without attributes
  if (imageData.data?.url) {
    return imageData.data.url;
  }

  // Format-specific URLs
  if (imageData.formats) {
    // Try to get the largest available format
    const formats = ["large", "medium", "small", "thumbnail"];
    for (const format of formats) {
      if (imageData.formats[format]?.url) {
        return imageData.formats[format].url;
      }
    }
  }

  return null;
}

// Date formatting helper
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return "-";
  }
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetailWithUpdated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev) {
      console.log("Development mode detected");
    }

    (async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
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
          console.error("News not found for slug:", slug);
          router.replace("/news");
          return;
        }

        // Extract image URL with improved function
        const imageUrl = extractImageUrl(found.Image);

        const detail: NewsDetailWithUpdated = {
          id: found.id,
          title: found.Title,
          slug:
            found.SlugURL?.trim() || toSlug(found.Title) || String(found.id),
          dateISO: found.Date,
          author: found.Author ?? undefined,
          imageUrl: imageUrl || "/placeholder.svg", // Always provide a fallback
          sections:
            found.ContentSection?.map((s) => ({
              id: s.id,
              title: s.SectionTitle ?? undefined,
              content: s.SectionContent ?? undefined,
            })) ?? [],
          updatedAt:
            (found as { updatedAt?: string | null }).updatedAt ?? undefined,
        };

        if (isDev) {
          console.log("News data loaded:", detail);
          console.log("Image URL:", detail.imageUrl);
        }

        setNews(detail);
      } catch (err) {
        console.error("Fetch news error:", err);
        router.replace("/news");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [slug, router, isDev]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!news) return null; // already redirected or not found

  // Ensure imgSrc is always a string
  const imgSrc: string = imageError
    ? "/placeholder.svg"
    : news.imageUrl || "/placeholder.svg";

  const imgAlt = news.title;

  return (
    <div className="container mx-auto py-12">
      {isDev && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Image URL: {news.imageUrl}</p>
          <p>Image Source: {imgSrc}</p>
          <p>Image Error: {imageError ? "Yes" : "No"}</p>
        </div>
      )}
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>
      <article className="bg-white rounded-xl shadow overflow-hidden">
        <header className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>{formatDate(news.dateISO)}</time>
            <span>{news.author ?? "-"}</span>
          </div>
        </header>

        {/* Always render the image container */}
        <div
          className="my-8 mx-8 rounded-lg overflow-hidden relative"
          style={{ height: 400 }}
        >
          <Image
            src={imgSrc} // Now guaranteed to be a string
            alt={imgAlt}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            style={{ objectFit: "cover" }}
            onError={() => {
              console.error("Image failed to load:", imgSrc);
              setImageError(true);
            }}
            unoptimized={true} // Always unoptimize for external images
            priority
          />
        </div>

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
              Cập nhật: {formatDate(news.updatedAt)}
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
