// lib/news.ts
export type StrapiImageFormat = {
  url: string;
  width?: number;
  height?: number;
};

export type StrapiImage = {
  url: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
};

export type StrapiNewsItem = {
  id: number;
  Title: string;
  Date: string;
  Author?: string | null;
  documentId?: string;
  SlugURL?: string | null;
  Image?: StrapiImage | null;
  ContentSection?: Array<{
    id: number;
    SectionTitle?: string | null;
    SectionContent?: string | null;
  }>;
};

export type StrapiListResponse<T> = {
  data: T[];
  meta?: unknown;
};

export type NewsCardItem = {
  id: number;
  title: string;
  slug: string; // dùng cho route
  dateISO: string;
  author?: string;
  imageUrl?: string;
  updatedAt?: string | null; // cho phép null như Strapi đưa
};

export type NewsDetail = NewsCardItem & {
  sections: Array<{ id: number; title?: string; content?: string }>;
};

export function firstImageUrl(img?: StrapiImage | null) {
  return (
    img?.formats?.medium?.url ||
    img?.formats?.large?.url ||
    img?.formats?.small?.url ||
    img?.url
  );
}
