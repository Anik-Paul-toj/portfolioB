"use client";

import { useEffect } from "react";
import type { Project } from "@/lib/content";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project]);

  if (!project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(255,255,255,0.8)] px-4 py-8 backdrop-blur-xl">
      <button type="button" aria-label="Close modal" className="absolute inset-0" onClick={onClose} />
      <div className="glass-panel relative z-10 w-full max-w-5xl overflow-hidden rounded-[34px] border border-white/70">
        <div className="flex items-center justify-between border-b border-[#44ACFF]/12 px-5 py-4 md:px-7">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#44ACFF]">{project.category}</p>
            <h3 className="mt-2 font-display text-3xl text-[#20304a]">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#44ACFF]/16 bg-white/80 text-xl text-[#20304a]/82 transition hover:border-[#44ACFF]/36 hover:text-[#20304a]"
            aria-label="Close project preview"
          >
            X
          </button>
        </div>

        <div className="bg-white/42 p-4 md:p-6">
          <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/70 shadow-[0_20px_50px_rgba(68,172,255,0.1)]">
            <video
              src={project.videoUrl}
              className="aspect-video w-full"
              controls
              autoPlay
              playsInline
              poster={project.thumbnail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
