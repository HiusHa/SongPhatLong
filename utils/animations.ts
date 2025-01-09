import { Variants } from "framer-motion";

export const wiggle: Variants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export const fadeInFromOutside: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
};

export const scrollAnimation: Variants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export const slideInFromSide: Variants = {
  offscreen: (direction: "left" | "right") => ({
    x: direction === "left" ? "-100%" : "100%",
    opacity: 0,
  }),
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export const elegantSlideIn: Variants = {
  hidden: (direction: "left" | "right") => ({
    x: direction === "left" ? -100 : 100,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 30,
      damping: 15,
      mass: 1,
      duration: 1.2,
    },
  },
};
