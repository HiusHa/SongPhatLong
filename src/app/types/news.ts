// src/app/types/news.ts

export type ImageFormat = {
  url: string;
  width?: number;
  height?: number;
  ext?: string;
  mime?: string;
  size?: number;
  // thêm các trường khác nếu cần (provider_metadata, hash,...)
  [key: string]: unknown;
};

export type ImageFormats = {
  large?: ImageFormat;
  medium?: ImageFormat;
  small?: ImageFormat;
  thumbnail?: ImageFormat;
  // nếu Strapi có thêm keys, còn safe vì index signature ở ImageFormat
};

export type NewsImage = {
  id?: number;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: ImageFormats;
  url: string;
  previewUrl?: string | null;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
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
  Author: string;
  updatedAt: string;
  Image?: NewsImage;
  ContentSection: ContentSection[];
};
