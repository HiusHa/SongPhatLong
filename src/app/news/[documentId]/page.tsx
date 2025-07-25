"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";

type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

type NewsDetail = {
  id: number;
  documentId: string;
  Title: string;
  Date: string;
  Author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    url: string;
    width: number;
    height: number;
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
  ContentSection: ContentSection[];
};

const IMAGE_MD_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;

function RenderContent({ raw }: { raw: string }) {
  // Tách raw thành các paragraph (theo dấu xuống dòng đôi hoặc đơn)
  const paragraphs = raw.split(/\n{1,2}/).filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-6">
      {paragraphs.map((para, idx) => {
        // với mỗi paragraph, tách ra các phần text / image
        const parts: Array<
          | { type: "text"; content: string }
          | { type: "img"; alt: string; url: string }
        > = [];
        let lastIndex = 0;
        let m: RegExpExecArray | null;

        IMAGE_MD_RE.lastIndex = 0;
        while ((m = IMAGE_MD_RE.exec(para)) !== null) {
          if (m.index > lastIndex) {
            parts.push({
              type: "text",
              content: para.slice(lastIndex, m.index),
            });
          }
          parts.push({ type: "img", alt: m[1], url: m[2] });
          lastIndex = m.index + m[0].length;
        }
        if (lastIndex < para.length) {
          parts.push({ type: "text", content: para.slice(lastIndex) });
        }

        return (
          <div
            key={idx}
            className="text-gray-700 leading-relaxed text-lg space-y-4"
          >
            {parts.map((p, i) =>
              p.type === "text" ? (
                <span key={i}>{p.content}</span>
              ) : (
                <div key={i} className="my-4">
                  <Image
                    src={p.url}
                    alt={p.alt || ""}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NewsDetailPage() {
  const { documentId } = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        if (!documentId) return;
        const response = await api.getNews();
        const item = response.data.data.find(
          (n: NewsDetail) => n.documentId === documentId
        );
        setNews(item || null);
        if (!item) setError("Không tìm thấy bài viết");
      } catch (err) {
        console.error(err);
        setError("Không thể tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewsDetail();
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Bài viết không tồn tại hoặc đã bị xóa"}
          </p>
          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Quay lại danh sách tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-medium"
          >
            ← Quay lại tin tức
          </Link>
        </nav>

        <article className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-12 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {news.Title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-red-100">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time className="font-semibold">
                  {new Date(news.Date).toLocaleDateString("vi-VN")}
                </time>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-semibold">{news.Author}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {news.Image && (
            <div className="mx-8 mt-8 mb-8 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={
                  news.Image.formats?.large?.url ||
                  news.Image.url ||
                  "/placeholder.svg?height=600&width=800"
                }
                alt={news.Image.alternativeText || news.Title}
                width={news.Image.width || 800}
                height={news.Image.height || 600}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Table of Contents */}
            {news.ContentSection.length > 0 && (
              <nav className="mb-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Nội dung bài viết
                </h2>
                <ul className="space-y-3">
                  {news.ContentSection.map((sec, i) => (
                    <li key={sec.id}>
                      <a
                        href={`#section-${sec.id}`}
                        className="flex items-center gap-3 text-red-700 hover:underline"
                      >
                        {i + 1}. {sec.SectionTitle}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Content Sections */}
            <div className="space-y-16">
              {news.ContentSection.map((sec, i) => (
                <section
                  key={sec.id}
                  id={`section-${sec.id}`}
                  className="scroll-mt-24"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {i + 1}. {sec.SectionTitle}
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-red-600">
                    <RenderContent raw={sec.SectionContent} />
                  </div>
                </section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Cập nhật lần cuối:{" "}
                  {new Date(news.updatedAt).toLocaleDateString("vi-VN")}
                </span>
                <Link
                  href="/news"
                  className="text-red-600 hover:underline font-medium"
                >
                  ← Xem thêm tin tức
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
