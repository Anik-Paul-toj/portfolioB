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

// Helper to add Cloudinary auto-format, auto-quality, and scale down transformation for minimum bandwidth
function getOptimizedCloudinaryUrl(url: string, isVideo = false) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  
  if (isVideo) {
    // f_auto: best codec (av1/vp9/h265/mp4), q_auto: optimal visual quality, w_960: max width needed for preview card
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_960,vc_auto/");
    }
  } else {
    // f_auto (webp/avif), q_auto, w_800 for high-res crisp thumbnail with tiny file size
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
    }
  }
  return url;
}

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80";

// Hover-to-play video card component with ultra-low bandwidth consumption
function VideoCard({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isDriveVideo =
    project.sourceType === "DRIVE" ||
    Boolean(project.videoUrl && project.videoUrl.includes("drive.google.com"));

  const rawThumb =
    !isDriveVideo
      ? project.thumbnailUrl?.trim() ||
        project.thumbnail?.trim() ||
        (project.videoUrl && project.videoUrl.includes("res.cloudinary.com")
          ? project.videoUrl.replace(/\.[^/.]+$/, ".jpg")
          : DEFAULT_THUMBNAIL)
      : null;

  const thumbUrl = rawThumb ? getOptimizedCloudinaryUrl(rawThumb, false) : null;
  const optimizedVideoUrl = getOptimizedCloudinaryUrl(project.videoUrl, true);
  const accentGradient = project.accent || "from-[#44ACFF]/75 via-transparent to-[#F9F6C4]/70";
  const isDirectVideo = !isDriveVideo;

  useEffect(() => {
    if (isHovered && isDirectVideo && videoRef.current) {
      setHasInteracted(true);
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered, isDirectVideo]);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="project-card project-sheen group glass-panel glow-border relative block h-[480px] w-full flex-none overflow-hidden rounded-[30px] text-left transition duration-500 hover:-translate-y-2 md:w-[400px] xl:w-[450px]"
    >
      <div className="absolute inset-0">
        {isDriveVideo ? (
          <>
            {/* Elegant pastel card background for Drive videos */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fff6fb] via-white to-[#f0f8ff]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FE9EC7]/20 blur-3xl transition duration-700 group-hover:scale-125" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#44ACFF]/18 blur-3xl transition duration-700 group-hover:scale-125" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fe9ec7_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
          </>
        ) : (
          <>
            {thumbUrl && (
              <Image
                src={thumbUrl}
                alt={project.title || "Project preview"}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className={`object-cover transition duration-700 ${isHovered && isDirectVideo ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
              />
            )}
            {/* Only load video stream when user interacts or hovers to save bandwidth */}
            {isDirectVideo && (
              <video
                ref={videoRef}
                src={hasInteracted || isHovered ? optimizedVideoUrl : undefined}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,245,249,0.10),rgba(255,240,248,0.88))]" />
          </>
        )}
      </div>

      <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} ${isDriveVideo ? "opacity-25" : "opacity-50"}`} />

      <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72 shadow-sm">
            0{index + 1}
          </span>
          <div className="flex items-center gap-2">
            {isDriveVideo && (
              <span className="rounded-full border border-[#44ACFF]/30 bg-[#44ACFF]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#20304a]/75 backdrop-blur-sm">
                Drive Cut
              </span>
            )}
            {project.year && (
              <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72 shadow-sm">
                {project.year}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <p className="mb-2 text-xs uppercase tracking-[0.32em] text-[#3d1f35]/65">{project.category}</p>
          <h3 className="font-display text-3xl md:text-4xl leading-tight tracking-[-0.03em] text-[#3d1f35]">
            {project.title}
          </h3>

          {/* Video Description shown as thumbnail content for Drive videos */}
          {isDriveVideo && project.description && (
            <div className="mt-4 rounded-2xl border border-[#FE9EC7]/30 bg-white/80 p-4 shadow-sm backdrop-blur-md transition group-hover:bg-white/95 group-hover:border-[#FE9EC7]/50">
              <p className="line-clamp-4 text-sm leading-relaxed text-[#3d1f35]/85">
                {project.description}
              </p>
            </div>
          )}

          {isDriveVideo && project.client && (
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#3d1f35]/65">
              Client: <span className="font-semibold text-[#3d1f35]/85">{project.client}</span>
            </p>
          )}

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
