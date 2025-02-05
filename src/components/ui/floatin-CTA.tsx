"use client";

import { Phone, Facebook } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const buttonVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 2.2,
    },
  },
};

const glowVariants = {
  initial: { opacity: 0.3, scale: 0.95 },
  animate: {
    opacity: [0.3, 0.8, 0.3],
    scale: [0.95, 1.1, 0.95],
    transition: {
      duration: 2,
      times: [0, 0.5, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 1,
    },
  },
};

interface CTAButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({ href, icon, label, color }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
  >
    <motion.div
      className="absolute -inset-3 sm:-inset-4 md:-inset-5"
      variants={glowVariants}
      initial="initial"
      animate="animate"
    >
      <div
        className={`h-full w-full rounded-full ${color} opacity-30 blur-xl`}
      />
    </motion.div>
    <motion.button
      className={`relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-full ${color} shadow-lg`}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.2 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  </Link>
);

export function FloatingCTA() {
  return (
    <div className="fixed right-2 sm:right-4 md:right-6 bottom-16 sm:bottom-20 md:bottom-24 z-50 flex flex-col gap-3 sm:gap-4 md:gap-5">
      <CTAButton
        href="https://www.facebook.com/songphatlong"
        icon={
          <Facebook className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
        }
        label="Liên hệ qua Facebook"
        color="bg-blue-500"
      />
      <CTAButton
        href="tel:0905799385"
        icon={
          <Phone className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
        }
        label="Gọi điện thoại"
        color="bg-red-500"
      />

      <CTAButton
        href="https://zalo.me/0904858385"
        icon={
          <div className="relative w-10 h-10 md:w-7 md:h-7">
            <Image
              src="/Images/Icon_of_Zalo.svg.png"
              alt="Zalo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
        }
        label="Chat Zalo"
        color="bg-blue-500"
      />
    </div>
  );
}
