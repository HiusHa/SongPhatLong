// app/lib/api.ts
const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";
const SERVER_BASE = process.env.STRAPI_URL || PUBLIC_BASE;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function fetchJSON<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!PUBLIC_BASE && !SERVER_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_URL / STRAPI_URL");
  }

  const isServer = typeof window === "undefined";
  const base = isServer ? SERVER_BASE : PUBLIC_BASE;

  // ✅ Luôn chuẩn hoá về Headers rồi mới set
  const headers = new Headers(init.headers);

  // Chỉ server mới gắn token (tránh lộ trên client)
  if (isServer && STRAPI_TOKEN && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);
  }

  // Chỉ set Accept, còn Content-Type để fetch tự xử lý (GET không cần)
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} -> ${res.status}${body ? " | " + body : ""}`);
  }
  return res.json() as Promise<T>;
}
