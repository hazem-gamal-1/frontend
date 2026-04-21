"use client";
import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

export function StaggerItem({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
