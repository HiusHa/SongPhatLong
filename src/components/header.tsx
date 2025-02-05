"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FloatingCTA } from "./ui/floatin-CTA";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-10 w-10" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xl font-medium hover:text-[#ff0000] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg font-bold">
                Giới thiệu
              </Button>
            </Link>
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm kiếm"
                className="h-9 w-[300px] rounded-full border border-gray-300 bg-white px-4 py-1 text-sm shadow-sm transition-all  focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000] focus:ring-opacity-50"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 " />
              </Button>
            </div>
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

        {/* Mobile Search Bar */}
        <div
          className={cn(
            "md:hidden py-2 overflow-hidden transition-all duration-300 ease-in-out",
            isMobileSearchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="relative">
            <input
              type="search"
              placeholder="Tìm kiếm"
              className="h-9 w-full rounded-full border border-gray-300 bg-white px-4 py-1 text-sm shadow-sm transition-all focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000] focus:ring-opacity-50"
            />

            {/* <Search className="h-4 w-4 text-[#ff0000]" /> */}
          </div>
        </div>
        <FloatingCTA />
      </div>
    </header>
  );
}
