"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  onClick: () => void;
}

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <div className="home-scroll-indicator absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
      <Link
        href="/works"
        onClick={(e) => { e.preventDefault(); onClick?.(); }}
        aria-label="Go to works"
        className="no-underline flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center cursor-pointer p-2"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span
            style={{ fontSize: "14px", color: "white", letterSpacing: "-0.035em", fontWeight: 700 }}
          >
            works
          </span>
          <ChevronDown size={20} color="white" />
        </motion.span>
      </Link>
      <style>{`
        .home-scroll-indicator {
          bottom: var(--home-bottom-offset, max(32px, calc(env(safe-area-inset-bottom) + 24px)));
        }
      `}</style>
    </div>
  );
}
