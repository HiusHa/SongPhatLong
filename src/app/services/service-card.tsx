"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { StrapiService } from "../types/service";

interface ServiceCardProps {
  service: StrapiService & { __slug: string };
  slug: string;
}

export function ServiceCard({ service, slug }: ServiceCardProps) {
  const [imgErr, setImgErr] = useState(false);

  const imgUrl =
    !imgErr && service.serviceImage?.[0]?.url
      ? service.serviceImage[0].url
      : `/placeholder.svg?text=${encodeURIComponent(
          service.serviceName
        )}&height=300&width=300`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Link href={`/services/${slug}`} className="group block h-full">
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-square w-full">
            <Image
              src={imgUrl}
              alt={service.serviceName}
              fill
              className="object-cover"
              onError={() => setImgErr(true)}
              unoptimized
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-center">
              {service.serviceName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
