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

export interface ProductImage {
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
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  url: string;
}

export interface CategoryObject {
  id: number;
  name: string;
}

export type ProductCategory = string | CategoryObject[] | null;

export interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  description: Array<{
    type: string;
    children: Array<{
      text: string;
      type: string;
    }>;
  }>;
  pricing: number;
  originalPrice?: number;
  createdAt: string;
  productID: string | null;

  updatedAt: string;
  publishedAt: string;
  image: ProductImage;
  image2: ProductImage | null;
  image3: ProductImage | null;
  image4: ProductImage | null;
  image5: ProductImage | null;
  category: string | CategoryObject[] | null;
  brand: string | null;
  origin: string | null;
}

export interface StrapiResponse {
  data: StrapiProduct[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
