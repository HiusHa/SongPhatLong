// app/services/service-card.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import type { StrapiService } from "@/app/types/service";

interface Props {
  service: StrapiService & { __slug?: string };
  slug: string;
}

export function ServiceCard({ service, slug }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const title = service.serviceName ?? "Dịch vụ";
  const imgUrl =
    !imgErr && service.serviceImage?.[0]?.url
      ? service.serviceImage[0].url
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
        className="group block h-full"
      >
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-square w-full">
            <Image
              src={imgUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImgErr(true)}
              unoptimized
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-center">{title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
