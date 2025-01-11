import Image from "next/image";
import { motion } from "framer-motion";

const bannerVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.5 }, // Increased duration and added delay
};

export function Banner() {
  return (
    <motion.div
      className="w-full space-y-6 mb-8"
      variants={bannerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }} // Increased from 0.3 to 0.5
        >
          <Image
            src="/placeholder.svg?height=400&width=800&text=Thiết+Bị+Chữa+Cháy"
            alt="Thiết bị chữa cháy"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">
              Thiết Bị Chữa Cháy
            </h2>
          </div>
        </motion.div>
        <motion.div
          className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }} // Increased from 0.3 to 0.5
        >
          <Image
            src="/placeholder.svg?height=400&width=800&text=Thiết+Bị+Cứu+Hộ"
            alt="Thiết bị cứu hộ"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">Thiết Bị Cứu Hộ</h2>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
