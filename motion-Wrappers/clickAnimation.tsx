"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
export default function ClickAnimation({
  children,
  className,
}: { children: ReactNode; className?: string } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className={className}>
      {children}
    </motion.div>
  );
}
