import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FFF9D9] py-8">
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
            <p className="text-[#0066FF] max-w-xs">
              Our vision is to provide convenience and help increase your sales
              business.
            </p>
            <div className="mt-4 p-4 border border-dashed border-gray-300 max-w-[200px] aspect-square flex items-center justify-center text-gray-400">
              Slot
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* About Us Column */}
              <div>
                <h3 className="text-[#0066FF] font-medium mb-4">
                  Về chúng tôi
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Store Column */}
              <div>
                <h3 className="text-[#0066FF] font-medium mb-4">Cửa Hàng</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Cửa Hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Cửa Hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Cửa Hàng
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Information Column */}
              <div>
                <h3 className="text-[#0066FF] font-medium mb-4">Thông tin</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Thông tin
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Thông tin
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      Thông tin
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846309437662!2d-86.81196688479231!3d33.57183808073421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88891b9d4f7e58cd%3A0x3bba5c81c5e71218!2sBirmingham%2C%20AL%2C%20USA!5e0!3m2!1sen!2s!4v1647907800000!5m2!1sen!2s"
              width="110%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 mb-4 md:mb-0">
            ©2022 Company Name. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-600 hover:text-[#0066FF]">
              Privacy & Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#0066FF]">
              Terms & Condition
            </Link>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-[#0066FF]">
              <Facebook size={24} />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#0066FF]">
              <Twitter size={24} />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#0066FF]">
              <Instagram size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
