import Image from "next/image";
import Grainient from "@/components/Grainient";
import picmixGif from "@/picmix.com_336548.gif";
import { BloomButtonOrnaments } from "@/components/bloom-button-ornaments";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-end overflow-hidden pb-14 pt-28 md:items-center md:pb-0"
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

      <div className="section-shell relative z-[2] flex flex-col gap-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-4xl">
          <div className="hero-badge section-label mb-6">Cinematic Video Editor</div>
          <p className="hero-kicker mb-5 max-w-xl text-sm uppercase tracking-[0.45em] text-[#3d1f35]/60">
            Premium edits. Soft neon finish. Story-first motion.
          </p>
          <h1 className="text-glow max-w-5xl font-display text-[clamp(3.8rem,11vw,8.8rem)] leading-[0.88] tracking-[-0.05em] text-[#3d1f35]">
            <span className="hero-title-line flex items-center gap-[0.18em] block">
              <span className="inline-flex w-[0.42em] translate-y-[-0.02em] text-[#FE9EC7] opacity-90">
                <svg viewBox="0 0 11.67 37.63" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full fill-current">
                  <path d="M7.63 35.26c-0.02,0.13 0.01,0.05 -0.06,0.14 -0,0 -0.08,0.07 -0.11,0.1 -0.42,0.25 -0.55,0.94 -0.23,1.4 0.68,0.95 2.66,0.91 3.75,0.21 0.2,-0.13 0.47,-0.3 0.57,-0.49 0.09,-0.02 0.04,0.03 0.11,-0.07l-1.35 -1.24c-0.78,-0.78 -1.25,-1.9 -2.07,-0.62 -0.11,0.18 -0.06,0.16 -0.22,0.26 -0.4,-0.72 -0.95,-1.79 -1.26,-2.59 0.82,0.02 1.57,-0.12 2.16,-0.45 0.49,-0.27 1.15,-0.89 1.33,-1.4 0.1,-0.06 0.02,0.01 0.06,-0.1 -0.24,-0.16 -0.87,-0.37 -1.19,-0.52 -0.4,-0.19 -0.73,-0.39 -1.09,-0.62 -0.25,-0.16 -0.85,-0.6 -1.18,-0.3 -0.35,0.32 -0.32,0.83 -0.53,1.17 -0.71,-0.3 -0.55,-0.26 -0.84,-1.22 -0.15,-0.5 -0.31,-1.12 -0.41,-1.66l0.03 -0.13c0.56,0.23 1.28,0.37 1.99,0.28 0.56,-0.07 1.33,-0.42 1.62,-0.71l0.1 -0.1c-0.74,-0.68 -1.09,-1.2 -1.65,-1.99 -1.09,-1.52 -1.2,-0.28 -1.92,0.17 -0.26,-0.79 -0.73,0.2 -0.12,-2.76 0.06,-0.3 0.19,-0.7 0.2,-0.98 0.18,0.08 0.01,-0.01 0.11,0.08 0.05,0.05 0.07,0.07 0.1,0.12 0.94,1.17 3.63,0.82 4.21,0.01 0.13,-0.02 0.06,0.03 0.1,-0.1 -1.14,-0.81 -1.91,-2.89 -2.58,-2.67 -0.29,0.09 -0.78,0.63 -0.93,0.87 -0.54,-0.48 -0.36,-0.63 -0.38,-0.81 0.01,-0.01 0.03,-0.04 0.03,-0.03 0.01,0.02 0.36,-0.35 0.45,-0.6 0.13,-0.35 0.04,-0.65 -0.05,-0.95 0.06,-0.41 0.33,-1.33 0.28,-1.71 0.22,-0.05 0.19,0.05 0.45,0.17 0.47,0.23 1.17,0.33 1.7,0.32 0.62,-0 1.74,-0.39 1.94,-0.75 0.14,-0.02 0.05,0.06 0.13,-0.09 -1.05,-1.1 -0.7,-0.64 -1.62,-1.92 -0.58,-0.81 -0.9,-1.27 -1.9,0.12 -0.44,-0.5 -0.64,-0.69 -0.66,-1.24 0.02,-0.31 0.15,-0.36 0.08,-0.73 -0.04,-0.24 -0.14,-0.41 -0.29,-0.59l-0.47 -2.54c0.09,-0.14 -0.09,-0.1 0.2,-0.05 0.06,0.01 0.19,0.05 0.3,0.07 0.54,0.09 1.47,0.01 1.95,-0.15 0.57,-0.19 1.53,-0.8 1.68,-1.18 0.16,-0.07 0.05,0.02 0.15,-0.13 -0.12,-0.15 -0.95,-0.65 -1.15,-0.8 -1.43,-1.08 -2.21,-2.77 -3.16,-0.38 -0.2,-0.1 -0.75,-0.55 -0.83,-0.74 -0.15,-0.35 -0.21,-0.81 -0.37,-1.15l-0.1 -0.25c-0.03,-0.3 -0.44,-1.33 -0.57,-1.64 -0.2,-0.51 -0.47,-1.09 -0.64,-1.6l-0.55 0c0.14,0.42 0.36,0.84 0.53,1.28 0.12,0.3 0.19,0.35 0.06,0.66l-0.21 0.52c-0.01,0.01 -0.01,0.02 -0.02,0.03 -0.06,0.1 -0.03,0.05 -0.06,0.09 -1.44,-1.03 -1.66,-0.73 -2.07,0.46 -0.16,0.46 -0.3,0.93 -0.5,1.36l-0.64 1.28c0.06,0.07 -0,0.03 0.1,0.03 0.05,0.05 0.02,0.03 0.1,0.08l0.49 0.14c0.23,0.05 0.44,0.09 0.66,0.1 0.55,0.04 0.94,-0.06 1.35,-0.19 0.54,-0.18 1.09,-0.44 1.5,-0.82 0.15,-0.14 0.24,-0.3 0.4,-0.41l0.46 1.66c0.03,0.74 -0.09,0.6 0.27,1.21 0.01,0.01 0.01,0.02 0.02,0.03 0.01,0.01 0.01,0.02 0.02,0.04l0.07 0.11c-0.02,0.22 0.19,1.01 0.24,1.29 0.09,0.46 -0.21,0.79 -0.3,1.2 -0.55,-0.23 -1.25,-1.06 -1.66,-0.23 -0.12,0.25 -0.17,0.36 -0.26,0.62 -0.33,1.01 -0.63,1.61 -1.06,2.43l0.12 0.04 0.23 0.11c0.06,0.02 0.17,0.04 0.25,0.06 0.17,0.04 0.34,0.08 0.52,0.09 0.29,0.02 0.93,0.07 1.12,-0.13 0.42,0.01 1.24,-0.49 1.51,-0.71 0.01,0.01 0.03,0 0.04,0.02l0.09 0.06c-0.04,0.29 0.02,0.41 0.03,0.7l-0.05 1.41c-0.06,1.12 -0.29,1.06 -0.76,1.69 -0.08,-0.07 -0.03,-0.01 -0.11,-0.11 -0.03,-0.03 -0.06,-0.08 -0.09,-0.11 -0.2,-0.25 -0.38,-0.54 -0.7,-0.69 -0.7,-0.32 -1.52,1.73 -2.82,2.61 0.04,0.2 -0.01,0.06 0.1,0.11 0.25,0.3 1,0.67 1.5,0.78 0.35,0.08 0.71,0.08 1.09,0.05 0.25,-0.02 0.82,-0.16 0.92,-0.13 -0.16,0.69 -0.35,1.35 -0.52,2.03 -0.25,1 -0.03,0.77 -0.98,1.53 -0.3,-0.31 -0.33,-0.77 -0.77,-1.02 -0.42,-0.25 -0.91,0.35 -1.12,0.55 -0.33,0.32 -0.58,0.6 -0.97,0.89 -0.19,0.14 -0.34,0.26 -0.53,0.4 -0.14,0.11 -0.43,0.29 -0.53,0.4 0.1,0.15 -0.02,0.06 0.15,0.13 0.09,0.22 0.35,0.38 0.54,0.52 0.22,0.16 0.43,0.29 0.69,0.39 0.43,0.17 1.32,0.31 1.87,0.23l0.23 -0.05c0.01,-0 0.03,-0.02 0.04,-0.02 0.01,-0 0.02,-0.01 0.03,-0.02 0.32,0.05 0.52,-0.18 0.79,-0.24l-0.02 0.66c0,0.77 -0.24,0.75 0.16,1.51l0.04 0.07c0,0.01 0.01,0.03 0.02,0.04 -0.05,0.35 0.18,1.03 0.24,1.4 -0.23,0.18 -0.34,0.33 -0.51,0.41 -0.75,-1.17 -0.82,-1.52 -1.92,-0.43 -0.32,0.31 -0.59,0.57 -0.95,0.86 -0.23,0.19 -0.95,0.65 -1.05,0.81l0.13 0.1c0.88,1.15 3.14,1.5 4.1,0.82 0.47,-0.34 0.54,-0.56 0.52,-1.34l0.67 1.84c0.03,0.16 0.06,0.28 0.12,0.42 0.03,0.06 0.05,0.12 0.09,0.17 0.1,0.15 0.03,0.06 0.13,0.14 -0,0.29 0.14,0.22 0.06,0.56 -0.03,0.13 -0.14,0.43 -0.19,0.53 -1.94,-1.27 -1.57,-0.02 -2.28,1.76 -0.16,0.41 -0.37,0.77 -0.53,1.2 0.09,0.08 0.01,0.03 0.15,0.03 0.29,0.33 1.66,0.28 2.36,-0.01 0.48,-0.2 0.96,-0.46 1.3,-0.82 0.15,-0.16 0.16,-0.3 0.38,-0.33 0.14,0.08 0.17,0.19 0.27,0.36" />
                </svg>
              </span>
              <span>Ampita</span>
              <span>Das</span>
            </span>
            <span className="hero-title-line headline-gradient block">Cuts that feel cinematic.</span>
          </h1>
          <p className="hero-subtitle mt-6 max-w-2xl text-base leading-7 text-[#3d1f35]/70 md:text-lg">
            Crafting music visuals, branded films, and performance edits with polished rhythm, color, and atmosphere.
          </p>

          <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#projects"
              className="button-glow button-bloom inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]"
            >
              <span className="button-bloom__label">View Reel</span>
              <BloomButtonOrnaments />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[#FE9EC7]/25 bg-white/80 px-6 py-3.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]/80 transition hover:border-[#FE9EC7]/55 hover:bg-white hover:text-[#3d1f35]"
            >
              Start a Project
            </a>
          </div>
        </div>

        <div data-reveal className="relative ml-auto w-full max-w-sm md:mr-3">
          <Image
            src={picmixGif}
            alt=""
            priority
            className="pointer-events-none absolute left-1/2 top-[-180px] z-0 h-auto w-[170px] -translate-x-1/2 md:top-[-200px] md:w-[190px]"
          />

          <div className="glass-panel glow-border relative z-[1] rounded-[30px] p-6 md:p-7">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.32em] text-[#3d1f35]/52">Selected Frames</span>
              <span className="rounded-full border border-[#FE9EC7]/45 bg-[#FE9EC7]/12 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#3d1f35]">
                2024-2026
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
              ].map((frame, index) => (
                <div
                  key={frame}
                  className={`relative overflow-hidden rounded-[20px] ring-1 ring-[#FE9EC7]/30 ${
                    index === 1 ? "translate-y-5" : index === 2 ? "translate-y-2" : ""
                  }`}
                >
                  <Image
                    src={frame}
                    alt="Video editing preview frame"
                    width={300}
                    height={220}
                    sizes="(max-width: 768px) 33vw, 160px"
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#3d1f35]/46">Signature</p>
                <p className="mt-2 text-sm leading-6 text-[#3d1f35]/70">
                  Neon softness, musical pacing, and crisp transitions built for premium storytelling.
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl text-[#FE9EC7]">12+</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[#3d1f35]/46">Brand Films</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
