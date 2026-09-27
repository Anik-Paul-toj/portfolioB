import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { projects as defaultProjects, PORTFOLIO_CATEGORIES, type Project } from "@/lib/content";
import reelBg from "@/assets/A_reel_built.png";

type ProjectsSectionProps = {
  projects: Project[];
  onSelectProject: (project: Project) => void;
};

function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return cat.toLowerCase().replace(/edits?$/i, "").trim();
}

function matchCategory(projectCat?: string | null, targetCat?: string | null): boolean {
  if (!targetCat || targetCat === "ALL") return true;
  if (!projectCat) return false;
  const pNorm = normalizeCategory(projectCat);
  const tNorm = normalizeCategory(targetCat);
  return pNorm === tNorm || pNorm.includes(tNorm) || tNorm.includes(pNorm);
}

// Helper to add Cloudinary auto-format, auto-quality, and scale down transformation for minimum bandwidth
function getOptimizedCloudinaryUrl(url: string, isVideo = false) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  
  if (isVideo) {
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_960,vc_auto/");
    }
  } else {
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
      className="project-card project-sheen group glass-panel glow-border relative block h-[360px] sm:h-[385px] md:h-[400px] w-[80vw] max-w-[310px] sm:w-[330px] md:w-[360px] xl:w-[390px] flex-none overflow-hidden rounded-[22px] md:rounded-[26px] text-left transition duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="absolute inset-0">
        {isDriveVideo ? (
          <>
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

      <div className="relative flex h-full flex-col justify-between p-4.5 sm:p-5 md:p-5.5">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.2em] text-[#3d1f35]/75 shadow-xs">
            0{index + 1}
          </span>
          <div className="flex items-center gap-1.5">
            {isDriveVideo && (
              <span className="rounded-full border border-[#44ACFF]/30 bg-[#44ACFF]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#20304a]/75 backdrop-blur-sm">
                Drive Cut
              </span>
            )}
            {project.year && (
              <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.2em] text-[#3d1f35]/75 shadow-xs">
                {project.year}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-[#3d1f35]/65">{project.category}</p>
          <h3 className="font-display text-2xl sm:text-[1.65rem] md:text-[1.8rem] leading-tight tracking-[-0.03em] text-[#3d1f35]">
            {project.title}
          </h3>

          {isDriveVideo && project.description && (
            <div className="mt-2.5 rounded-xl border border-[#FE9EC7]/30 bg-white/85 p-2.5 shadow-2xs backdrop-blur-md transition group-hover:bg-white/95 group-hover:border-[#FE9EC7]/50">
              <p className="line-clamp-2 md:line-clamp-3 text-xs leading-relaxed text-[#3d1f35]/85">
                {project.description}
              </p>
            </div>
          )}

          {isDriveVideo && project.client && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#3d1f35]/65">
              Client: <span className="font-semibold text-[#3d1f35]/85">{project.client}</span>
            </p>
          )}

          <div className="mt-3.5 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#3d1f35]/75">
            <span>Open Preview</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/75 text-base text-[#3d1f35] transition group-hover:border-[#FE9EC7]/60 group-hover:bg-[#FE9EC7]/18 shadow-2xs">
              +
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function ProjectsSection({ projects: inputProjects, onSelectProject }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const allProjects = useMemo(() => {
    return inputProjects && inputProjects.length > 0 ? inputProjects : defaultProjects;
  }, [inputProjects]);

  // Dynamically extract all available categories, preserving standard categories list
  const categoryTabs = useMemo(() => {
    const existingCats = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category) existingCats.add(p.category);
    });

    const standardCats = [...PORTFOLIO_CATEGORIES];
    const combined = ["ALL", ...standardCats];

    // Add any existing category from projects that wasn't in standardCats
    existingCats.forEach((cat) => {
      if (!standardCats.some((sc) => matchCategory(sc, cat))) {
        combined.push(cat);
      }
    });

    return combined;
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "ALL") return allProjects;
    return allProjects.filter((p) => matchCategory(p.category, selectedCategory));
  }, [allProjects, selectedCategory]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: filteredProjects.length > 1, dragFree: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);

  // Reset carousel position when category filter changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      emblaApi.reInit();
    }
  }, [selectedCategory, emblaApi, filteredProjects]);

  const getCategoryCount = (cat: string) => {
    if (cat === "ALL") return allProjects.length;
    return allProjects.filter((p) => matchCategory(p.category, cat)).length;
  };

  return (
    <section id="projects" className="relative scroll-mt-20 py-8 sm:py-10 md:py-12 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Decorative Atmosphere Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)] [webkit-mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)]"
        aria-hidden="true"
      >
        <Image
          src={reelBg}
          alt=""
          fill
          className="object-cover object-center opacity-65 md:opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f9]/50 via-transparent to-[#fff5f9]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,158,199,0.08),transparent_75%)]" />
      </div>

      {/* Dedicated seamless top transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 z-[1] bg-gradient-to-b from-[#fff5f9] via-[#fff5f9]/60 to-transparent"
        aria-hidden="true"
      />

      {/* Soft bottom blend into subsequent section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28 z-[1] bg-gradient-to-t from-[#fff5f9] to-transparent"
        aria-hidden="true"
      />

      <div className="section-shell relative z-[2] overflow-visible">
        {/* Header and navigation */}
        <div data-reveal className="mb-4 md:mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="section-label">Projects</span>
            <h2 className="mt-3 md:mt-4 font-display text-[clamp(1.85rem,4.5vw,3.2rem)] leading-[1.03] tracking-[-0.035em] text-[#3d1f35]">
              A reel built for glow, pace, and impact.
            </h2>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end">
            <p className="max-w-md text-xs leading-relaxed text-[#3d1f35]/60 sm:text-sm text-left md:text-right">
              Selected edits across creator, brand, and social systems. Select a category or view all motion.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/60 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20 shadow-2xs cursor-pointer text-sm"
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/60 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20 shadow-2xs cursor-pointer text-sm"
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div data-reveal className="mb-6 md:mb-7">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-1">
            {categoryTabs.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = getCategoryCount(cat);
              const isAll = cat === "ALL";
              const label = isAll ? "All Edits" : cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "button-glow bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] text-[#3d1f35] font-bold shadow-[0_4px_16px_rgba(254,158,199,0.32)] scale-[1.03] border border-white/60"
                      : "border border-[#FE9EC7]/25 bg-white/70 text-[#3d1f35]/75 hover:bg-white/95 hover:text-[#3d1f35] hover:border-[#FE9EC7]/50 backdrop-blur-md shadow-2xs"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[9.5px] font-semibold transition ${
                      isActive
                        ? "bg-[#3d1f35]/15 text-[#3d1f35]"
                        : count > 0
                        ? "bg-[#FE9EC7]/20 text-[#a0527a]"
                        : "bg-black/5 text-[#3d1f35]/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Carousel / Grid View */}
      <div className="w-full px-4 sm:px-6 md:pl-12 lg:pl-16 relative z-[2]">
        {filteredProjects && filteredProjects.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 pr-12 pb-6">
              {filteredProjects.map((project, index) => (
                <VideoCard
                  key={project.id || `${project.title}-${index}`}
                  project={project}
                  index={index}
                  onSelect={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/40 backdrop-blur-md p-10 text-center mx-4 sm:mx-6 md:mr-12 lg:mr-16 shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#FE9EC7]/40 to-[#89D4FF]/40 border border-[#FE9EC7]/40 text-xl text-[#3d1f35] mb-3.5">
              ✨
            </div>
            <p className="font-display text-2xl md:text-3xl text-[#3d1f35]">
              New {selectedCategory} edits coming soon.
            </p>
            <p className="mt-2 text-sm text-[#3d1f35]/65 max-w-md">
              Fresh cuts for this category are currently in the editing suite. Explore other categories or view all works.
            </p>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FE9EC7]/40 bg-white/80 px-6 py-2.5 text-xs uppercase tracking-[0.22em] text-[#3d1f35] font-semibold transition hover:bg-[#FE9EC7]/20 shadow-xs cursor-pointer"
            >
              ← View All Edits
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
