"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "./service-card";
import { Loader } from "@/components/loader";

const services = [
  {
    title: "Cung Cấp Thiết Bị PCCC",
    description:
      "Chúng tôi cung cấp đa dạng các thiết bị phòng cháy chữa cháy hiện đại, đạt chuẩn quốc tế, đảm bảo an toàn tối đa cho mọi công trình và doanh nghiệp.",
    link: "#",
  },
  {
    title: "Giải Pháp PCCC Toàn Diện",
    description:
      "Đội ngũ chuyên gia của chúng tôi sẽ tư vấn và thiết kế giải pháp PCCC phù hợp nhất cho từng không gian, đảm bảo hiệu quả và tuân thủ các quy định pháp luật.",
    link: "#",
  },
  {
    title: "Bảo Trì và Nâng Cấp Hệ Thống PCCC",
    description:
      "Chúng tôi cung cấp dịch vụ bảo trì định kỳ và nâng cấp hệ thống PCCC, đảm bảo thiết bị luôn trong tình trạng hoạt động tốt nhất, sẵn sàng ứng phó mọi tình huống.",
    link: "#",
  },
];

export default function FireFightingServicesUpgraded() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ServiceCard {...services[0]} />
                  <ServiceCard {...services[1]} />
                </div>
                <div className="mt-8 flex justify-center">
                  <div className="w-full md:w-1/2">
                    <ServiceCard {...services[2]} />
                  </div>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
