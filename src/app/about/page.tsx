"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Flame, Shield, BarChart3, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-white"
      ref={containerRef}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#FFF5F5] to-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loader />
          </motion.div>
        ) : (
          <>
            {/* Decorative Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(254,202,202,0.2),transparent_50%)]" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(254,226,226,0.2),transparent_50%)]" />
            </div>

            {/* Header Section */}
            <motion.div
              style={{ opacity, scale }}
              className="container mx-auto px-4 pt-24 relative"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                  ĐỊNH HƯỚNG PHÁT TRIỂN
                </h1>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="container mx-auto px-4 py-24"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {/* Vision Section */}
              <motion.div
                className="flex flex-col md:flex-row items-start gap-12 mb-32"
                variants={fadeInUp}
              >
                <div className="w-64 h-64 rounded-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white rounded-full shadow-[0_0_30px_rgba(254,202,202,0.2)] group-hover:shadow-[0_0_40px_rgba(254,202,202,0.3)] transition-shadow duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform duration-500" />
                    <p className="absolute mt-24 font-semibold text-xl text-gray-800">
                      TẦM NHÌN
                    </p>
                  </div>
                </div>
                <div className="max-w-2xl pt-4 text-center mx-auto flex flex-col gap-6">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    Trở thành đơn vị đầu đầu tại Việt Nam trong lĩnh vực tư vấn,
                    thiết kế và cung cấp giải pháp cùng thiết bị phòng cháy chữa
                    cháy.
                  </p>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    Trở thành đơn vị được khách hàng tin tưởng lựa chọn nhờ vào
                    chất lượng vượt trội, sự chuyên nghiệp và cam kết an toàn
                    tuyệt đối.
                  </p>
                </div>
              </motion.div>

              {/* Mission Section */}
              <motion.div
                className="flex flex-col md:flex-row-reverse items-start gap-12 mb-32"
                variants={fadeInUp}
              >
                <div className="w-64 h-64 rounded-full relative group md:ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white rounded-full shadow-[0_0_30px_rgba(255,237,213,0.2)] group-hover:shadow-[0_0_40px_rgba(255,237,213,0.3)] transition-shadow duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="w-12 h-12 text-orange-600 group-hover:scale-110 transition-transform duration-500" />
                    <p className="absolute mt-24 font-semibold text-xl text-gray-800">
                      SỨ MỆNH
                    </p>
                  </div>
                </div>
                <div className="max-w-2xl pt-4 text-center mx-auto">
                  <div className="flex flex-col gap-6">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      Cung cấp các giải pháp phòng cháy chữa cháy tối ưu, ứng
                      dụng công nghệ tiên tiến và đảm bảo tiêu chuẩn an toàn cao
                      nhất.
                    </p>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      Bảo vệ tính mạng và tài sản của khách hàng, góp phần xây
                      dựng sự an tâm trong mọi hoạt động kinh doanh và sinh
                      hoạt.
                    </p>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      Đồng hành cùng khách hàng trong việc kiến tạo một môi
                      trường sống và làm việc an toàn, bền vững.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Core Values Section */}
              <motion.div
                className="flex flex-col md:flex-row items-start gap-12 mb-32"
                variants={fadeInUp}
              >
                <div className="w-64 h-64 rounded-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-white rounded-full shadow-[0_0_30px_rgba(254,240,138,0.2)] group-hover:shadow-[0_0_40px_rgba(254,240,138,0.3)] transition-shadow duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-yellow-600 group-hover:scale-110 transition-transform duration-500" />
                    <p className="absolute mt-24 font-semibold text-xl text-gray-800">
                      GIÁ TRỊ CỐT LÕI
                    </p>
                  </div>
                </div>
                <div className="max-w-2xl pt-4 text-center mx-auto">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { title: "UY TÍN", bg: "bg-red-100" },
                        { title: "AN TOÀN", bg: "bg-orange-100" },
                        { title: "HIỆU QUẢ", bg: "bg-yellow-100" },
                        { title: "CHUYÊN NGHIỆP", bg: "bg-green-100" },
                        { title: "PHÁT TRIỂN BỀN VỮNG", bg: "bg-blue-100" },
                      ].map((value, index) => (
                        <div
                          key={index}
                          className={`${value.bg} p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300`}
                        >
                          <p className="font-semibold text-gray-800">
                            {value.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                className="relative w-full py-16 my-16"
                variants={fadeInUp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-white to-orange-50 opacity-50" />
                <div className="relative flex justify-center items-center max-w-3xl mx-auto px-4">
                  <div className="relative p-12 rounded-2xl backdrop-blur-sm border border-red-100 w-full text-center">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                      Bạn cần tư vấn về PCCC?
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                      Hãy liên hệ ngay với chúng tôi để được tư vấn miễn phí về
                      giải pháp phòng cháy chữa cháy phù hợp nhất.
                    </p>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                        text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 mx-auto"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Liên hệ ngay
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
