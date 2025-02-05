"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type React from "react"; // Added import for React

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
          LIÊN HỆ
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Nếu bạn có thắc mắc gì, có thể để lại thông tin cho chúng tôi, và
          chúng tôi sẽ liên lạc với bạn sớm nhất có thể.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              type="text"
              placeholder="Họ"
              required
              className="w-full text-lg md:text-xl p-3"
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Tên"
              required
              className="w-full text-lg md:text-xl p-3"
            />
          </div>
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            required
            className="w-full text-lg md:text-xl p-3"
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Số điện thoại"
            required
            className="w-full text-lg md:text-xl p-3"
          />
        </div>
        <div>
          <Textarea
            placeholder="Nội Dung Cần Tư Vấn"
            required
            className="w-full min-h-[150px] text-lg md:text-xl p-3"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm md:text-base text-gray-600 cursor-pointer"
          >
            Tôi đồng ý với điều khoản và điều kiện
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl py-3"
          disabled={isSubmitting || !agreedToTerms}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </Button>
      </form>
    </motion.div>
  );
}
