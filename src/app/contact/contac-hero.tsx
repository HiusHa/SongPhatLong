"use client";
import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Images/firefighter-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 to-red-900/50" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          LIÊN HỆ
        </motion.h1>
        <motion.div
          className="flex items-center gap-2 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>Trang chủ</span>
          <span>/</span>
          <span>Liên hệ</span>
        </motion.div>
      </div>
    </div>
  );
}
