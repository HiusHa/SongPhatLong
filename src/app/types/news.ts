// src/types/news.ts
export type ImageFormat = {
  url: string;
  ext?: string | null;
  width?: number;
  height?: number;
  size?: number;
  sizeInBytes?: number;
  mime?: string;
};

export type ImageObject = {
  id?: number;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: ImageFormat;
    medium?: ImageFormat;
    small?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash?: string;
  ext?: string | null;
  mime?: string;
  size?: number;
  url?: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

export type NewsDetail = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  Image?: ImageObject | null;
  ContentSection: ContentSection[];
};

export type NewsListItem = Pick<
  NewsDetail,
  "id" | "documentId" | "SlugURL" | "Title" | "Date" | "Author" | "Image"
>;

export type ApiResp<T> = { data: T[]; meta?: unknown };
