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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/services", label: "Dịch vụ" },
    { href: "/projects", label: "Dự án" },
    { href: "/tin-tuc", label: "Tin tức" },
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
        isScrolled ? "bg-white shadow-md" : "bg-[#FFF9D9]"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Images/logo.png"
              alt="SPL Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-[#0066FF] text-xl font-bold">
              BẢO VỆ AN TOÀN, KIẾN TẠO GIÁ TRỊ
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
                  <Menu className="h-5 w-5" />
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
                      className="text-sm font-medium hover:text-[#0066FF] transition-colors"
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
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm kiếm"
                className="h-9 w-[300px] rounded-full border border-gray-300 bg-white px-4 py-1 text-sm shadow-sm transition-all focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] focus:ring-opacity-50"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-[#0066FF]" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t border-gray-200 py-2">
          <nav className="flex justify-between">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-[#0066FF] transition-colors relative group"
              >
                {item.label}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#0066FF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
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
              className="h-9 w-full rounded-full border border-gray-300 bg-white px-4 py-1 text-sm shadow-sm transition-all focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] focus:ring-opacity-50"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Search className="h-4 w-4 text-[#0066FF]" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
