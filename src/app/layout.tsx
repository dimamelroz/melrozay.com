import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AboutProvider } from "@/context/AboutContext";
import { FilterProvider } from "@/context/FilterContext";
import { AboutOverlay } from "@/components/about/AboutOverlay";
import { Header } from "@/components/layout/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Dima Melroz — Film Director",
  description: "Portfolio of director Dima Melroz. Commercials, music videos, AI films.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FilterProvider>
          <AboutProvider>
            <Header />
            {children}
            <AboutOverlay />
          </AboutProvider>
        </FilterProvider>
      </body>
    </html>
  );
}
