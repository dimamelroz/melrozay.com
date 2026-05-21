"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  onClick: () => void;
}

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
      <motion.button
        onClick={onClick}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center cursor-pointer bg-transparent border-none p-2"
        aria-label="Go to works"
      >
        <span
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}
          className="uppercase font-medium"
        >
          WORKS
        </span>
        <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
      </motion.button>
    </div>
  );
}
