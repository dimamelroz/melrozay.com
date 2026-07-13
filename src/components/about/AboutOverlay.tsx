"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

const ABOUT_PHOTOS = [
  { src: "/about/dima-about-main.jpg", alt: "Dima Melroz" },
  { src: "/about/dima-about-set-1.jpg", alt: "Dima Melroz on set" },
  { src: "/about/dima-about-set-2.jpg", alt: "Dima Melroz behind the camera" },
];

const PHOTO_SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export function AboutOverlay() {
  const { open, setOpen } = useAbout();
  const [mounted, setMounted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoDirection, setPhotoDirection] = useState(1);

  const showPreviousPhoto = () => {
    setPhotoDirection(-1);
    setCurrentPhotoIndex((index) =>
      (index + ABOUT_PHOTOS.length - 1) % ABOUT_PHOTOS.length
    );
  };
  const showNextPhoto = () => {
    setPhotoDirection(1);
    setCurrentPhotoIndex((index) => (index + 1) % ABOUT_PHOTOS.length);
  };

  useLockBodyScroll(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") showPreviousPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      setPhotoDirection(1);
      setCurrentPhotoIndex((index) => (index + 1) % ABOUT_PHOTOS.length);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [open, currentPhotoIndex]);

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
            className="about-container max-w-6xl mx-auto px-8 pt-10 pb-20"
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @media (max-width: 767px) {
                .about-spacer { display: none !important; }
                .about-container { padding-top: 24px !important; padding-bottom: 32px !important; }
                .about-heading { margin-bottom: 16px !important; line-height: 0.9 !important; margin-top: -10px !important; }
                .about-row { gap: 20px !important; }
              }
            `}</style>
            {/* Two-column row */}
            <div
              className="about-row flex flex-col md:flex-row"
              style={{ gap: 48, alignItems: "stretch" }}
            >
              {/* Left column: heading + photo slider */}
              <div style={{ flexShrink: 0, width: "100%", maxWidth: 480 }}>
                <h2 className="about-heading" style={HEADING_STYLE}>Dima Melroz</h2>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 480,
                    aspectRatio: "4/5",
                    overflow: "hidden",
                  }}
                >
                  <AnimatePresence initial={false} custom={photoDirection}>
                    <motion.img
                      key={ABOUT_PHOTOS[currentPhotoIndex].src}
                      src={ABOUT_PHOTOS[currentPhotoIndex].src}
                      alt={ABOUT_PHOTOS[currentPhotoIndex].alt}
                      custom={photoDirection}
                      variants={PHOTO_SLIDE_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    />
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={showPreviousPhoto}
                    aria-label="Previous about photo"
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      border: 0,
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    aria-label="Next about photo"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      border: 0,
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      padding: "4px 7px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.35)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {currentPhotoIndex + 1} / {ABOUT_PHOTOS.length}
                  </div>
                </div>
              </div>

              {/* Right column: invisible spacer → bio → contacts pinned to bottom */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 560 }}>
                {/* Invisible heading spacer — mirrors left heading height exactly */}
                <h2
                  aria-hidden="true"
                  className="about-spacer"
                  style={{ ...HEADING_STYLE, visibility: "hidden" }}
                >
                  Dima Melroz
                </h2>

                {/* Bio */}
                <div
                  style={{
                    color: "rgba(245,247,250,0.85)",
                    fontSize: "1rem",
                    lineHeight: 1.65,
                  }}
                >
                  <p style={{ marginBottom: 18 }}>
                    Привет, я Дима Melroz – режиссёр, креативный продюсер.
                    Уже 7 лет снимаю рекламу, клипы, шоу и бренд-контент.
                    Базируюсь в Москве, но работаю по всей России.
                  </p>
                  <p style={{ marginBottom: 18 }}>
                    Мне интересно соединять яркую визуальную эстетику с точной
                    формой, ритмом и интонацией проекта – чтобы видео работало
                    на идею и зрительское вовлечение.
                  </p>
                  <p style={{ marginBottom: 18 }}>
                    У меня высшее образование в маркетинге и дополнительное обучение во ВГИКе
                    по направлению «Второй режиссёр». Это помогает мне лучше понимать
                    задачи бренда, продакшена и команды.
                  </p>
                  <p>
                    Открыт к диалогу, экспериментам и поиску сильных решений вместе с командой!
                  </p>
                </div>

                {/* Contacts pinned to bottom of column */}
                <div
                  className="flex flex-wrap"
                  style={{ marginTop: "auto", paddingTop: 32, gap: 24 }}
                >
                  {[
                    { icon: <FaTelegramPlane size={24} />, label: "Telegram", href: "http://t.me/melrozay" },
                    { icon: <FaInstagram size={24} />, label: "Instagram", href: "https://www.instagram.com/dima.melroz/" },
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
