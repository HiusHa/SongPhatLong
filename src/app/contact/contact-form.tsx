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
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") {
      // Only allow letters, spaces, and hyphens
      const sanitizedValue = value.replace(/[^a-zA-Z\s-]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
    } else if (name === "phone") {
      // Remove non-digit characters and the +84 prefix if present
      let numericValue = value.replace(/\D/g, "");

      // If the user tries to enter the +84 prefix, remove it
      if (numericValue.startsWith("84")) {
        numericValue = numericValue.slice(2);
      }

      // Convert to number with 84 prefix
      const finalValue = numericValue ? Number("84" + numericValue) : 0;

      setFormData((prevData) => ({
        ...prevData,
        phone: finalValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstName: "", lastName: "", phone: "" };

    if (!/^[a-zA-Z\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = "Họ không được chứa số";
      isValid = false;
    }

    if (!/^[a-zA-Z\s-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Tên không được chứa số";
      isValid = false;
    }

    if (!/^84[0-9]{9,10}$/.test(formData.phone.toString())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
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
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
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
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
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
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg md:text-xl">
              +84
            </span>
            <Input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              required
              pattern="[0-9]{9,10}"
              title="Vui lòng nhập số điện thoại hợp lệ (9-10 chữ số)"
              className="w-full text-lg md:text-xl p-3 pl-14"
              value={
                formData.phone === 0 ? "" : formData.phone.toString().slice(2)
              }
              onChange={handleInputChange}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
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
