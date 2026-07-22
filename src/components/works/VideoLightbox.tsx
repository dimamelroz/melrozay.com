"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import type { Work } from "@/types/work";

interface VideoLightboxProps {
  work: Work | null;
  onClose: () => void;
}

export function VideoLightbox({ work, onClose }: VideoLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useLockBodyScroll(!!work);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (work) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [work, onClose]);

  if (!mounted) return null;

  const videoContainerStyle: React.CSSProperties =
    work?.orientation === "vertical"
      ? { aspectRatio: "9/16", maxHeight: "90vh" }
      : {
          width: "min(90vw, calc(90vh * 16 / 9))",
          aspectRatio: "16/9",
        };

  return createPortal(
    <AnimatePresence>
      {work?.fullVideo && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-opacity cursor-pointer bg-transparent border-none z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          {/* Video container — stop propagation so clicks inside don't close */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={videoContainerStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <VideoEmbed
              provider={work.fullVideo.provider}
              id={work.fullVideo.id}
              autoplay={true}
              muted={false}
              loop={false}
              controls={true}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
