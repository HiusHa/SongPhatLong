// app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "@/components/loader";
import api from "@/app/_utils/globalApi";
import type { StrapiService } from "@/app/types/service";
import { ServiceCard } from "./service-card";
import type { AxiosResponse } from "axios";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function slugify(text?: string) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServicesPage() {
  const [services, setServices] = useState<
    (StrapiService & { __slug?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getServices();
        // resp is AxiosResponse<{ data: StrapiService[] }>
        const typed = resp as AxiosResponse<{ data: StrapiService[] }>;
        const list: StrapiService[] = typed.data?.data ?? [];

        const withSlug = list.map((s) => {
          // đọc cả "SlugURL" và "slugURL" an toàn (không dùng `any`)
          const r =
            (s as unknown as Record<string, unknown>)["SlugURL"] ??
            (s as unknown as Record<string, unknown>)["slugURL"];
          const rawSlug = typeof r === "string" ? r.trim() : "";
          const generated =
            rawSlug || slugify(s.serviceName) || String(s.documentId ?? s.id);
          return { ...s, __slug: generated };
        });

        setServices(withSlug);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dịch vụ</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              slug={svc.__slug ?? String(svc.documentId ?? svc.id)}
            />
          ))}
        </div>

        {services.length === 0 && (
          <p className="text-center text-gray-600 mt-8">Không có dịch vụ.</p>
        )}
      </div>
    </motion.div>
  );
}
