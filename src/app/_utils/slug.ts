// app/_utils/slug.ts
// Pure JS slugify — không cần package ngoài.
// Nó sẽ:
// - lowercase
// - normalize unicode -> remove diacritics
// - thay mọi ký tự không phải a-z0-9 bằng dấu '-'
// - collapse nhiều '-' liên tiếp
// - trim '-' 2 đầu

export function normalizeSlug(input?: string | null): string {
  if (!input) return "";
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // non-alnum -> hyphen
    .replace(/-{2,}/g, "-") // collapse hyphens
    .replace(/(^-|-$)/g, ""); // trim leading/trailing hyphen
}

/**
 * slugForItem: ưu tiên trường SlugURL (nếu có) — nhưng chuẩn hoá nó;
 * nếu không có -> sinh từ Title (hoặc fallback documentId)
 *
 * item: object có thể là News hoặc Service
 */
export function slugForItem(item: {
  SlugURL?: string | null;
  Title?: string;
  serviceName?: string;
  documentId?: string;
}) {
  // nếu admin nhập SlugURL mà muốn dùng nguyên văn (không chuẩn hoá),
  // đổi policy: dùng raw nếu bạn thật sự cần. Ở đây mình chuẩn hoá để nhất quán.
  const raw = (item.SlugURL ?? "") || (item.Title ?? item.serviceName ?? "");
  const s = normalizeSlug(raw);
  return s || (item.documentId ? String(item.documentId) : "");
}
