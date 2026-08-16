"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Project } from "@/lib/content";

type ProjectsSectionProps = {
  projects: Project[];
  onSelectProject: (project: Project) => void;
};

// Hover-to-play video card component
function VideoCard({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  const thumbUrl = project.thumbnailUrl || project.thumbnail || "";
  const accentGradient = project.accent || "from-[#44ACFF]/75 via-transparent to-[#F9F6C4]/70";

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="project-card project-sheen group glass-panel glow-border relative block h-[480px] w-full flex-none overflow-hidden rounded-[30px] text-left transition duration-500 hover:-translate-y-2 md:w-[400px] xl:w-[450px]"
    >
      <div className="absolute inset-0">
        <Image
          src={thumbUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`object-cover transition duration-700 ${isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
        />
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,245,249,0.10),rgba(255,240,248,0.88))]" />
      <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-50`} />

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72">
            0{index + 1}
          </span>
          {project.year && (
            <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72">
              {project.year}
            </span>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-[#3d1f35]/65">{project.category}</p>
          <h3 className="font-display text-4xl leading-none tracking-[-0.03em] text-[#3d1f35]">{project.title}</h3>
          <div className="mt-5 inline-flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[#3d1f35]/73">
            <span>Open Preview</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/72 text-lg text-[#3d1f35] transition group-hover:border-[#FE9EC7]/60 group-hover:bg-[#FE9EC7]/18">
              +
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function ProjectsSection({ projects, onSelectProject }: ProjectsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);

  return (
    <section id="projects" className="scroll-mt-28 py-24 md:py-32">
      <div className="section-shell relative overflow-visible">

        <div data-reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Projects</span>
            <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
              A reel built for glow, pace, and impact.
            </h2>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <p className="max-w-lg text-sm leading-7 text-[#3d1f35]/60 md:text-base md:text-right">
              Selected edits across music, brand, beauty, and event visuals. Tap any piece to preview the motion.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/50 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20"
              >
                ←
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/50 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pl-6 md:pl-12 lg:pl-16">
        {projects && projects.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 pr-12 pb-8">
              {projects.map((project, index) => (
                <VideoCard
                  key={project.id || project.title}
                  project={project}
                  index={index}
                  onSelect={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-white/40 bg-white/30 backdrop-blur-md mx-6 md:mx-0 md:mr-12 lg:mr-16">
            <p className="font-display text-2xl text-[#3d1f35]/60">The reel is coming together.</p>
          </div>
        )}
      </div>
    </section>
  );
}
