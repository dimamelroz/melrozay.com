"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useFilter } from "@/context/FilterContext";
import { useAbout } from "@/context/AboutContext";
import { MobileMenu } from "./MobileMenu";

const FILTERS = [
  { id: "all" as const, label: "ALL" },
  { id: "commercial" as const, label: "COMMERCIAL" },
  { id: "music-video" as const, label: "MUSIC VIDEO" },
];

export function Header() {
  const pathname = usePathname();
  const { activeFilter, setActiveFilter } = useFilter();
  const { setOpen: setAboutOpen } = useAbout();
  const [menuOpen, setMenuOpen] = useState(false);

  const isWorks = pathname === "/works" || pathname === "/works/";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between"
        style={{
          height: "var(--header-height)",
          paddingLeft: "clamp(16px, 3vw, 24px)",
          paddingRight: "clamp(16px, 3vw, 24px)",
        }}
      >
        {/* Brand name */}
        <Link
          href="/"
          className="text-white font-bold uppercase tracking-wider no-underline"
          style={{ fontSize: "clamp(20px, 2.5vw, 24px)" }}
        >
          DIMA MELROZ
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Filter segmented control — desktop only, /works only */}
          {isWorks && (
            <div
              className="hidden md:flex items-center"
              style={{ border: "1px solid rgba(255,255,255,0.4)" }}
            >
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className="relative cursor-pointer bg-transparent border-none"
                  style={{ padding: "3px 10px" }}
                >
                  {activeFilter === f.id && (
                    <motion.div
                      layoutId="filter-indicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "white",
                      }}
                    />
                  )}
                  <span
                    className="relative"
                    style={{
                      zIndex: 1,
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: activeFilter === f.id ? "black" : "rgba(255,255,255,0.6)",
                      transition: "color 150ms",
                    }}
                  >
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* About button — desktop only */}
          <button
            onClick={() => setAboutOpen(true)}
            className="hidden md:inline-block cursor-pointer bg-transparent border-none text-white/70 hover:text-white transition-colors"
            style={{ fontSize: "14px" }}
          >
            About
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden cursor-pointer bg-transparent border-none text-white p-1"
            aria-label="Open menu"
            style={{ lineHeight: 0 }}
          >
            <Plus size={32} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
