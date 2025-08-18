import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://songphatlong.com",
      lastModified: new Date(),
    },

    // Ví dụ: thêm route động từ API hoặc DB
    // {
    //   url: `https://yourdomain.com/post/${slug}`,
    //   lastModified: new Date(),
    // }
  ];
}
