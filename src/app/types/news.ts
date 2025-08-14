// src/types/news.ts
export type ImageFormats = {
  large?: { url: string };
  medium?: { url: string };
  small?: { url: string };
  thumbnail?: { url: string };
};

export type ImageType = {
  id: number;
  url: string;
  formats?: ImageFormats;
  name?: string;
};

export type ContentSection = {
  id: number;
  SectionTitle?: string;
  SectionContent?: string;
};

export type NewsItem = {
  id: number;
  documentId?: string | null;
  Title: string;
  Date?: string;
  Author?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  SlugURL?: string | null;
  Image?: ImageType | null;
  ContentSection?: ContentSection[];
};
