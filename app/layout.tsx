import type { Metadata } from "next";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";

export const metadata: Metadata = {
  title: "Ampita Das | Video Editor Portfolio",
  description:
    "Cinematic, pastel-neon portfolio for a professional video editor built with Next.js, Tailwind CSS, and GSAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#fff5f9] font-sans text-[#3d1f35] antialiased" suppressHydrationWarning>
        <SplashCursor />
        {children}
      </body>
    </html>
  );
}
