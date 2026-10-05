"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { ThumbnailCover } from "@/lib/content";
import { formatDriveImageUrl } from "@/lib/drive";
import { X, ExternalLink, Sparkles } from "lucide-react";

type CoverModalProps = {
  cover: ThumbnailCover | null;
  onClose: () => void;
};

export function CoverModal({ cover, onClose }: CoverModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (cover) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cover, onClose]);

  if (!cover) return null;

  const displayImgUrl = formatDriveImageUrl(cover.imageUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0c0814]/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="glass-panel glow-border relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] md:rounded-[32px] bg-[#fff5f9]/95 text-[#3d1f35] shadow-[0_25px_80px_rgba(254,158,199,0.25)] border border-[#FE9EC7]/35 animate-in zoom-in-95 duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#FE9EC7]/20 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#FE9EC7] to-[#89D4FF] text-xs text-[#3d1f35]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#a0527a]">
              {cover.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/80 text-[#3d1f35] transition hover:scale-105 hover:bg-[#FE9EC7]/20 hover:border-[#FE9EC7]/60 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 transition group-hover:rotate-90" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Main Image Frame with Fairytale Glow */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#FE9EC7]/30 bg-black/5 shadow-lg">
            <div className="relative aspect-[16/9] w-full bg-slate-900/10">
              {displayImgUrl && (
                <img
                  src={displayImgUrl}
                  alt={cover.title}
                  className="h-full w-full object-contain object-center transition duration-500"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-2xl sm:text-3xl tracking-[-0.02em] text-[#3d1f35]">
                {cover.title}
              </h3>
              {cover.year && (
                <span className="rounded-full border border-[#FE9EC7]/35 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#3d1f35]/75">
                  {cover.year}
                </span>
              )}
            </div>

            {cover.description && (
              <p className="text-sm sm:text-base leading-relaxed text-[#3d1f35]/80">
                {cover.description}
              </p>
            )}

            {cover.client && (
              <p className="text-xs uppercase tracking-[0.2em] text-[#3d1f35]/65 pt-1">
                Client / Brand: <span className="font-semibold text-[#3d1f35]">{cover.client}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
