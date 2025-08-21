// utils/slugtify.ts
export const toSlug = (s: string) =>
  s
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function getProductUrl(p: {
  SlugURL?: string | null;
  documentId?: string;
  id?: number;
  name?: string;
}) {
  // Ưu tiên SlugURL; nếu null → dùng documentId; nếu thiếu nữa → slugify từ name; cuối cùng dùng id
  const slug =
    (p.SlugURL && String(p.SlugURL)) ||
    (p.documentId && String(p.documentId)) ||
    (p.name ? toSlug(p.name) : undefined) ||
    (p.id !== undefined ? String(p.id) : undefined);

  return slug ? `/products/${slug}` : "/products";
}
