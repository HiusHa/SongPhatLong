"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { elegantSlideIn } from "../../../utils/animations";

export function FeaturedProjects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const projects = [
    {
      title: "Dự án DANAPHA TOWER",
      description:
        "Cung cấp thiết bị và giải pháp PCCC cho Danapha Tower, công trình cao 15 tầng nổi và 3 tầng hầm, xây dựng trên diện tích đất 616,8 m2 với diện tích xây dựng khoảng 7.780 m2.",
      image: "/Images/project1.jpg",
    },
    {
      title: "Dự án KHÁCH SẠN GARRYA",
      description:
        "Chúng tôi tự hào cung cấp giải pháp và thiết bị PCCC cho khách sạn Garrya Đà Nẵng, tọa lạc trên 1.042,9 m2 đất với quy mô 2 tầng hầm và 9 tầng nổi. Công trình được thiết kế hiện đại, đáp ứng đầy đủ các tiêu chuẩn an toàn và chất lượng cao nhất.",
      image: "/Images/project2.jpg",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
          DỰ ÁN NỔI BẬT
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
                      objectFit="fill"
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
                    className="bg-red-600 text-white hover:bg-blue-700 transition-colors duration-300"
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
