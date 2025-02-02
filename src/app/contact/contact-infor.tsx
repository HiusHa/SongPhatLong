import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfo() {
  const contactItems = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      content: "songphatlong@gmail.com",
      href: "mailto:songphatlong@gmail.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Hotline",
      content: "0905799385",
      href: "tel:+84905799385",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Địa chỉ",
      content: "84 Hồ Phi Tích, P. Hòa Xuân, Q. Cẩm lệ, TP. Đà Nẵng",
      href: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.9509728157873!2d108.2298502755328!3d16.01606748465589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421a018e76e685%3A0xec9a6d25a07c118f!2zODQgSOG7kyBQaGkgVMOtY2gsIEhvw6AgWHXDom4sIEPhuqltIEzhu4csIMSQw6AgTuG6tW5nIDUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1736405340790!5m2!1svi!2s",
    },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/songphatlong" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="space-y-6">
        {contactItems.map((item, index) => (
          <motion.a
            key={item.title}
            href={item.href}
            target={item.title === "Địa chỉ" ? "_blank" : undefined}
            rel={item.title === "Địa chỉ" ? "noopener noreferrer" : undefined}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-red-600">{item.icon}</div>
            <div>
              <h3 className="font-semibold text-red-600">{item.title}</h3>
              <p className="text-gray-600 mt-1">{item.content}</p>
            </div>
          </motion.a>
        ))}
      </div>
      <div className="mt-8">
        <div className="flex justify-center gap-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-red-600 hover:text-red-700 transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">{link.name}</span>
              {/* Add your social media icons here */}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
