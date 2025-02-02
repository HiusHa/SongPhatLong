export type NewsDetail = {
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
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: {
      public_id: string;
      resource_type: string;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  ContentSection: Array<{
    id: number;
    SectionTitle: string;
    SectionContent: Array<{
      type: string;
      children: Array<{
        text: string;
        type: string;
      }>;
    }>;
  }>;
};

type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
};
