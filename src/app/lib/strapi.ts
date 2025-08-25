// app/lib/strapi.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  "";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

type FetchOpts = {
  next?: RequestInit["next"];
  cache?: RequestInit["cache"];
};

export async function fetchStrapi<T = any>(
  path: string,
  opts: FetchOpts = {}
): Promise<T> {
  if (!API_BASE) {
    throw new Error("Missing STRAPI base URL (NEXT_PUBLIC_API_URL).");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Có token thì thêm Bearer cho private/protected API
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers,
    cache: opts.cache ?? "no-store",
    next: opts.next,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${url} -> ${res.status}${body ? " | " + body : ""}`);
  }
  return res.json();
}
