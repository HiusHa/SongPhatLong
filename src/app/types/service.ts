interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
  sizeInBytes?: number;
}

export interface ServiceImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
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
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiService {
  __slug?: string;
  slugURL?: string;
  slug?: string;
  id: number;
  documentId: string;
  serviceName: string;
  description: Array<{
    type: string;
    children: Array<{
      text: string;
      type: string;
    }>;
  }>;
  step1: string;
  text1Description: string;
  step2: string;
  step2Description: string;
  step3: string;
  step3Description: string;
  step4: string;
  step4Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  serviceImage: ServiceImage[];
}

export interface StrapiResponse {
  data: StrapiService[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
