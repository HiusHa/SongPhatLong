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

export interface Category {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Update the text node interface to include bold and italic properties
interface TextNode {
  text: string;
  type: string;
  bold?: boolean;
  italic?: boolean;
}

export interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  description: Array<{
    type: string;
    children: TextNode[];
  }>;
  pricing: number;
  originalPrice?: number;
  createdAt: string;
  productID: string | null;
  updatedAt: string;
  publishedAt: string;
  image: ProductImage;
  image2: ProductImage[] | ProductImage | null;
  image3: ProductImage[] | ProductImage | null;
  image4: ProductImage[] | ProductImage | null;
  image5: ProductImage[] | ProductImage | null;
  categories: Category[];
  brand: string | null;
  origin: string | null;
  rating?: number;
  bought?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
