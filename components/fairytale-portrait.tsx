import Image from "next/image";
import picmixGif from "@/picmix.com_336548.gif";
import heroPortrait from "@/assets/hero1.png";

export function FairytalePortrait() {
  return (
    <div
      data-reveal
      className="relative mx-auto md:ml-auto md:mr-4 w-full max-w-[260px] sm:max-w-[285px] md:max-w-[315px] lg:max-w-[335px] mt-16 md:mt-12 lg:mt-14 select-none"
    >
      {/* 1. Deep Atmospheric Light Spill & Soft Fairytale Aura */}
      <div
        className="pointer-events-none absolute -inset-12 sm:-inset-16 md:-inset-20 z-0 rounded-full bg-[radial-gradient(ellipse_at_50%_52%,rgba(255,255,255,0.55)_0%,rgba(165,225,255,0.40)_35%,rgba(254,178,215,0.25)_60%,rgba(249,246,196,0.15)_75%,transparent_85%)] blur-2xl animate-fairytale-aura"
        aria-hidden="true"
      />

      {/* 2. Soft Rotating Ethereal Light Rays / Shimmer */}
      <div
        className="pointer-events-none absolute -inset-14 sm:-inset-20 md:-inset-24 z-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.22)_25deg,transparent_50deg,rgba(165,225,255,0.20)_110deg,transparent_140deg,rgba(254,188,220,0.18)_200deg,transparent_230deg,rgba(249,246,196,0.22)_290deg,transparent_320deg)] blur-xl animate-fairytale-rays mix-blend-screen opacity-70"
        aria-hidden="true"
      />

      {/* 3. Luminous Inner Frame Halo Bloom */}
      <div
        className="pointer-events-none absolute -inset-4 sm:-inset-6 z-0 rounded-[38%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.85)_10%,rgba(180,230,255,0.50)_55%,rgba(254,198,225,0.30)_75%,transparent_90%)] blur-lg animate-fairytale-aura opacity-85"
        aria-hidden="true"
      />

      {/* 4. Soft Bokeh Light Specks in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible" aria-hidden="true">
        {/* Soft lavender orb */}
        <span className="absolute -top-6 -left-8 h-10 w-10 rounded-full bg-[#FE9EC7]/35 blur-md animate-fairy-dust-1" />
        {/* Soft ice blue orb */}
        <span className="absolute top-1/4 -right-10 h-12 w-12 rounded-full bg-[#89D4FF]/40 blur-lg animate-fairy-dust-2" />
        {/* Soft golden orb near bow */}
        <span className="absolute -bottom-6 -left-6 h-11 w-11 rounded-full bg-[#F9F6C4]/45 blur-md animate-fairy-dust-3" />
        {/* Soft warm highlight near bottom right */}
        <span className="absolute -bottom-4 -right-6 h-9 w-9 rounded-full bg-[#FE9EC7]/30 blur-md animate-fairy-dust-1" />
      </div>

      {/* 5. Animated Character - Olaf above frame */}
      <Image
        src={picmixGif}
        alt=""
        priority
        className="pointer-events-none absolute left-[26%] top-[-102px] z-[2] h-auto w-[118px] -translate-x-1/2 opacity-95 md:top-[-110px] md:w-[125px] [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.70))_drop-shadow(0_0_20px_rgba(137,212,255,0.40))]"
      />

      {/* 6. Original Untouched Framed Artwork with Magical Luminous Edge */}
      <div className="relative z-[1]">
        <Image
          src={heroPortrait}
          alt="Ampita Das - Cinematic Video Editor"
          priority
          className="h-auto w-full object-contain [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.90))_drop-shadow(0_0_24px_rgba(137,212,255,0.70))_drop-shadow(0_0_48px_rgba(254,158,199,0.38))_drop-shadow(0_12px_28px_rgba(61,31,53,0.18))]"
        />
      </div>

      {/* 7. Magical Fairy-Dust & Delicate Twinkling Star Elements around the frame */}
      <div className="pointer-events-none absolute inset-0 z-[3] overflow-visible" aria-hidden="true">
        {/* Top-Left Ornate Flourish - 4-Point Star */}
        <svg
          className="absolute -top-3 -left-3 h-7 w-7 text-white animate-fairytale-twinkle-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] drop-shadow-[0_0_14px_rgba(137,212,255,0.85)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6Z" />
        </svg>

        {/* Top-Right Castle Corner - 8-Point Sparkling Star */}
        <svg
          className="absolute -top-4 -right-4 h-8 w-8 text-[#f9f6c4] animate-fairytale-twinkle-2 drop-shadow-[0_0_8px_rgba(249,246,196,0.95)] drop-shadow-[0_0_16px_rgba(254,158,199,0.75)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L13.8 8.2L20.5 3.5L15.8 10.2L24 12L15.8 13.8L20.5 20.5L13.8 15.8L12 24L10.2 15.8L3.5 20.5L8.2 13.8L0 12L8.2 10.2L3.5 3.5L10.2 8.2Z" />
        </svg>

        {/* Olaf Waving Hand Sparkle */}
        <svg
          className="absolute -top-20 left-[38%] h-5 w-5 text-white animate-fairytale-twinkle-3 drop-shadow-[0_0_6px_rgba(255,255,255,0.95)] drop-shadow-[0_0_12px_rgba(137,212,255,0.80)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5Z" />
        </svg>

        {/* Mid-Left Frame Border Sparkle */}
        <svg
          className="absolute top-[38%] -left-5 h-6 w-6 text-[#89D4FF] animate-fairytale-twinkle-4 drop-shadow-[0_0_6px_rgba(137,212,255,0.90)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5Z" />
        </svg>

        {/* Mid-Right Frame Border Sparkle */}
        <svg
          className="absolute top-[42%] -right-4 h-5 w-5 text-white animate-fairytale-twinkle-1 drop-shadow-[0_0_6px_rgba(255,255,255,0.90)] drop-shadow-[0_0_10px_rgba(254,158,199,0.70)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5Z" />
        </svg>

        {/* Blue Bow Center Jewel Sparkle */}
        <svg
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 h-7 w-7 text-white animate-fairytale-twinkle-2 drop-shadow-[0_0_8px_rgba(255,255,255,1)] drop-shadow-[0_0_15px_rgba(137,212,255,0.90)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8Z" />
        </svg>

        {/* Bottom-Left Bow Ribbon Sparkle */}
        <svg
          className="absolute bottom-[2%] -left-3 h-6 w-6 text-[#F9F6C4] animate-fairytale-twinkle-3 drop-shadow-[0_0_6px_rgba(249,246,196,0.90)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5Z" />
        </svg>

        {/* Bottom-Right Bow Ribbon Sparkle */}
        <svg
          className="absolute bottom-[3%] -right-3 h-6 w-6 text-white animate-fairytale-twinkle-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.90)] drop-shadow-[0_0_12px_rgba(137,212,255,0.80)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5Z" />
        </svg>

        {/* Micro Fairy-Dust Twinkling Specks */}
        <span className="absolute top-[18%] -left-2 h-1.5 w-1.5 rounded-full bg-white animate-fairytale-twinkle-1 drop-shadow-[0_0_4px_#fff]" />
        <span className="absolute top-[28%] -left-3 h-2 w-2 rounded-full bg-[#89D4FF] animate-fairytale-twinkle-3 drop-shadow-[0_0_5px_#89D4FF]" />
        <span className="absolute top-[12%] -right-2 h-2 w-2 rounded-full bg-[#F9F6C4] animate-fairytale-twinkle-2 drop-shadow-[0_0_6px_#F9F6C4]" />
        <span className="absolute top-[24%] -right-3 h-1.5 w-1.5 rounded-full bg-white animate-fairytale-twinkle-4 drop-shadow-[0_0_4px_#fff]" />
        <span className="absolute top-[55%] -left-3 h-2 w-2 rounded-full bg-[#FE9EC7] animate-fairytale-twinkle-2 drop-shadow-[0_0_5px_#FE9EC7]" />
        <span className="absolute top-[62%] -right-2 h-1.5 w-1.5 rounded-full bg-[#89D4FF] animate-fairytale-twinkle-1 drop-shadow-[0_0_5px_#89D4FF]" />
        <span className="absolute bottom-[16%] -left-4 h-2 w-2 rounded-full bg-[#F9F6C4] animate-fairytale-twinkle-4 drop-shadow-[0_0_5px_#F9F6C4]" />
        <span className="absolute bottom-[18%] -right-3 h-2 w-2 rounded-full bg-white animate-fairytale-twinkle-3 drop-shadow-[0_0_4px_#fff]" />
      </div>
    </div>
  );
}
