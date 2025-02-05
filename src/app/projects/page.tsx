"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loader";

interface Project {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "DỰ ÁN VINCOM TRÀNG TIỀN",
    location: "HÀ NỘI",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "2",
    title: "DỰ ÁN VĂN PHÒNG LÀM VIỆC VÀ CHO THUÊ ĐỆ CẦN",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "3",
    title: "DỰ ÁN HỆ THỐNG KHO LẠNH ETC",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "4",
    title: "DỰ ÁN TỔ HỢP THƯƠNG MẠI - VĂN PHÒNG CHO THUÊ MACHINCO 1",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "5",
    title: "DỰ ÁN XÂY DỰNG TRỤ SỞ NGÂN HÀNG AGRIBANK - CHI NHÁNH TỈNH BẮC KẠN",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "6",
    title: "DỰ ÁN XÂY DỰNG TRỤ SỞ NGÂN HÀNG AGRIBANK - CHI NHÁNH ĐỐNG ĐA",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
];

const MotionCard = motion(Card);

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader /> // Show loader while loading
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
              Hình ảnh một phần các dự án mà SONG PHÁT LONG đã và đang thực hiện
              với vai trò là tư vấn thiết kế, thi công xây lắp hoặc tổng thầu.
              Công ty TNHH Song Phát Long đã tổng hợp, thi thành một thương hiệu
              mang tầm Việt Nam mình.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="max-w-7xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <MotionCard
                  key={project.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="relative h-72">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="text-center p-6">
                    <h3 className="font-bold text-xl mb-3 leading-tight">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-gray-700 text-lg">
                        {project.location}
                      </p>
                    )}
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
