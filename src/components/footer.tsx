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
import { Logo } from "./ui/logo";
import { BoCongThuong } from "./ui/BoCongThuong";

export function Footer() {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo and Vision */}
          <div className="lg:col-span-3">
            <Logo />
            <p className="text-red-600 font-bold text-4xl max-w-xs mb-4">
              Bảo vệ an toàn Kiến tạo giá trị
            </p>
            <BoCongThuong />
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-6">
              {/* About Us Column */}
              <div>
                <h3 className="text-red-600 font-bold mb-4 text-2xl">
                  Về chúng tôi
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Đội ngũ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Tuyển dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Store Column */}
              <div>
                <h3 className="text-red-600 font-bold text-2xl mb-4">
                  Cửa Hàng
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Danh mục
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Khuyến mãi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Hàng mới về
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Services Column */}
              <div>
                <h3 className="text-red-600 font-bold text-2xl mb-4">
                  Dịch vụ
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/services"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Bảo trì
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Sửa chữa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Tư vấn
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Map and Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-red-600 font-bold text-2xl mb-4">Địa chỉ</h3>
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
                <MapPin size={18} className="text-red-600" />
                <span className="text-gray-600 font-bold">
                  84 Hồ Phi Tích, Hoà Xuân, Cẩm Lệ, Đà Nẵng 50000, Việt Nam
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-red-600" />
                <a
                  href="tel:+84985849199"
                  className="text-gray-600 hover:text-red-600 font-bold"
                >
                  0985849199
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-red-600" />
                <a
                  href="mailto:songphatlong@gmail.com"
                  className="text-gray-600 hover:text-red-600 font-bold"
                >
                  songphatlong@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-red-600 font-bold text-2xl mb-4 text-center">
            Đăng ký nhận tin
          </h3>
          <form className="flex gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-grow"
            />
            <Button
              type="submit"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Đăng ký
            </Button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600">
            ©2025 SONG PHÁT LONG. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-red-600 font-bold"
            >
              Privacy & Policy
            </Link>
            <Link
              href="/terms-condition"
              className="text-gray-600 hover:text-red-600 font-bold"
            >
              Terms & Condition
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              className="text-gray-600 hover:text-red-600"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-600 hover:text-red-600"
            >
              <Twitter size={24} />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-gray-600 hover:text-red-600"
            >
              <Instagram size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
