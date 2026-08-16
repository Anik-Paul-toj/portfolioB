"use client";

import { SessionProvider } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#070b10] text-white selection:bg-cyan-500/30">
        {children}
      </div>
    </SessionProvider>
  );
}
