import Image from "next/image";
import Grainient from "@/components/Grainient";
import castleOverlay from "@/assets/castle-overlay.png";
import { FairytalePortrait } from "@/components/fairytale-portrait";





export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-28 md:py-20 lg:py-0"
    >
      {/* Grainient WebGL animated gradient background */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#fe9ec7"
          color2="#44acff"
          color3="#f9f6c4"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Soft scrim so text stays readable over the gradient */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,245,249,0.55)_55%,rgba(255,245,249,0.88)_100%)]" />

      <div className="gradient-ring left-[-10%] top-[18%] h-64 w-64 bg-[#FE9EC7]/30 z-[1]" />
      <div className="gradient-ring bottom-[14%] right-[-6%] h-72 w-72 bg-[#89D4FF]/28 z-[1]" />

      {/* Decorative Fairytale Castle Foreground Overlay */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-2%] sm:bottom-[-4%] md:bottom-[-2%] lg:bottom-0 z-[1] flex items-end justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="relative w-[110%] sm:w-[94%] md:w-[86%] lg:w-[78%] xl:w-[72%] max-w-[1280px] aspect-[16/9] animate-castle-float opacity-45 sm:opacity-50 md:opacity-60 transition-opacity duration-700">
          <Image
            src={castleOverlay}
            alt=""
            priority
            className="h-full w-full object-contain object-bottom [mask-image:radial-gradient(ellipse_at_50%_70%,black_50%,transparent_90%)] [filter:drop-shadow(0_0_35px_rgba(254,158,199,0.25))_drop-shadow(0_0_20px_rgba(137,212,255,0.20))]"
          />
        </div>
      </div>

      {/* Seamless bottom transition layer blending into About section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 md:h-52 z-[1] bg-gradient-to-b from-transparent via-[#fff5f9]/50 to-[#fff5f9]"
        aria-hidden="true"
      />

      <div className="section-shell relative z-[2] flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <div className="hero-badge section-label mb-2.5">Cinematic Video Editor</div>
          <p className="hero-kicker mb-2.5 max-w-xl text-xs md:text-sm uppercase tracking-[0.38em] text-[#3d1f35]/60">
            Premium edits. Soft neon finish. Story-first motion.
          </p>
          <h1 className="text-glow font-display text-[clamp(2.3rem,6vw,5.6rem)] leading-[0.94] md:leading-[0.9] tracking-[-0.04em] text-[#3d1f35]">
            <span className="hero-title-line flex items-baseline gap-[0.2em] block">
              <span className="font-signature font-normal text-[clamp(4.2rem,10vw,8.2rem)] leading-[1.05] tracking-[0.02em] inline-block text-[#3d1f35] drop-shadow-[0_2px_16px_rgba(254,158,199,0.32)]">
                Ampita
              </span>
            </span>
            <span className="hero-title-line headline-gradient block">Cuts that feel cinematic.</span>
          </h1>
          <p className="hero-subtitle mt-3 max-w-xl text-sm leading-6 text-[#3d1f35]/70 md:text-base md:leading-6">
            Crafting music visuals, branded films, and performance edits with polished rhythm, color, and atmosphere.
          </p>

          <div className="hero-cta mt-6 flex flex-col gap-3.5 sm:flex-row relative overflow-visible">
            <a
              href="#projects"
              className="button-glow button-bloom inline-flex w-full sm:w-auto items-center justify-center rounded-full border px-6 py-2.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]"
            >
              <span className="button-bloom__label">View Reel</span>
            </a>
            <a
              href="#contact"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[#FE9EC7]/25 bg-white/80 px-6 py-2.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]/80 transition hover:border-[#FE9EC7]/55 hover:bg-white hover:text-[#3d1f35]"
            >
              Start a Project
            </a>
          </div>
        </div>

        <FairytalePortrait />
      </div>
    </section>
  );
}
