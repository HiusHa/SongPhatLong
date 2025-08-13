// app/news/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";

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
  Image?: {
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
  ContentSection: ContentSection[];
};

type ApiResp<T> = { data: T[]; meta?: unknown };

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

/* RenderContent: parse bold, images, links; external links open new tab */
type HtmlPart = { type: "html"; content: string };
type ImgPart = { type: "img"; alt: string; url: string };
type LinkPart = { type: "link"; text: string; url: string };
type Part = HtmlPart | ImgPart | LinkPart;

function RenderContent({ raw }: { raw: string }) {
  const paras = raw.split(/\n{1,2}/).filter((p) => p.trim());

  const IMAGE_MD_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const LINK_MD_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
  const BOLD_MD = /\*\*([^*]+)\*\*/g;

  return (
    <div className="space-y-6">
      {paras.map((para, idx) => {
        const bolded = para.replace(
          BOLD_MD,
          (_m, txt) => `<strong>${txt}</strong>`
        );
        const combined = new RegExp(
          `${IMAGE_MD_RE.source}|${LINK_MD_RE.source}`,
          "g"
        );
        const parts: Part[] = [];

        let lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = combined.exec(bolded))) {
          const match = m[0];
          const imgAlt = m[1];
          const imgUrl = m[2];
          const linkText = m[3];
          const linkUrl = m[4];

          if (m.index > lastIndex) {
            parts.push({
              type: "html",
              content: bolded.slice(lastIndex, m.index),
            });
          }

          if (imgUrl && imgAlt !== undefined) {
            parts.push({ type: "img", alt: imgAlt, url: imgUrl });
          } else if (linkText && linkUrl) {
            parts.push({ type: "link", text: linkText, url: linkUrl });
          }

          lastIndex = m.index + match.length;
        }

        if (lastIndex < bolded.length) {
          parts.push({ type: "html", content: bolded.slice(lastIndex) });
        }

        return (
          <div key={idx} className="text-gray-700 leading-relaxed">
            {parts.map((p, i) => {
              if (p.type === "html") {
                return (
                  <span
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: p.content.replace(/\n/g, "<br/>"),
                    }}
                  />
                );
              }

              if (p.type === "img") {
                return (
                  <div key={i} className="my-4">
                    <Image
                      src={p.url}
                      alt={p.alt || ""}
                      width={800}
                      height={600}
                      className="w-full rounded-lg object-contain"
                      unoptimized
                    />
                  </div>
                );
              }

              // link
              if (p.type === "link") {
                let href = p.url;
                let text = p.text;

                // nếu label chỉ là "link" hoặc trùng URL, hiển thị hostname
                const lower = text.toLowerCase().trim();
                try {
                  if (lower === "link" || lower === href) {
                    const u = new URL(href);
                    text = u.hostname.replace(/^www\./, "");
                  }
                } catch {
                  // not a url -> keep original
                }

                // swap nếu người nhập [url](label)
                if (!/^https?:\/\//i.test(href) && /^https?:\/\//i.test(text)) {
                  [href, text] = [text, href];
                }

                return (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline break-all"
                  >
                    {text}
                  </a>
                );
              }

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function NewsDetailPage() {
  const params = useParams() as { slug?: string | string[] };
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const router = useRouter();

  const [item, setItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const resp = (await api.getNews()) as AxiosResponse<
          ApiResp<NewsDetail>
        >;
        const payload = resp?.data;
        const all: NewsDetail[] = Array.isArray(resp as unknown as NewsDetail[])
          ? (resp as unknown as NewsDetail[])
          : payload?.data ?? [];

        // 1) custom SlugURL
        let found = all.find((n) => n.SlugURL && n.SlugURL.trim() === slug);

        // 2) auto slugify Title
        if (!found) {
          found = all.find((n) => slugify(n.Title) === slug);
        }

        // 3) fallback documentId or id
        if (!found) {
          found = all.find(
            (n) => n.documentId === slug || String(n.id) === slug
          );
        }

        if (!found) {
          router.replace("/news");
        } else {
          setItem(found);
        }
      } catch (err) {
        console.error("Fetch news error:", err);
        router.replace("/news");
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

  if (!item) return null;

  const imgUrl = item.Image?.formats?.large?.url || item.Image?.url;

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

        {imgUrl && (
          <div className="my-8 mx-8 rounded-lg overflow-hidden">
            <Image
              src={imgUrl}
              alt={item.Image?.alternativeText || item.Title}
              width={item.Image?.width || 1200}
              height={item.Image?.height || 600}
              className="object-cover w-full"
              unoptimized
            />
          </div>
        )}

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
              Cập nhật:{" "}
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString("vi-VN")
                : ""}
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
