"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function FadeIn({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
