"use client";

import { SheetTrigger } from "@/components/ui/sheet";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FloatingCTA } from "./ui/floatin-CTA";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

import type { CartItem } from "@/app/types/product";
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../utils/cartUtils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/products", label: "Sản phẩm" },
    { href: "/services", label: "Dịch vụ" },
    { href: "/projects", label: "Dự án" },
    { href: "/news", label: "Tin tức" },
    { href: "/contact", label: "Liên hệ" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(getCart());
    };

    updateCart();
    window.addEventListener("storage", updateCart);

    // Set up an interval to check for cart updates
    const intervalId = setInterval(updateCart, 1000);

    return () => {
      window.removeEventListener("storage", updateCart);
      clearInterval(intervalId);
    };
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: number, newQuantity: number) => {
    updateCartItemQuantity(id, newQuantity);
    setCartItems(getCart());
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  const CartContent = () => (
    <div className="flex flex-col  h-full">
      <SheetHeader>
        <SheetTitle className="text-2xl font-bold">Giỏ hàng của bạn</SheetTitle>
        <SheetDescription>
          Xem lại các mặt hàng trong giỏ hàng của bạn và tiến hành thanh toán.
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex-1 mt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Giỏ hàng trống</div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-red-600 font-medium">
                    {item.price.toLocaleString("vi-VN")}đ
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 ml-4"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Tổng cộng:</span>
          <span className="text-red-600">
            {totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => setIsCartOpen(false)}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
            onClick={() => {
              setIsCartOpen(false);
              router.push("/check-out");
            }}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white shadow-md" : "bg-white"
      )}
    >
      <div className="container mx-auto px-2 md:px-8 py-2">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/Images/logo.png"
              alt="SPL Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <span className="text-[#ff0000] text-xl sm:text-xl font-bold text-center flex-grow">
              Bảo vệ an toàn, Kiến tạo giá trị
            </span>
          </Link>

          {/* Mobile Menu and Cart */}
          <div className="md:hidden flex items-center space-x-2">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="relative p-2 hover:bg-red-100 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] [&~div]:bg-white/20  shadow-none"
              >
                <CartContent />
              </SheetContent>
            </Sheet>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-10 w-10" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Điều hướng đến các trang khác nhau của trang web.
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xl font-medium hover:text-[#ff0000] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Cart and About Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg font-bold">
                Giới thiệu
              </Button>
            </Link>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="relative p-2 hover:bg-red-100 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[400px] [&~div]:bg-black/20 shadow-none"
              >
                <CartContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t-2 border-gray-200 py-2">
          <nav className="flex justify-between">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl font-bold transition-colors relative group"
              >
                {item.label}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </Link>
            ))}
          </nav>
        </div>
        <FloatingCTA />
      </div>
    </header>
  );
}
