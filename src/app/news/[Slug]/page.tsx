// app/news/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/components/loader";
import { type NewsDetail, type StrapiNewsItem } from "@/app/lib/news";
import { toSlug } from "@/app/lib/slug";
function FacebookEmbed({ url }: { url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const isReel = url.includes("facebook.com/reel");
  const isVideo = url.includes("facebook.com/videos/");

  return (
    <div className="my-4 rounded-xl overflow-hidden shadow-lg bg-gray-50">
      <div className="p-3 bg-blue-600 text-white flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="font-medium">Facebook</span>
      </div>
      <div className="p-1 bg-white">
        <iframe
          src={`https://www.facebook.com/plugins/${
            isReel || isVideo ? "video" : "post"
          }.php?href=${encodedUrl}&width=500&show_text=true&height=${
            isReel || isVideo ? "280" : "500"
          }&appId`}
          width="100%"
          height={isReel || isVideo ? 280 : 500}
          style={{ border: "none", overflow: "hidden", width: "100%" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          {...{ allowtransparency: "true" }}
        />
      </div>
    </div>
  );
}
// Link renderer
function LinkRenderer(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
) {
  const href = props.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const isFacebookLink = href.includes("facebook.com");

  // Handle Facebook links specially
  if (isFacebookLink) {
    return (
      <div className="my-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline font-medium"
        >
          {props.children}
        </a>
        <FacebookEmbed url={href} />
      </div>
    );
  }

  // Handle regular links
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
  imageUrl: string;
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

  if (imageData.url && typeof imageData.url === "string") {
    return imageData.url;
  }

  if (imageData.data?.attributes?.url) {
    return imageData.data.attributes.url;
  }

  if (imageData.data?.url) {
    return imageData.data.url;
  }

  if (imageData.formats) {
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

// Helper function to extract slug from pathname
function extractSlugFromPathname(pathname: string): string | null {
  const parts = pathname.split("/");
  // Remove empty strings and get the last part
  const nonEmptyParts = parts.filter((part) => part.length > 0);
  if (
    nonEmptyParts.length > 1 &&
    nonEmptyParts[nonEmptyParts.length - 2] === "news"
  ) {
    return nonEmptyParts[nonEmptyParts.length - 1];
  }
  return null;
}

export default function NewsDetailPage() {
  const pathname = usePathname();
  const slug = extractSlugFromPathname(pathname);

  const [news, setNews] = useState<NewsDetailWithUpdated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const loadNews = async () => {
      if (!slug) {
        console.log("No slug found in pathname:", pathname);
        setError("Invalid news URL");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Make a direct API call
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL_PROD ||
            process.env.NEXT_PUBLIC_API_URL_DEV ||
            "https://songphatlong-admin.onrender.com"
          }/api/news?populate=*`
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const list: StrapiNewsItem[] = Array.isArray(data?.data)
          ? data.data
          : [];

        if (list.length === 0) {
          setError("No articles found");
          return;
        }

        // Try to find the article by slug
        let found = list.find((n) => {
          const customSlug = readSlugField(n);
          return customSlug === slug;
        });

        if (!found) {
          found = list.find((n) => toSlug(n.Title) === slug);
        }

        if (!found) {
          found = list.find((n) => String(n.documentId ?? n.id) === slug);
        }

        if (!found) {
          setError("Article not found");
          return;
        }

        const imageUrl = extractImageUrl(found.Image);

        const detail: NewsDetailWithUpdated = {
          id: found.id,
          title: found.Title,
          slug:
            found.SlugURL?.trim() || toSlug(found.Title) || String(found.id),
          dateISO: found.Date,
          author: found.Author ?? undefined,
          imageUrl: imageUrl || "/placeholder.svg",
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
      } catch (err) {
        console.error("Error loading news:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load news";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [pathname, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>

          {/* Only show debug info in development */}
          {isDev && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded text-left text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Pathname: {pathname}</p>
              <p>Extracted slug: {slug}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
            </div>
          )}

          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mt-4"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested news article could not be found.
          </p>

          {/* Only show debug info in development */}
          {isDev && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded text-left text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Pathname: {pathname}</p>
              <p>Extracted slug: {slug}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
            </div>
          )}

          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mt-4"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  // Ensure imgSrc is always a string
  const imgSrc: string = imageError
    ? "/placeholder.svg"
    : news.imageUrl || "/placeholder.svg";

  const imgAlt = news.title;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          href="/news"
          className="text-red-600 hover:underline mb-6 inline-block"
        >
          ← Quay lại tin tức
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <header className="bg-red-600 text-white px-6 md:px-8 py-8 md:py-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              {news.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-red-100">
              <time>{formatDate(news.dateISO)}</time>
              <span>{news.author ?? "-"}</span>
            </div>
          </header>

          {/* Image container with fallback */}
          <div className="relative w-full h-full md:h-96 bg-gray-200">
            <Image
              src={imgSrc}
              alt={imgAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              style={{ objectFit: "contain" }}
              onError={() => setImageError(true)}
              unoptimized={true}
              priority
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-gray-500">Image not available</div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 space-y-8">
            {news.sections.map((sec) => (
              <section key={sec.id} id={`sec-${sec.id}`} className="mb-8">
                {sec.title && (
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                    {sec.title}
                  </h2>
                )}
                <div className="bg-gray-100 p-4 md:p-6 rounded-lg">
                  <div className="text-gray-700 leading-relaxed prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{ a: (props) => <LinkRenderer {...props} /> }}
                    >
                      {sec.content ?? ""}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            ))}

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-gray-500">
                Cập nhật: {formatDate(news.updatedAt)}
              </span>
              <Link
                href="/news"
                className="text-red-600 hover:underline inline-block"
              >
                ← Xem thêm tin tức
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
