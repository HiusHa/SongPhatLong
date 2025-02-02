"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

import api from "../_utils/globalApi";
import { StrapiService, StrapiResponse } from "../types/service";
import { ServiceCard } from "./service-card";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ServicesPage() {
  const [services, setServices] = useState<StrapiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getServices = async () => {
    try {
      const response = await api.getServices();
      console.log("API Response:", response);
      if (response && response.data) {
        const strapiResponse = response.data as StrapiResponse;
        setServices(strapiResponse.data);
      } else {
        console.error("Unexpected API response structure:", response);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.main
            key="content"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1 }}
            className="flex-grow"
          >
            <section className="relative bg-gray-900 text-white py-20 px-6">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-r-[100px] border-t-transparent border-r-orange-400"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full transform -translate-x-16 translate-y-16 opacity-50"></div>
              <div className="container mx-auto text-center relative z-10">
                <p className="text-sm uppercase tracking-wider mb-4">
                  /dịch vụ của chúng tôi/
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                  Nhà Cung Cấp Hàng Đầu
                  <br />
                  Thiết Bị và Giải Pháp PCCC
                </h1>
                <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
                  Liên hệ ngay
                </Button>
              </div>
            </section>

            <section className="py-16 px-6 bg-gray-50">
              <div className="container mx-auto">
                <motion.h2
                  className="text-3xl font-bold mb-6 text-gray-800"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Dịch Vụ Phòng Cháy Chữa Cháy
                </motion.h2>
                <motion.div
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </motion.div>
                {services.length === 0 && (
                  <p className="text-center text-gray-600 mt-8">
                    No services found.
                  </p>
                )}
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
