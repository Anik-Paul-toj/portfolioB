import Image from "next/image";
import Grainient from "@/components/Grainient";
import picmixGif from "@/picmix.com_336548.gif";

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
            <span className="hero-title-line block">Aria Vale</span>
            <span className="hero-title-line headline-gradient block">Cuts that feel cinematic.</span>
          </h1>
          <p className="hero-subtitle mt-6 max-w-2xl text-base leading-7 text-[#3d1f35]/70 md:text-lg">
            Crafting music visuals, branded films, and performance edits with polished rhythm, color, and atmosphere.
          </p>

          <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#projects"
              className="button-glow inline-flex items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-[linear-gradient(135deg,#FE9EC7,#F9F6C4,#89D4FF)] px-6 py-3.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]"
            >
              View Reel
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

      {/* Waving Olaf SVG + CSS animation; sits in the open gradient above the frames card */}

    </section>
  );
}
