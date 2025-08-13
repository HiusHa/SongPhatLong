"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/app/_utils/globalApi";
import { Loader } from "@/components/loader";

type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

type NewsDetail = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author: string;
  updatedAt: string;
  Image: {
    alternativeText: string | null;
    url: string;
    width: number;
    height: number;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
  ContentSection: ContentSection[];
};

type ApiResponseData = { data: NewsDetail[] } | null;

// slugify giống trang products (loại bỏ dấu tiếng Việt, ký tự lạ -> '-')
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Regex
const IMAGE_MD = /!\[([^\]]*)\]\(([^)]+)\)/g;
const LINK_MD = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_MD = /\*\*([^*]+)\*\*/g;

function RenderContent({ raw }: { raw: string }) {
  const paras = raw.split(/\n{1,2}/).filter((p) => p.trim());
  return (
    <div className="space-y-6">
      {paras.map((para, idx) => {
        // convert **bold** -> <strong> just for inner HTML usage
        const boldConverted = para.replace(
          BOLD_MD,
          (_, txt) => `__BOLD_START__${txt}__BOLD_END__`
        );

        // We'll process images and links in order of appearance.
        const combined = new RegExp(
          `${IMAGE_MD.source}|${LINK_MD.source}`,
          "g"
        );
        const parts: Array<
          | { type: "text"; content: string }
          | { type: "img"; alt: string; url: string }
          | { type: "link"; text: string; url: string }
        > = [];

        let lastIndex = 0;
        let m: RegExpExecArray | null;

        while ((m = combined.exec(boldConverted))) {
          const matchIndex = m.index;
          const match = m[0];

          if (matchIndex > lastIndex) {
            parts.push({
              type: "text",
              content: boldConverted.slice(lastIndex, matchIndex),
            });
          }

          // m looks like either [imgAlt,imgUrl,undef,undef] or [undef,undef,linkText,linkUrl]
          const imgAlt = m[1];
          const imgUrl = m[2];
          const linkText = m[3];
          const linkUrl = m[4];

          if (imgUrl && imgAlt !== undefined) {
            parts.push({ type: "img", alt: imgAlt, url: imgUrl });
          } else if (linkText && linkUrl) {
            parts.push({ type: "link", text: linkText, url: linkUrl });
          }

          lastIndex = matchIndex + match.length;
        }

        if (lastIndex < boldConverted.length) {
          parts.push({
            type: "text",
            content: boldConverted.slice(lastIndex),
          });
        }

        // Render parts: replace our __BOLD markers with <strong> using dangerouslySetInnerHTML only for small fragments
        return (
          <div key={idx} className="text-gray-700 leading-relaxed text-lg">
            {parts.map((p, i) => {
              if (p.type === "text") {
                // restore bold markers to <strong>
                const withStrong = p.content
                  .replace(/__BOLD_START__/g, "<strong>")
                  .replace(/__BOLD_END__/g, "</strong>");
                // Use dangerouslySetInnerHTML just for this fragment (it's coming from CMS)
                return (
                  <span
                    key={i}
                    dangerouslySetInnerHTML={{ __html: withStrong }}
                  />
                );
              }

              if (p.type === "img") {
                // image
                return (
                  <div key={i} className="my-4">
                    <Image
                      src={p.url}
                      alt={p.alt}
                      width={800}
                      height={600}
                      className="w-full rounded-lg object-contain"
                      unoptimized
                    />
                  </div>
                );
              }

              // link
              // robustly determine which side is absolute URL
              let href = p.url;
              let text = p.text;

              const isHrefAbsolute =
                /^https?:\/\//i.test(href) ||
                /^mailto:/i.test(href) ||
                /^tel:/i.test(href);
              const isTextAbsolute =
                /^https?:\/\//i.test(text) ||
                /^mailto:/i.test(text) ||
                /^tel:/i.test(text);

              if (!isHrefAbsolute && isTextAbsolute) {
                // common CMS mistake: [https://...](link)
                href = text;
                text = p.url;
              }

              // If label is literally "link" or empty, show friendly label (domain) instead of raw 'link'
              if (text.trim().toLowerCase() === "link" || text.trim() === "") {
                try {
                  const u = new URL(href);
                  text = u.hostname.replace(/^www\./, "");
                } catch {
                  text = href;
                }
              }

              // If still not absolute, treat as external by prefixing https:// if it looks like a domain
              if (
                !/^https?:\/\//i.test(href) &&
                /^[\w.-]+\.[a-z]{2,}/i.test(href)
              ) {
                href = "https://" + href;
              }

              // Render anchor; use plain <a> (not Next <Link>) so navigation to external absolute URL opens outside
              const isExternal =
                /^https?:\/\//i.test(href) ||
                /^mailto:/i.test(href) ||
                /^tel:/i.test(href);

              return (
                <a
                  key={i}
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-red-600 hover:underline break-words"
                >
                  {text}
                </a>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // call API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resp = (await api.getNews()) as any;
        // Strapi axios shape: resp.data.data => array
        const payload: ApiResponseData =
          resp && resp.data && "data" in resp.data ? resp.data : resp.data;

        const all: NewsDetail[] = (payload && payload.data) || [];

        // attach auto slug so we can match like product logic
        const withAuto = all.map((n) => ({
          ...n,
          __autoSlug:
            (n.SlugURL && String(n.SlugURL).trim()) || slugify(n.Title),
        }));

        // 1) match SlugURL exact
        let found = withAuto.find((n) => {
          // if SlugURL exists and equals slug
          const rawSlug = n.SlugURL;
          return rawSlug && String(rawSlug).trim() === slug;
        }) as (NewsDetail & { __autoSlug?: string }) | undefined;

        // 2) match auto-generated slug
        if (!found) {
          found = withAuto.find((n) => n.__autoSlug === slug);
        }

        // 3) fallback to documentId
        if (!found) {
          found = withAuto.find((n) => n.documentId === slug);
        }

        if (!found) {
          // not found — navigate back to list (or show not found UI)
          setApiError("Không tìm thấy bài viết (slug không khớp).");
          setTimeout(() => router.replace("/news"), 1400);
        } else {
          setItem(found);
        }
      } catch (err: unknown) {
        // show server error message and console full object for debugging
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = err as any;
        console.error("Failed fetching news detail:", e);
        if (e?.response) {
          setApiError(
            `Server error: ${e.response.status} - ${JSON.stringify(
              e.response.data?.error || e.response.data || e.message
            )}`
          );
        } else {
          setApiError(String(e?.message || e));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Lỗi khi tải bài viết</h2>
          <p className="text-sm text-gray-600 mb-4">{apiError}</p>
          <div className="flex justify-center gap-4">
            <Link href="/news" className="text-red-600 hover:underline">
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy bài viết.</p>
          <Link
            href="/news"
            className="text-red-600 hover:underline mt-4 block"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>

      <article className="bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{item.Title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>{new Date(item.Date).toLocaleDateString("vi-VN")}</time>
            <span>{item.Author}</span>
          </div>
        </div>

        <div className="my-8 mx-8 rounded-lg overflow-hidden">
          <Image
            src={item.Image.formats?.large?.url || item.Image.url}
            alt={item.Image.alternativeText || item.Title}
            width={item.Image.width}
            height={item.Image.height}
            className="object-cover w-full"
            unoptimized
          />
        </div>

        <div className="p-8 space-y-16">
          {item.ContentSection.map((sec, idx) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              <h2 className="text-2xl font-bold mb-4">
                {idx + 1}. {sec.SectionTitle}
              </h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <RenderContent raw={sec.SectionContent} />
              </div>
            </section>
          ))}

          <div className="mt-16 pt-8 border-t flex justify-between">
            <span className="text-gray-500">
              Cập nhật: {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
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
