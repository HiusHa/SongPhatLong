"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type React from "react";
import api, { type ContactFormData } from "@/app/_utils/globalApi";
import { toast, Toaster } from "react-hot-toast";
import { AxiosError } from "axios";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue === "" ? 0 : Number.parseInt(numericValue, 10),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);
      const response = await api.submitContactForm(formData);
      console.log("API Response:", response.data);
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: 0,
        message: "",
      });
      setAgreedToTerms(false);
      toast.success("Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.", {
        duration: 5000,
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";
      if (error instanceof AxiosError) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        if (error.response?.status === 405) {
          errorMessage =
            "Phương thức không được phép. Vui lòng liên hệ quản trị viên.";
        } else {
          errorMessage = `Lỗi: ${error.response?.status} - ${error.response?.statusText}`;
        }
      }
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <Toaster position="top-center" />
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
              name="firstName"
              placeholder="Họ"
              required
              className="w-full text-lg md:text-xl p-3"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              type="text"
              name="lastName"
              placeholder="Tên"
              required
              className="w-full text-lg md:text-xl p-3"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full text-lg md:text-xl p-3"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            required
            pattern="[0-9]{9,10}"
            title="Vui lòng nhập số điện thoại hợp lệ (9-10 chữ số)"
            className="w-full text-lg md:text-xl p-3"
            value={formData.phone === 0 ? "" : formData.phone.toString()}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Textarea
            name="message"
            placeholder="Nội Dung Cần Tư Vấn"
            required
            className="w-full min-h-[150px] text-lg md:text-xl p-3"
            value={formData.message}
            onChange={handleInputChange}
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
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl py-3 transition-colors duration-300"
          disabled={isSubmitting || !agreedToTerms}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </Button>
      </form>
    </motion.div>
  );
}
