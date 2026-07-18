"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useFilter } from "@/context/FilterContext";
import { useAbout } from "@/context/AboutContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const FILTER_ITEMS = [
  { id: "all" as const, label: "all" },
  { id: "commercial" as const, label: "commercial" },
  { id: "music-video" as const, label: "music video" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeFilter, setActiveFilter } = useFilter();
  const { setOpen: setAboutOpen } = useAbout();

  useLockBodyScroll(open);

  const handleFilterSelect = (id: "all" | "commercial" | "music-video") => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => setActiveFilter(id));
    onClose();
    if (pathname !== "/works" && pathname !== "/works/") {
      router.push("/works");
    }
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
                className="flex items-center justify-center min-h-[48px] cursor-pointer border-none bg-transparent"
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 6px",
                    lineHeight: 1,
                    fontSize: "24px",
                    letterSpacing: "-0.035em",
                    fontWeight: 500,
                    backgroundColor: activeFilter === item.id ? "white" : "transparent",
                    color: activeFilter === item.id ? "black" : "white",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}

            {/* About */}
            <button
              onClick={handleAbout}
              className="min-h-[48px] px-4 py-4 cursor-pointer bg-transparent border-none"
              style={{
                fontSize: "24px",
                letterSpacing: "-0.035em",
                color: "white",
                fontWeight: 500,
                marginTop: "64px",
              }}
            >
              about
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
