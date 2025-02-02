"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-600 mb-2">LIÊN HỆ</h2>
        <p className="text-gray-600">
          Nếu bạn có thắc mắc gì, có thể để lại thông tin cho chúng tôi, và
          chúng tôi sẽ liên lạc với bạn sớm nhất có thể.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input type="text" placeholder="Họ" required className="w-full" />
          </div>
          <div>
            <Input type="text" placeholder="Tên" required className="w-full" />
          </div>
        </div>
        <div>
          <Input type="email" placeholder="Email" required className="w-full" />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Số điện thoại"
            required
            className="w-full"
          />
        </div>
        <div>
          <Textarea
            placeholder="Nội Dung Cần Tư Vấn"
            required
            className="w-full min-h-[120px]"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </Button>
      </form>
    </motion.div>
  );
}
