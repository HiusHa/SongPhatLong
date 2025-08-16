// app/api/news/route.ts
import "dotenv/config";

export async function GET() {
  const base = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!base) {
    return new Response(JSON.stringify({ error: "Missing env STRAPI_URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Có thể bổ sung filters/publicationState nếu cần
  const url = `${base}/api/news?populate=*`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // cache: "no-store", // bật nếu muốn luôn tươi
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
