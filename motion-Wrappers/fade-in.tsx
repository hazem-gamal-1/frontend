"use client";
import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "up" | "none";
  delay?: number;
}

export function FadeIn({
  children,
  direction = "none",
  delay = 0,
  className,
}: Props) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -24 : 0,
      y: direction === "up" ? 20 : 0,
    },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
