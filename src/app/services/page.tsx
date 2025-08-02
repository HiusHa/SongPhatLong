"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Loader } from "@/components/loader";
import api from "../_utils/globalApi";
import { StrapiService, StrapiResponse } from "../types/service";
import { ServiceCard } from "./service-card";
import slugify from "slugify";

// Mỗi service giờ ngoài StrapiService còn có thêm __slug (string)
type ServiceWithSlug = StrapiService & { __slug: string };

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.getServices();
        const data = (response.data as StrapiResponse).data;

        // Gán __slug: ưu tiên SlugURL, nếu không có thì tự sinh từ serviceName
        const withSlug: ServiceWithSlug[] = data.map((svc) => ({
          ...svc,
          __slug:
            svc.slugURL?.trim() || slugify(svc.serviceName, { lower: true }),
        }));

        setServices(withSlug);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.main
            key="content"
            className="flex-grow"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* ... header nếu cần ... */}

            <section className="py-16 px-6 bg-gray-50">
              <div className="container mx-auto">
                <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      slug={service.__slug}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
