"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
const MotionButton = motion(Button);

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-black">
        <Image
          src="/placeholder.svg?height=300&width=1200"
          alt="Projects Header"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-2">
            DỰ ÁN SONG PHÁT LONG VIỆT NAM
          </h1>
          <div className="text-sm">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span>Dự án</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-4xl mx-auto text-center py-12 px-4">
        <div className="mb-4 font-semibold text-xl">| SONG PHÁT LONG |</div>
        <p className="text-gray-600">
          Hình ảnh một phần các dự án mà SONG PHÁT LONG đã và đang thực hiện với
          vai trò là tư vấn thiết kế, thi công xây lắp hoặc tổng thầu. Công ty
          TNHH Song Phát Long đã tổng hợp, thi thành một thương hiệu mang tầm
          Việt Nam mình.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <MotionCard
              key={project.id}
              className="overflow-hidden"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
            >
              <div className="relative h-64">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="text-center p-6">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                {project.location && (
                  <p className="text-gray-600 mb-4">{project.location}</p>
                )}
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <MotionButton
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    rotate: [0, -3, 3, -3, 3, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  XEM CHI TIẾT
                </MotionButton>
              </CardFooter>
            </MotionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
