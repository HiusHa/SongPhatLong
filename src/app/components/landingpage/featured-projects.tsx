"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { elegantSlideIn } from "../../../../utils/animations";

export function FeaturedProjects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const projects = [
    {
      title: "Dự án phát triển đô thị thông minh",
      description:
        "Ứng dụng công nghệ IoT và AI để tối ưu hóa quản lý đô thị, nâng cao chất lượng cuộc sống cho cư dân.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Hệ thống quản lý năng lượng tái tạo",
      description:
        "Giải pháp tích hợp cho việc quản lý và tối ưu hóa sử dụng năng lượng tái tạo trong các tòa nhà thương mại.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-[#0066FF] mb-12">
          Dự Án nổi bật
        </h2>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={elegantSlideIn}
              custom={index % 2 === 0 ? "left" : "right"}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }}
              className="border border-gray-200 rounded-lg p-8 bg-white shadow-lg"
            >
              <div
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`${
                    index % 2 === 1 ? "md:order-2" : ""
                  } mb-4 md:mb-0`}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div
                  className={`space-y-4 ${index % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-gray-600">{project.description}</p>
                  <Button
                    variant="secondary"
                    className="bg-[#0066FF] text-white hover:bg-blue-700 transition-colors duration-300"
                  >
                    Xem thêm
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
