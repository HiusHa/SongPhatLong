// app/lib/api.ts

// --- Bases ---
const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";
const SERVER_BASE =
  process.env.STRAPI_URL || // <- ưu tiên server-only cho SSR/metadata
  PUBLIC_BASE;

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/** Nối base + path, đảm bảo tuyệt đối và không bị // hoặc thiếu /. */
function buildUrl(base: string, path: string): string {
  if (!path) return base;
  // nếu path đã là absolute (http/https) thì dùng nguyên vẹn
  if (/^https?:\/\//i.test(path)) return path;

  // chuẩn hoá slash
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/** Ảnh/media từ Strapi -> URL tuyệt đối (server: dùng SERVER_BASE, client: dùng PUBLIC_BASE). */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const isServer = typeof window === "undefined";
  const base = isServer ? SERVER_BASE : PUBLIC_BASE;
  return buildUrl(base, url);
}

type JsonInit = RequestInit & {
  /** Mặc định 'no-store' để SEO luôn mới; đổi nếu bạn cần cache. */
  cache?: RequestCache;
};

/**
 * Fetch JSON tiện lợi cho Strapi:
 * - Server: dùng SERVER_BASE tuyệt đối (bắt buộc cho metadata SSR).
 * - Client: dùng PUBLIC_BASE.
 * - Gắn Bearer token CHỈ ở server.
 * - Tự set Accept: application/json.
 */
export async function fetchJSON<T>(
  path: string,
  init: JsonInit = {}
): Promise<T> {
  if (!PUBLIC_BASE && !SERVER_BASE) {
    throw new Error(
      "[api.ts] Missing STRAPI_URL / NEXT_PUBLIC_API_URL / NEXT_PUBLIC_STRAPI_URL"
    );
  }

  const isServer = typeof window === "undefined";
  const base = isServer ? SERVER_BASE : PUBLIC_BASE;

  if (!base) {
    // Trường hợp SSR mà không có SERVER_BASE sẽ làm metadata fail.
    if (isServer) {
      throw new Error("[api.ts] SERVER_BASE is empty on server runtime.");
    }
  }

  const url = buildUrl(base, path);

  // Chuẩn hoá headers
  const headers = new Headers(init.headers);

  // CHỈ server mới gắn token để tránh lộ trên client
  if (isServer && STRAPI_TOKEN && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);
  }

  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  // Mặc định không cache để đảm bảo SEO luôn lấy dữ liệu mới
  const cache = init.cache ?? "no-store";

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      cache,
      // keepalive giúp dev đỡ báo aborted khi điều hướng nhanh (tuỳ chọn)
      keepalive: true,
    });
  } catch (e: any) {
    // Log chi tiết hơn trong dev
    if (process.env.NODE_ENV !== "production") {
      console.error(`[api.ts] Fetch error ${url}:`, e?.message || e);
    }
    throw e;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const msg = `[api.ts] ${res.status} ${res.statusText} @ ${url}${
      body ? ` | ${body}` : ""
    }`;
    // Log rõ ở server để dễ debug metadata
    if (isServer) console.error(msg);
    throw new Error(msg);
  }

  // JSON parse error -> ném ra để thấy ngay
  try {
    return (await res.json()) as T;
  } catch (e: any) {
    const msg = `[api.ts] JSON parse error @ ${url}: ${e?.message || e}`;
    if (isServer) console.error(msg);
    throw e;
  }
}
