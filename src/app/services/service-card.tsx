// app/services/service-card.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { StrapiService } from "@/app/types/service";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

function resolveMediaUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

interface Props {
  service: (StrapiService & { __slug?: string }) | { [k: string]: any };
  slug: string;
}

export function ServiceCard({ service, slug }: Props) {
  const [imgErr, setImgErr] = useState(false);

  const title =
    (service as any).serviceName ?? (service as any).name ?? "Dịch vụ";

  const img0 = Array.isArray((service as any).serviceImage)
    ? (service as any).serviceImage[0]
    : undefined;

  const imgUrlRaw = img0?.url ? resolveMediaUrl(img0.url) : undefined;

  const imgUrl =
    !imgErr && imgUrlRaw
      ? imgUrlRaw
      : `/placeholder.svg?text=${encodeURIComponent(
          title
        )}&height=300&width=300`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link
        href={`/services/${encodeURIComponent(slug)}`}
        prefetch={false}
        className="group block h-full"
      >
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-square w-full bg-gray-50">
            <Image
              src={imgUrl}
              alt={img0?.alternativeText || title}
              fill
              className="object-cover"
              onError={() => setImgErr(true)}
              unoptimized
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-center line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
