"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";

type ContentChild = {
  text: string;
  type: string;
};

type ContentBlock = {
  type: string;
  children: ContentChild[];
};

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

function RenderContent({ jsonContent }: { jsonContent: string }) {
  try {
    const content: ContentBlock[] = JSON.parse(jsonContent);

    return (
      <div className="space-y-6">
        {content.map((block, index) => {
          if (block.type === "paragraph") {
            return (
              <p key={index} className="text-gray-700 leading-relaxed text-lg">
                {block.children.map((child, childIndex) => (
                  <span key={childIndex}>{child.text}</span>
                ))}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  } catch (error) {
    console.error("Error parsing content:", error);
    return (
      <p className="text-gray-700 text-lg leading-relaxed">{jsonContent}</p>
    );
  }
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
        console.log("All news response:", response);

        const newsItem = response.data.data.find(
          (item: NewsDetail) => item.documentId === documentId
        );

        console.log("Found news item:", newsItem);
        setNews(newsItem || null);

        if (!newsItem) {
          setError("Không tìm thấy bài viết");
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
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
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại tin tức
          </Link>
        </nav>

        <article className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-12 mb-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {news.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Ngày đăng</p>
                    <time className="font-semibold">
                      {new Date(news.Date).toLocaleDateString("vi-VN")}
                    </time>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Tác giả</p>
                    <span className="font-semibold">{news.Author}</span>
                  </div>
                </div>
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
                  "/placeholder.svg?height=600&width=800" ||
                  "/placeholder.svg"
                }
                alt={news.Image.alternativeText || news.Title}
                width={news.Image.width || 800}
                height={news.Image.height || 600}
                className="w-full h-auto object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Table of Contents */}
            {news.ContentSection && news.ContentSection.length > 0 && (
              <nav className="mb-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Nội dung bài viết
                  </h2>
                </div>
                <ul className="grid gap-3">
                  {news.ContentSection.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#section-${section.id}`}
                        className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-red-200"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-red-700 transition-colors">
                          {index + 1}
                        </span>
                        <span className="text-red-700 group-hover:text-red-800 font-medium transition-colors">
                          {section.SectionTitle}
                        </span>
                        <svg
                          className="w-4 h-4 text-red-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Content Sections */}
            <div className="space-y-16">
              {news.ContentSection &&
                news.ContentSection.map((section, index) => (
                  <section
                    key={section.id}
                    id={`section-${section.id}`}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 flex-1">
                        {section.SectionTitle}
                      </h2>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-red-600">
                      <RenderContent jsonContent={section.SectionContent} />
                    </div>
                  </section>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Cập nhật lần cuối:{" "}
                    {new Date(news.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <Link
                  href="/news"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Xem thêm tin tức
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
