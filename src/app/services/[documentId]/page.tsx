"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader } from "@/components/loader";
import type { StrapiService } from "../../types/service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ServiceDetails() {
  const { documentId } = useParams();
  const [service, setService] = useState<StrapiService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `https://songphatlong-admin.onrender.com/api/services/${documentId}?populate=*`
        );
        const data = await response.json();
        console.log("API Response:", data);
        setService(data.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [documentId]);

  const getImageUrl = () => {
    if (imageError || !service?.serviceImage?.[0]?.url) {
      return `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(
        service?.serviceName || "Service Image"
      )}`;
    }
    return `${service.serviceImage[0].url}`;
  };

  const getImageAlt = () => {
    return (
      service?.serviceImage?.[0]?.alternativeText ||
      service?.serviceName ||
      "Service Image"
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!service) {
    return (
      <div className="text-2xl font-bold text-center py-12">
        Service not found
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <div className="relative max-w-[1440px] mx-auto">
        {/* Diagonal background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cc0000] skew-x-12 transform origin-top-right" />

        <div className="container mx-auto px-4 py-12 relative max-w-[1440px]">
          {/* Header section */}
          <motion.div
            className="flex flex-col md:flex-row items-center mb-8 md:mb-12"
            variants={fadeInUp}
          >
            <div className="w-24 h-24 relative mb-4 md:mb-0">
              <Image
                src="/Images/Logo.png"
                alt="SPL Logo"
                width={96}
                height={96}
                className="object-fill"
                unoptimized
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold md:ml-6 text-red-600 text-center md:text-left">
              {service.serviceName}
            </h1>
          </motion.div>

          {/* Main content */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Service Image */}
            <motion.div
              className="relative w-full h-[400px] md:h-[500px] order-1 md:order-2"
              variants={fadeInUp}
            >
              <Image
                src={getImageUrl() || "/placeholder.svg"}
                alt={getImageAlt()}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                onError={() => setImageError(true)}
                unoptimized
              />
            </motion.div>

            {/* Service steps */}
            <motion.div
              className="space-y-6 md:space-y-8 order-2 md:order-1 w-full"
              variants={staggerChildren}
            >
              {service.step1 && (
                <ServiceStep
                  number={1}
                  title={service.step1}
                  description={service.text1Description}
                  isActive={true}
                  service={service}
                />
              )}
              {service.step2 && (
                <ServiceStep
                  number={2}
                  title={service.step2}
                  description={service.step2Description}
                  service={service}
                />
              )}
              {service.step3 && (
                <ServiceStep
                  number={3}
                  title={service.step3}
                  description={service.step3Description}
                  service={service}
                />
              )}
              {service.step4 && (
                <ServiceStep
                  number={4}
                  title={service.step4}
                  description={service.step4Description}
                  service={service}
                />
              )}
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-12 md:mt-16 text-center"
            initial="hidden"
            animate="show"
            variants={fadeInUp}
          >
            <Link href="/contact">
              <Button
                size="xl"
                className="bg-green-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-xl md:text-2xl font-bold hover:bg-green-700 transition-colors duration-300 w-full md:w-auto"
              >
                Liên hệ ngay
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface ServiceStepProps {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
  service: StrapiService;
}

function ServiceStep({
  number,
  title,
  description,
  isActive = false,
  service,
}: ServiceStepProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative pl-12 md:pl-14 ${
        isActive ? "opacity-100" : "opacity-80"
      }`}
    >
      {/* Vertical line */}
      {number < 4 && service[`step${number + 1}` as keyof StrapiService] && (
        <div className="absolute left-3 md:left-4 top-10 w-1 h-full md:h-32 bg-red-500" />
      )}

      {/* Number circle */}
      <div className="absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg md:text-xl">
        {number}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-5 md:p-6 shadow-lg">
        <h3 className="text-xl md:text-2xl font-bold text-red-600 mb-3">
          {title}
        </h3>
        <p className="text-base md:text-lg text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
