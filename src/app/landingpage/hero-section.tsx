"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scrollAnimation, wiggle } from "../../../utils/animations";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
      variants={scrollAnimation}
      style={{ opacity }}
      className="relative h-[300px] md:h-[400px] lg:h-[600px]"
    >
      <Image
        src="/placeholder.svg?height=600&width=1920"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div whileHover="hover" variants={wiggle}>
          <Button variant="secondary" size="lg">
            Explore
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
