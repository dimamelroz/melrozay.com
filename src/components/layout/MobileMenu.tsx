"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useFilter } from "@/context/FilterContext";
import { useAbout } from "@/context/AboutContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const FILTER_ITEMS = [
  { id: "all" as const, label: "ALL" },
  { id: "commercial" as const, label: "COMMERCIAL" },
  { id: "music-video" as const, label: "MUSIC VIDEO" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { activeFilter, setActiveFilter } = useFilter();
  const { setOpen: setAboutOpen } = useAbout();

  useLockBodyScroll(open);

  const handleFilterSelect = (id: "all" | "commercial" | "music-video") => {
    setActiveFilter(id);
    onClose();
  };

  const handleAbout = () => {
    setAboutOpen(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: open ? 0.25 : 0.2 }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-4 text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          {/* Menu items */}
          <nav className="flex flex-col items-center">
            {FILTER_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFilterSelect(item.id)}
                className="relative flex flex-col items-center min-h-[48px] px-4 py-4 cursor-pointer bg-transparent border-none"
                style={{
                  fontSize: "24px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {item.label}
                {activeFilter === item.id && (
                  <span
                    className="absolute bottom-3 left-1/2 -translate-x-1/2"
                    style={{ width: "100%", height: "1px", background: "white", display: "block" }}
                  />
                )}
              </button>
            ))}

            {/* Separator */}
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(255,255,255,0.3)",
                margin: "8px 0",
              }}
            />

            {/* About */}
            <button
              onClick={handleAbout}
              className="min-h-[48px] px-4 py-4 cursor-pointer bg-transparent border-none"
              style={{
                fontSize: "24px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
                fontWeight: 500,
              }}
            >
              ABOUT
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
