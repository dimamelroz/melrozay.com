"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaTelegramPlane, FaInstagram, FaVimeoV } from "react-icons/fa";
import { useAbout } from "@/context/AboutContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const HEADING_STYLE = {
  fontSize: "clamp(48px, 6vw, 72px)",
  fontWeight: 700,
  marginBottom: "24px",
  color: "white",
  letterSpacing: "-0.04em",
  whiteSpace: "nowrap",
} as const;

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
          className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-3xl overflow-y-auto"
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

          {/* Content */}
          <div
            className="max-w-6xl mx-auto px-8 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Two-column row */}
            <div
              className="flex flex-col md:flex-row"
              style={{ gap: 64, alignItems: "stretch" }}
            >
              {/* Left column: heading + photo */}
              <div style={{ flexShrink: 0, width: "100%", maxWidth: 340 }}>
                <h2 style={HEADING_STYLE}>Dima Melroz</h2>
                <img
                  src="/placeholder/about.svg"
                  alt="Dima Melroz"
                  style={{
                    width: "100%",
                    maxWidth: 340,
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Right column: invisible spacer → bio → contacts pinned to bottom */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Invisible heading spacer — mirrors left heading height exactly */}
                <h2
                  aria-hidden="true"
                  style={{ ...HEADING_STYLE, visibility: "hidden" }}
                >
                  Dima Melroz
                </h2>

                {/* Bio */}
                <p
                  style={{
                    color: "rgba(245,247,250,0.85)",
                    fontSize: "1.0625rem",
                    lineHeight: 1.7,
                  }}
                >
                  Режиссёр рекламы, музыкальных клипов и AI-роликов.{" "}
                  [Здесь будет реальное био — заглушка]
                </p>

                {/* Contacts pinned to bottom of column */}
                <div
                  className="flex flex-wrap"
                  style={{ marginTop: "auto", paddingTop: 32, gap: 24 }}
                >
                  {[
                    { icon: <FaTelegramPlane size={24} />, label: "Telegram", href: "https://t.me/" },
                    { icon: <FaInstagram size={24} />, label: "Instagram", href: "https://instagram.com/" },
                    { icon: <FaVimeoV size={24} />, label: "Vimeo", href: "https://vimeo.com/" },
                  ].map(({ icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        display: "flex",
                        alignItems: "center",
                        transition: "color 150ms",
                      }}
                      className="hover:text-white"
                    >
                      {icon}
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
