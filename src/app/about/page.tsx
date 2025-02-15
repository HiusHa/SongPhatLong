"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const ctaRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-[#87CEEB] via-white to-[#F7E987]"
      ref={containerRef}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loader />
          </motion.div>
        ) : (
          <>
            <div className="relative min-h-screen bg-white">
              {/* Image Banner */}
              <div className="w-full flex justify-center bg-gradient-to-r from-red-600/50 to-red-900/50 ">
                <div className="relative w-[var(--banner-width)] overflow-hidden">
                  <div className="aspect-[calc(4*3+1)/3] max-h-full w-full">
                    {/* <Image
                      src="/Images/aboutUs.jpg"
                      alt="About Us Banner"
                      layout="fill"
                      objectFit="fill"
                      className="brightness-50"
                      priority
                    /> */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 max-w-[90%]">
                        Về Chúng Tôi
                      </h1>
                      {/* Scroll Down CTA */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <button
                          onClick={handleScrollDown}
                          className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg transition-all duration-300"
                        >
                          <ChevronDown className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
                {/* Header Section */}
                <motion.div
                  ref={headerRef}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                    <span className="text-red-600">ĐỊNH HƯỚNG PHÁT TRIỂN</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {[
                      { title: "UY TÍN", icon: "🏆" },
                      { title: "AN TOÀN", icon: "🛡️" },
                      { title: "HIỆU QUẢ", icon: "📈" },
                      { title: "CHUYÊN NGHIỆP", icon: "👔" },
                      { title: "PHÁT TRIỂN", icon: "🌱" },
                      { title: "BỀN VỮNG", icon: "♻️" },
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-br from-red-50 to-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4">
                          {value.icon}
                        </div>
                        <p className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl">
                          {value.title}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Vision Section */}
                <motion.div
                  ref={visionRef}
                  className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-white rounded-full shadow-[0_0_30px_rgba(254,202,202,0.3)] group-hover:shadow-[0_0_40px_rgba(254,202,202,0.4)] transition-shadow duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Image
                        src={"/Vision.svg"}
                        alt="Vision"
                        width={96}
                        height={96}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-red-600 group-hover:scale-110 transition-transform duration-500"
                      />
                      <p className="mt-2 sm:mt-3 md:mt-4 font-bold text-xl sm:text-2xl md:text-3xl text-gray-800">
                        TẦM NHÌN
                      </p>
                    </div>
                  </div>
                  <div className="max-w-3xl pt-4 flex flex-col gap-4 sm:gap-5 md:gap-6">
                    <p className="text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed font-semibold">
                      - Trở thành đơn vị đầu đầu tại Việt Nam trong lĩnh vực tư
                      vấn, thiết kế và cung cấp giải pháp cùng thiết bị phòng
                      cháy chữa cháy.
                    </p>
                    <p className="text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed font-semibold">
                      - Trở thành đơn vị được khách hàng tin tưởng lựa chọn nhờ
                      vào chất lượng vượt trội, sự chuyên nghiệp và cam kết an
                      toàn tuyệt đối.
                    </p>
                  </div>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                  ref={missionRef}
                  className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full relative group lg:order-last">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-white rounded-full shadow-[0_0_30px_rgba(255,237,213,0.3)] group-hover:shadow-[0_0_40px_rgba(255,237,213,0.4)] transition-shadow duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Image
                        src={"/mission.svg"}
                        alt="Mission"
                        width={96}
                        height={96}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-orange-600 group-hover:scale-110 transition-transform duration-500"
                      />
                      <p className="mt-2 sm:mt-3 md:mt-4 font-bold text-xl sm:text-2xl md:text-3xl text-gray-800">
                        SỨ MỆNH
                      </p>
                    </div>
                  </div>
                  <div className="max-w-3xl pt-4 flex flex-col gap-4 sm:gap-5 md:gap-6">
                    <p className="text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed font-semibold">
                      - Cung cấp các giải pháp phòng cháy chữa cháy tối ưu, ứng
                      dụng công nghệ tiên tiến và đảm bảo tiêu chuẩn an toàn cao
                      nhất.
                    </p>
                    <p className="text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed font-semibold">
                      - Bảo vệ tính mạng và tài sản của khách hàng, góp phần xây
                      dựng sự an tâm trong mọi hoạt động kinh doanh và sinh
                      hoạt.
                    </p>
                    <p className="text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed font-semibold">
                      - Đồng hành cùng khách hàng trong việc kiến tạo một môi
                      trường sống và làm việc an toàn, bền vững.
                    </p>
                  </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  ref={ctaRef}
                  className="relative w-full py-8 sm:py-10 md:py-12 lg:py-16 my-8 sm:my-10 md:my-12 lg:my-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative flex justify-center items-center max-w-4xl mx-auto px-4">
                    <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-red-50 to-white backdrop-blur-sm border border-red-100 w-full text-center shadow-2xl">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                        Bạn cần tư vấn về PCCC?
                      </h2>
                      <p className="text-gray-700 mb-6 sm:mb-8 md:mb-10 text-lg sm:text-xl md:text-2xl font-semibold">
                        Hãy liên hệ ngay với chúng tôi để được tư vấn miễn phí
                        về giải pháp phòng cháy chữa cháy phù hợp nhất.
                      </p>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                  text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg sm:text-xl md:text-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 lg:py-8"
                        onClick={() => router.push("/contact")}
                      >
                        <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3 md:mr-4" />
                        Liên hệ ngay
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
