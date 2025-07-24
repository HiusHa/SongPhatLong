import type { StrapiProduct } from "@/app/types/product";

// Utility functions cho slug
export function createSlugFromName(name: string): string {
  if (!name) return "";

  return (
    name
      .toString()
      .toLowerCase()
      .trim()
      // Thay thế ký tự tiếng Việt
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d")
      // Thay thế ký tự đặc biệt
      .replace(/[^a-z0-9 -]/g, "")
      // Thay thế khoảng trắng và dấu gạch ngang liên tiếp
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      // Xóa dấu gạch ngang ở đầu và cuối
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  );
}

// Function để tạo URL cho product (ưu tiên SlugURL, fallback về auto-generated)
export function getProductUrl(product: StrapiProduct): string {
  // 1. Ưu tiên SlugURL nếu có (từ Strapi)
  if (product.SlugURL && product.SlugURL.trim()) {
    return `/products/${product.SlugURL}`;
  }

  // 2. Nếu không có SlugURL, tự động tạo từ tên
  if (product.name) {
    const autoSlug = createSlugFromName(product.name);
    if (autoSlug) {
      return `/products/${autoSlug}`;
    }
  }

  // 3. Cuối cùng fallback về documentId
  return `/products/${product.documentId}`;
}

// Function để tìm product theo slug
export function findProductBySlug(
  products: StrapiProduct[],
  slug: string
): StrapiProduct | null {
  if (!products || !slug) return null;

  // 1. Tìm theo SlugURL chính thức trước
  let product = products.find((p: StrapiProduct) => p.SlugURL === slug);
  if (product) return product;

  // 2. Tìm theo auto-generated slug
  product = products.find((p: StrapiProduct) => {
    const autoSlug = createSlugFromName(p.name);
    return autoSlug === slug;
  });
  if (product) return product;

  // 3. Tìm theo documentId (backward compatibility)
  product = products.find((p: StrapiProduct) => p.documentId === slug);
  if (product) return product;

  return null;
}

// Function để tạo product slug cho SEO
export function createProductSlug(name: string, documentId: string): string {
  const nameSlug = createSlugFromName(name);
  return nameSlug || documentId;
}

// Type guard để kiểm tra xem object có phải là StrapiProduct không
export function isStrapiProduct(obj: unknown): obj is StrapiProduct {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "documentId" in obj &&
    "name" in obj &&
    typeof (obj as Record<string, unknown>).name === "string"
  );
}

// Function để validate slug format
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;

  // Slug chỉ chứa chữ cái thường, số, và dấu gạch ngang
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 200;
}

// Function để tạo unique slug (tránh trùng lặp)
export function createUniqueSlug(
  name: string,
  existingSlugs: string[]
): string {
  const baseSlug = createSlugFromName(name);
  if (!baseSlug) return "";

  let uniqueSlug = baseSlug;
  let counter = 1;

  // Kiểm tra và thêm số nếu slug đã tồn tại
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

// Function để extract slug từ URL
export function extractSlugFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const match = url.match(/\/products\/([^/?#]+)/);
  return match ? match[1] : null;
}

// Function để tạo breadcrumb từ product
export function createProductBreadcrumb(
  product: StrapiProduct
): Array<{ name: string; href: string }> {
  return [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    {
      name: product.categories?.[0]?.name || "Danh mục",
      href: `/products?category=${product.categories?.[0]?.documentId || ""}`,
    },
    { name: product.name, href: getProductUrl(product) },
  ];
}
