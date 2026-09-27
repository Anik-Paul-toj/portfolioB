import type { Metadata } from "next";
import "./globals.css";
import SparkleCursor from "@/components/SparkleCursor";

export const metadata: Metadata = {
  title: "Ampita | Video Editor Portfolio",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Birthstone+Bounce:wght@400;500&family=Corinthia:wght@400;700&family=Ephesis&family=Great+Vibes&family=MonteCarlo&family=Mr+De+Haviland&family=Mrs+Saint+Delafield&family=Qwitcher+Grypen:wght@400;700&family=Sacramento&family=Style+Script&family=WindSong:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fff5f9] font-sans text-[#3d1f35] antialiased" suppressHydrationWarning>
        <SparkleCursor />
        {children}
      </body>
    </html>
  );
}
