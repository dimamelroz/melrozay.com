"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAbout } from "@/context/AboutContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function AboutOverlay() {
  const { open, setOpen } = useAbout();
  const [mounted, setMounted] = useState(false);

  useLockBodyScroll(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="about-overlay"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-3xl overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-opacity cursor-pointer bg-transparent border-none z-10"
            aria-label="Close about"
          >
            <X size={32} />
          </button>

          {/* Content — stop propagation so backdrop click doesn't fire when clicking content */}
          <div
            className="max-w-3xl mx-auto px-8 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "clamp(48px, 6vw, 72px)",
                fontWeight: 700,
                marginBottom: "48px",
                textTransform: "uppercase",
                color: "white",
                letterSpacing: "0.02em",
              }}
            >
              DIMA MELROZ
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src="/placeholder/about.svg"
                alt="Dima Melroz"
                width={200}
                height={200}
                className="object-cover flex-shrink-0"
                style={{ width: 200, height: 200 }}
              />

              <div className="flex flex-col gap-6">
                <p
                  style={{
                    color: "rgba(245,247,250,0.8)",
                    fontSize: "1.0625rem",
                    lineHeight: 1.6,
                    maxWidth: "600px",
                  }}
                >
                  Режиссёр рекламы, музыкальных клипов и AI-роликов.{" "}
                  [Здесь будет реальное био — заглушка]
                </p>

                <div className="flex flex-wrap gap-8">
                  {[
                    { label: "TELEGRAM", href: "https://t.me/dimamelroz" },
                    { label: "INSTAGRAM", href: "https://instagram.com/dimamelroz" },
                    { label: "VIMEO", href: "https://vimeo.com/dimamelroz" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(245,247,250,0.7)",
                        textDecoration: "none",
                      }}
                      className="hover:text-white hover:underline transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
