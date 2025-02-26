"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import type { CheckoutFormData, OrderData } from "@/app/types/Order";
import type { CartItem } from "@/app/types/product";
import api from "@/app/_utils/globalApi";
import { AxiosError } from "axios";
import { getCart } from "../../../utils/cartUtils";

export function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems] = useState<CartItem[]>(getCart());
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
    useAlternateAddress: false,
    alternateAddress: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal; // Add shipping cost if needed

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Họ không được để trống";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Tên không được để trống";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
      isValid = false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      // Create order data
      const orderData: Omit<OrderData, "orderNumber" | "Stattus"> = {
        ...formData,
        items: cartItems,
        subtotal,
        total,
      };

      // Submit order
      const response = await api.submitOrder(orderData);
      console.log("Order submitted successfully:", response.data);

      // Clear cart and show success message
      localStorage.removeItem("cart");
      toast.success("Đặt hàng thành công!");

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        toast.error(`Lỗi: ${errorMessage}`);
        console.error("Detailed error:", error.response?.data);
      } else {
        toast.error("Đã có lỗi xảy ra khi đặt hàng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Thông tin nhận hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useAlternateAddress"
                  checked={formData.useAlternateAddress}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      useAlternateAddress: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="useAlternateAddress">
                  Giao hàng đến địa chỉ khác?
                </Label>
              </div>

              {formData.useAlternateAddress && (
                <div>
                  <Label htmlFor="alternateAddress">
                    Địa chỉ giao hàng khác
                  </Label>
                  <Input
                    id="alternateAddress"
                    name="alternateAddress"
                    value={formData.alternateAddress}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </form>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Đơn hàng của bạn</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p>Tạm tính</p>
                  <p>{subtotal.toLocaleString("vi-VN")}₫</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Tổng cộng</p>
                  <p className="text-red-600">
                    {total.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và
                  cho các mục đích cụ thể khác đã được mô tả trong chính sách
                  riêng tư của chúng tôi.
                </p>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Đặt hàng"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
