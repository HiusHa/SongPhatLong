"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { elegantSlideIn } from "../../../utils/animations";

export function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const ctaItems = [
    {
      title: "Bạn là doanh nghiệp?",
      description:
        "Cùng SONG PHÁT LONG khám phá các giải pháp từ chuyên gia để nâng cao an toàn và hiệu quả PCCC cho doanh nghiệp của bạn.",
      buttonText: "Tư vấn cùng SONG PHÁT LONG",
      image: "/placeholder.svg?height=600&width=800&text=Business",
      link: "/services",
    },
    {
      title: "Bạn là khách hàng cá nhân?",
      description:
        "SONG PHÁT LONG cam kết cung cấp các sản phẩm, thiết bị PCCC chính hãng từ những thương hiệu hàng đầu thế giới .",
      buttonText: "Mua hàng cùng SONG PHÁT LONG",
      image: "/placeholder.svg?height=600&width=800&text=Customer",
      link: "/products",
    },
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-24 ">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {ctaItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={elegantSlideIn}
              custom={index === 0 ? "left" : "right"}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }}
              className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="z-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {item.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white mb-8 max-w-md">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-col items-center w-full space-y-4">
                  <Link href={index === 0 ? "/services" : "/products"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 ${
                        index === 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {item.buttonText}
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
