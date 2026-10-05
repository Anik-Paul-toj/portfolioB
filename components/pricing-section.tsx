"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { pricingPlans, type PricingPlan } from "@/lib/content";
import pricingBg from "@/assets/ChatGPT Image Sep 27, 2026, 10_53_32 AM.png";

type PricingSectionProps = {
  plans?: PricingPlan[];
};

function PricingCard({
  plan,
  isFeatured,
  isMobileActive,
}: {
  plan: PricingPlan;
  isFeatured: boolean;
  isMobileActive?: boolean;
}) {
  return (
    <article
      className={`relative flex flex-col justify-between rounded-[24px] sm:rounded-[26px] md:rounded-[28px] p-4 sm:p-5.5 lg:p-5.5 xl:p-6.5 transition-all duration-500 h-full ${
        isFeatured
          ? "glass-panel glow-border lg:-translate-y-2 lg:hover:-translate-y-3.5 shadow-[0_24px_65px_rgba(254,158,199,0.24),0_0_0_1px_rgba(255,255,255,0.95)_inset,0_0_45px_rgba(137,212,255,0.18)] bg-gradient-to-b from-white via-[#fff2f8]/95 to-[#fff8fc]/90 z-10"
          : "glass-panel lg:hover:-translate-y-2 shadow-[0_16px_45px_rgba(254,158,199,0.10),0_0_0_1px_rgba(255,255,255,0.85)_inset] bg-gradient-to-b from-white/95 via-[#fff8fb]/90 to-white/90"
      }`}
    >
      {/* Visual Ambient Glow Inside Featured Card */}
      {isFeatured && (
        <>
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#FE9EC7]/20 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#89D4FF]/18 blur-2xl"
            aria-hidden="true"
          />
        </>
      )}

      <div>
        {/* Top Bar: Plan Index/Label & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FE9EC7]/35 bg-white/85 px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3d1f35]/80 backdrop-blur-sm shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FE9EC7]" />
            {plan.planNumber}
          </span>

          {plan.badge && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FE9EC7]/60 bg-gradient-to-r from-[#FE9EC7]/30 via-[#F9F6C4]/35 to-[#89D4FF]/30 px-2 py-0.5 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#3d1f35] shadow-[0_0_14px_rgba(254,158,199,0.32)] backdrop-blur-md animate-pulse">
              <span className="text-[#3d1f35]">✦</span>
              {plan.badge}
            </span>
          )}
        </div>

        {/* Package Name */}
        <h3 className="font-display text-[1.35rem] sm:text-[1.65rem] xl:text-[1.85rem] leading-tight tracking-[-0.03em] text-[#3d1f35]">
          {plan.name}
        </h3>

        {/* Creative Tagline */}
        <p className="mt-1 text-[11.5px] sm:text-[13px] leading-snug text-[#3d1f35]/70 min-h-[30px] sm:min-h-[34px]">
          {plan.tagline}
        </p>

        {/* Price Block */}
        <div className="mt-3 pt-3 sm:mt-3.5 sm:pt-3.5 border-t border-[#FE9EC7]/20">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl sm:text-4xl xl:text-[2.5rem] leading-none tracking-tight text-[#3d1f35] font-bold">
              {plan.price}
            </span>
            <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-[#3d1f35]/60">
              {plan.period}
            </span>
          </div>

          {/* Additional Charge (Plan 03 Meta charge) */}
          {plan.additionalCharge ? (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#44ACFF]/30 bg-gradient-to-r from-[#89D4FF]/15 via-white to-[#FE9EC7]/15 px-2 py-0.5 text-[10.5px] font-semibold text-[#2b2b45] shadow-2xs backdrop-blur-sm">
              <span className="text-[#44ACFF]">ℹ</span>
              <span>{plan.additionalCharge}</span>
            </div>
          ) : (
            <div className="h-0 lg:h-1" />
          )}
        </div>

        {/* Deliverables List */}
        <div className="mt-3.5 pt-3 sm:mt-4 sm:pt-3.5 border-t border-[#FE9EC7]/20">
          <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.24em] text-[#a0527a] mb-2 sm:mb-2.5">
            DELIVERABLES INCLUDED
          </p>
          <ul className="space-y-1.5 sm:space-y-2 xl:space-y-2.5" role="list">
            {plan.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11.5px] sm:text-[13px] leading-tight text-[#3d1f35]/85">
                <span
                  className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#FE9EC7]/40 to-[#89D4FF]/40 border border-[#FE9EC7]/40 text-[8.5px] sm:text-[9px] text-[#3d1f35] font-bold shadow-2xs"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="flex-1">
                  <span className="font-medium text-[#3d1f35]">{item.text}</span>
                  {item.note && (
                    <span className="block text-[10.5px] sm:text-[11px] text-[#3d1f35]/60 font-normal">
                      {item.note}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="mt-4 pt-3 sm:mt-5 sm:pt-3.5 border-t border-[#FE9EC7]/20">
        <a
          href="#contact"
          className={`w-full inline-flex items-center justify-center rounded-full py-2 sm:py-2.5 px-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
            isFeatured
              ? "button-glow button-bloom border border-white/60 bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] text-[#3d1f35] shadow-[0_4px_20px_rgba(254,158,199,0.32)] hover:scale-[1.02]"
              : "border border-[#FE9EC7]/40 bg-white/90 text-[#3d1f35] hover:bg-gradient-to-r hover:from-[#FE9EC7]/20 hover:to-[#89D4FF]/20 hover:border-[#FE9EC7]/60 hover:text-[#3d1f35] shadow-2xs"
          }`}
        >
          <span className={isFeatured ? "button-bloom__label" : ""}>
            {plan.cta} {isFeatured ? "✨" : "→"}
          </span>
        </a>
      </div>
    </article>
  );
}

export function PricingSection({ plans = pricingPlans }: PricingSectionProps) {
  // Embla Carousel for mobile / tablet viewports
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1, // Start directly on the featured middle plan (The Glow-Up)
    align: "center",
    containScroll: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(1);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 py-10 md:py-14 lg:py-16 min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Content Pricing Systems"
    >
      {/* Decorative Atmosphere Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-100px),transparent_100%)] [webkit-mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-100px),transparent_100%)]"
        aria-hidden="true"
      >
        <Image
          src={pricingBg}
          alt=""
          fill
          className="object-cover object-center opacity-65 md:opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Soft pastel and ambient glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f9]/50 via-transparent to-[#fff5f9]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,158,199,0.08),transparent_75%)]" />
      </div>

      {/* Dedicated seamless top transition blending smoothly */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 z-[1] bg-gradient-to-b from-[#fff5f9] via-[#fff5f9]/60 to-transparent"
        aria-hidden="true"
      />

      {/* Soft bottom blend into subsequent section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 z-[1] bg-gradient-to-t from-[#fff5f9] to-transparent"
        aria-hidden="true"
      />

      <div className="section-shell relative z-[2]">
        {/* Section Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FE9EC7]/35 bg-white/75 px-3.5 py-1 backdrop-blur-md shadow-xs mb-3">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-[#a0527a]">
              SO… WHAT’S YOUR LEVEL?
            </span>
          </div>

          <h2 className="font-display text-[clamp(1.85rem,4vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-[#3d1f35]">
            Pick your level of{" "}
            <span className="headline-gradient">content domination.</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#3d1f35]/70 max-w-xl mx-auto">
            From consistent Instagram growth to a full-stack content presence — choose the system that matches your ambition.
          </p>
        </div>

        {/* 1. Desktop Layout (lg and up): 3-column Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5 xl:gap-6 items-stretch">
          {plans.map((plan) => {
            const isFeatured = Boolean(plan.featured);
            return (
              <div key={plan.id} data-reveal className="h-full">
                <PricingCard plan={plan} isFeatured={isFeatured} />
              </div>
            );
          })}
        </div>

        {/* 2. Mobile / Tablet Layout (< lg): Center-Focused Swipeable Carousel */}
        <div className="lg:hidden" data-reveal>
          <div className="overflow-hidden py-4 -mx-4 px-4 sm:-mx-6 sm:px-6" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4 items-stretch">
              {plans.map((plan, index) => {
                const isFeatured = Boolean(plan.featured);
                const isActive = selectedIndex === index;

                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (!isActive) scrollTo(index);
                    }}
                    className={`flex-none w-[70vw] max-w-[275px] sm:w-[62vw] sm:max-w-[310px] transition-all duration-500 ease-out flex flex-col ${
                      isActive
                        ? "scale-100 opacity-100 z-10"
                        : "scale-[0.88] opacity-70 hover:opacity-90 cursor-pointer z-0"
                    }`}
                  >
                    <PricingCard
                      plan={plan}
                      isFeatured={isFeatured}
                      isMobileActive={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Carousel Swipe Dots & Controls */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {plans.map((plan, index) => {
              const isActive = selectedIndex === index;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-7 bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] shadow-[0_0_10px_rgba(254,158,199,0.5)]"
                      : "w-2 bg-[#3d1f35]/20 hover:bg-[#3d1f35]/40"
                  }`}
                  aria-label={`Go to ${plan.name}`}
                />
              );
            })}
          </div>

          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[#3d1f35]/50 mt-2.5">
            ← Swipe to explore packages →
          </p>
        </div>
      </div>
    </section>
  );
}

