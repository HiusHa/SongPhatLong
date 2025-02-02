import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StrapiService } from "../types/service";
import Image from "next/image";

interface ServiceCardProps {
  service: StrapiService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log("Service data:", service);
    console.log("Service image data:", service.serviceImage);
  }, [service]);

  const getImageUrl = () => {
    if (imageError || !service?.serviceImage?.[0]?.url) {
      return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
        service?.serviceName
      )}`;
    }

    return `${service.serviceImage[0].url}`;
  };

  const getImageAlt = () => {
    return service?.serviceImage?.[0]?.alternativeText || service?.serviceName;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="h-full"
    >
      <Link
        href={`/services/${service.documentId}`}
        className="group block h-full"
      >
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-square w-full">
            <Image
              src={getImageUrl() || "/placeholder.svg"}
              alt={getImageAlt()}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-center group-hover:text-blue-600">
              {service.serviceName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
