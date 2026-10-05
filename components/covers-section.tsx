"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  THUMBNAIL_CATEGORIES,
  type ThumbnailCover,
} from "@/lib/content";

import { formatDriveImageUrl } from "@/lib/drive";
import coverBg from "@/assets/Editing_atmosphere.png";

type CoversSectionProps = {
  covers?: ThumbnailCover[];
  onSelectCover: (cover: ThumbnailCover) => void;
};

function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return cat.toLowerCase().replace(/edits?|covers?|thumbnails?$/i, "").trim();
}

function matchCategory(coverCat?: string | null, targetCat?: string | null): boolean {
  if (!targetCat || targetCat === "ALL") return true;
  if (!coverCat) return false;
  const cNorm = normalizeCategory(coverCat);
  const tNorm = normalizeCategory(targetCat);
  return cNorm === tNorm || cNorm.includes(tNorm) || tNorm.includes(cNorm);
}

function CoverCard({
  cover,
  index,
  onSelect,
}: {
  cover: ThumbnailCover;
  index: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const imgUrl = formatDriveImageUrl(cover.imageUrl);
  const accentGradient = cover.accent || "from-[#FE9EC7]/70 via-transparent to-[#89D4FF]/65";

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="project-card project-sheen group glass-panel glow-border relative block h-[330px] sm:h-[355px] md:h-[370px] w-[82vw] max-w-[340px] sm:w-[350px] md:w-[380px] xl:w-[410px] flex-none overflow-hidden rounded-[22px] md:rounded-[26px] text-left transition duration-500 hover:-translate-y-2 cursor-pointer"
    >
      {/* Card Background Image */}
      <div className="absolute inset-0 bg-slate-900/10">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={cover.title || "Cover preview"}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-700 ${
              isHovered ? "scale-108" : "scale-100"
            }`}
          />
        )}
        {/* Soft scrim gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,245,249,0.15)_0%,rgba(255,240,248,0.85)_80%,rgba(255,240,248,0.96)_100%)]" />
      </div>

      <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-40`} />

      {/* Card Content Overlay */}
      <div className="relative flex h-full flex-col justify-between p-4.5 sm:p-5 md:p-5.5">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-[#FE9EC7]/40 bg-white/85 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.2em] text-[#3d1f35]/80 shadow-xs backdrop-blur-md">
            0{index + 1}
          </span>
          <div className="flex items-center gap-1.5">
            {cover.year && (
              <span className="rounded-full border border-[#FE9EC7]/40 bg-white/85 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.2em] text-[#3d1f35]/80 shadow-xs backdrop-blur-md">
                {cover.year}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-[#3d1f35]/70 font-semibold">
            {cover.category}
          </p>
          <h3 className="font-display text-xl sm:text-[1.45rem] md:text-[1.55rem] leading-snug tracking-[-0.03em] text-[#3d1f35]">
            {cover.title}
          </h3>

          {cover.description && (
            <div className="mt-2 rounded-xl border border-[#FE9EC7]/30 bg-white/85 p-2.5 shadow-2xs backdrop-blur-md transition group-hover:bg-white/95 group-hover:border-[#FE9EC7]/50">
              <p className="line-clamp-2 text-xs leading-relaxed text-[#3d1f35]/85">
                {cover.description}
              </p>
            </div>
          )}

          {cover.client && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#3d1f35]/65">
              Client: <span className="font-semibold text-[#3d1f35]/85">{cover.client}</span>
            </p>
          )}

          <div className="mt-3.5 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#3d1f35]/80">
            <span>View Full Cover</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/80 text-base text-[#3d1f35] transition group-hover:border-[#FE9EC7]/60 group-hover:bg-[#FE9EC7]/20 shadow-2xs">
              +
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function CoversSection({
  covers: inputCovers,
  onSelectCover,
}: CoversSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const allCovers = useMemo(() => {
    return inputCovers || [];
  }, [inputCovers]);


  // Dynamically extract all available categories
  const categoryTabs = useMemo(() => {
    const existingCats = new Set<string>();
    allCovers.forEach((c) => {
      if (c.category) existingCats.add(c.category);
    });

    const standardCats = [...THUMBNAIL_CATEGORIES];
    const combined = ["ALL", ...standardCats];

    existingCats.forEach((cat) => {
      if (!standardCats.some((sc) => matchCategory(sc, cat))) {
        combined.push(cat);
      }
    });

    return combined;
  }, [allCovers]);

  const filteredCovers = useMemo(() => {
    if (selectedCategory === "ALL") return allCovers;
    return allCovers.filter((c) => matchCategory(c.category, selectedCategory));
  }, [allCovers, selectedCategory]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: filteredCovers.length > 1, dragFree: true },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      emblaApi.reInit();
    }
  }, [selectedCategory, emblaApi, filteredCovers]);

  const getCategoryCount = (cat: string) => {
    if (cat === "ALL") return allCovers.length;
    return allCovers.filter((c) => matchCategory(c.category, cat)).length;
  };

  return (
    <section
      id="covers"
      className="relative scroll-mt-20 py-10 sm:py-12 md:py-16 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Atmosphere Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)] [webkit-mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)]"
        aria-hidden="true"
      >
        <Image
          src={coverBg}
          alt=""
          fill
          className="object-cover object-center opacity-55 md:opacity-65 mix-blend-multiply"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f9]/60 via-transparent to-[#fff5f9]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(137,212,255,0.12),transparent_70%)]" />
      </div>

      {/* Top Transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 z-[1] bg-gradient-to-b from-[#fff5f9] via-[#fff5f9]/60 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom Transition */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 z-[1] bg-gradient-to-t from-[#fff5f9] to-transparent"
        aria-hidden="true"
      />

      <div className="section-shell relative z-[2] overflow-visible">
        {/* Header and navigation */}
        <div
          data-reveal
          className="mb-4 md:mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <span className="section-label">Thumbnails & Covers</span>
            <h2 className="mt-3 md:mt-4 font-display text-[clamp(1.85rem,4.5vw,3.2rem)] leading-[1.03] tracking-[-0.035em] text-[#3d1f35]">
              High-CTR covers and visual design showcase.
            </h2>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end">
            <p className="max-w-md text-xs leading-relaxed text-[#3d1f35]/65 sm:text-sm text-left md:text-right">
              Viral YouTube thumbnails, Instagram reel covers, podcast artwork, and social branding designed for maximum clickability and aesthetic polish.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/70 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20 shadow-2xs cursor-pointer text-sm"
                aria-label="Previous cover"
              >
                ←
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/70 text-[#3d1f35] backdrop-blur-sm transition hover:bg-[#FE9EC7]/20 shadow-2xs cursor-pointer text-sm"
                aria-label="Next cover"
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
              const label = isAll ? "All Covers" : cat;

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

      {/* Covers Carousel View */}
      <div className="w-full px-4 sm:px-6 md:pl-12 lg:pl-16 relative z-[2]">
        {filteredCovers && filteredCovers.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 pr-12 pb-6">
              {filteredCovers.map((cover, index) => (
                <CoverCard
                  key={cover.id || `${cover.title}-${index}`}
                  cover={cover}
                  index={index}
                  onSelect={() => onSelectCover(cover)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/40 backdrop-blur-md p-10 text-center mx-4 sm:mx-6 md:mr-12 lg:mr-16 shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#FE9EC7]/40 to-[#89D4FF]/40 border border-[#FE9EC7]/40 text-xl text-[#3d1f35] mb-3.5">
              🎨
            </div>
            <p className="font-display text-2xl md:text-3xl text-[#3d1f35]">
              New {selectedCategory} covers coming soon.
            </p>
            <p className="mt-2 text-sm text-[#3d1f35]/65 max-w-md">
              Fresh visual designs for this category are being prepared.
            </p>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FE9EC7]/40 bg-white/80 px-6 py-2.5 text-xs uppercase tracking-[0.22em] text-[#3d1f35] font-semibold transition hover:bg-[#FE9EC7]/20 shadow-xs cursor-pointer"
            >
              ← View All Covers
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
