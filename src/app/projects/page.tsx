"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string; // Changed from imageUrl to image
}

const projects: Project[] = [
  {
    id: "1",
    title: "Dự án DANAPHA TOWER",
    location: "ĐÀ NẴNG",
    description:
      "Cung cấp thiết bị và giải pháp PCCC cho Danapha Tower, công trình cao 15 tầng nổi và 3 tầng hầm, xây dựng trên diện tích đất 616,8 m2 với diện tích xây dựng khoảng 7.780 m2.",
    image: "/Images/project1.jpg",
  },
  {
    id: "2",
    title: "Dự án KHÁCH SẠN GARRYA",
    location: "ĐÀ NẴNG",
    description:
      "Chúng tôi tự hào cung cấp giải pháp và thiết bị PCCC cho khách sạn Garrya Đà Nẵng, tọa lạc trên 1.042,9 m2 đất với quy mô 2 tầng hầm và 9 tầng nổi. Công trình được thiết kế hiện đại, đáp ứng đầy đủ các tiêu chuẩn an toàn và chất lượng cao nhất.",
    image: "/Images/project2.jpg",
  },
];

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Shorter loading time for testing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="relative h-[400px] bg-black">
            <Image
              src="/placeholder.svg?height=400&width=1200"
              alt="Projects Header"
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h1 className="text-5xl font-bold mb-4 text-center px-4">
                DỰ ÁN SONG PHÁT LONG VIỆT NAM
              </h1>
              <div className="text-lg">
                <Link href="/" className="hover:underline">
                  Trang chủ
                </Link>
                <span className="mx-2">/</span>
                <span>Dự án</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="max-w-5xl mx-auto text-center py-16 px-4">
            <div className="mb-6 font-bold text-3xl">| SONG PHÁT LONG |</div>
            <p className="text-gray-700 text-xl leading-relaxed">
              Những hình ảnh này ghi lại một phần các dự án mà SONG PHÁT LONG đã
              và đang thực hiện với vai trò tư vấn thiết kế hoặc cung cấp sản
              phẩm - dịch vụ PCCC. Với tâm huyết và nỗ lực không ngừng, Công ty
              TNHH Song Phát Long đã từng bước khẳng định thương hiệu, hướng đến
              một vị thế vững chắc trong ngành, góp phần xây dựng những công
              trình PCCC chất lượng, mang tầm vóc Việt Nam.
            </p>
          </div>

          {/* Projects Section - Simplified */}
          <section className="py-12 max-w-7xl mx-auto px-4 pb-20">
            <h2 className="text-center text-4xl font-bold text-red-600 mb-12">
              DỰ ÁN NỔI BẬT
            </h2>
            <div className="space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="border border-gray-200 rounded-lg p-8 bg-white shadow-lg"
                >
                  <div
                    className={`grid md:grid-cols-2 gap-8 items-center ${
                      index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`${
                        index % 2 === 1 ? "md:order-2" : ""
                      } mb-4 md:mb-0`}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="rounded-lg object-cover"
                          onError={(e) => {
                            console.error(
                              `Failed to load image: ${project.image}`
                            );
                            e.currentTarget.src =
                              "/placeholder.svg?height=400&width=400";
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`space-y-4 ${
                        index % 2 === 1 ? "md:order-1" : ""
                      }`}
                    >
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {project.title}
                      </h3>
                      {project.location && (
                        <p className="text-lg font-medium text-red-600">
                          {project.location}
                        </p>
                      )}
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
          </section>
        </div>
      )}
    </div>
  );
}
