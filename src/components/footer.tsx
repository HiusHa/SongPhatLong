import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-[#ffff] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo and Vision */}
          <div className="lg:col-span-3">
            <Image
              src="/Images/logo.png"
              alt="SPL Logo"
              width={120}
              height={120}
              className="mb-4"
            />
            <p className="text-[#ff0000] max-w-xs mb-4">
              Bảo vệ an toàn, Kiến tạo giá trị
            </p>
            <Image
              src="/Images/bo-cong-thuong.png"
              alt="Bộ Công Thương"
              width={200}
              height={75}
              className="mt-4"
            />
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-8">
              {/* About Us Column */}
              <div>
                <h3 className="text-[#ff0000] font-medium mb-4">
                  Về chúng tôi
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Đội ngũ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Tuyển dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Store Column */}
              <div>
                <h3 className="text-[#ff0000] font-medium mb-4">Cửa Hàng</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Danh mục
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Khuyến mãi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-[#ff0000]"
                    >
                      Hàng mới về
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Map and Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-[#ff0000] font-medium mb-4">Địa chỉ</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.9509728157873!2d108.2298502755328!3d16.01606748465589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421a018e76e685%3A0xec9a6d25a07c118f!2zODQgSOG7kyBQaGkgVMOtY2gsIEhvw6AgWHXDom4sIEPhuqltIEzhu4csIMSQw6AgTuG6tW5nIDUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1736405340790!5m2!1svi!2s"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#ff0000]" />
                <span className="text-gray-600">
                  84 Hồ Phi Tích, Hoà Xuân, Cẩm Lệ, Đà Nẵng 50000, Việt Nam
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-[#ff0000]" />
                <a
                  href="tel:+84985849199"
                  className="text-gray-600 hover:text-[#ff0000]"
                >
                  0985849199
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-[#ff0000]" />
                <a
                  href="mailto:songphatlong@gmail.com"
                  className="text-gray-600 hover:text-[#ff0000]"
                >
                  songphatlong@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-[#ff0000] font-medium mb-4 text-center">
            Đăng ký nhận tin
          </h3>
          <form className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-grow"
            />
            <Button
              type="submit"
              className="bg-[#ff0000] text-white hover:bg-[#cc0000]"
            >
              Đăng ký
            </Button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 mb-4 md:mb-0">
            ©2025 SONG PHÁT LONG. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-[#ff0000]"
            >
              Privacy & Policy
            </Link>
            <Link
              href="/terms-condition"
              className="text-gray-600 hover:text-[#ff0000]"
            >
              Terms & Condition
            </Link>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="https://facebook.com"
              className="text-gray-600 hover:text-[#ff0000]"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-600 hover:text-[#ff0000]"
            >
              <Twitter size={24} />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-gray-600 hover:text-[#ff0000]"
            >
              <Instagram size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
