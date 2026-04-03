export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 py-24 md:py-32">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div data-reveal className="max-w-3xl">
            <span className="section-label">About</span>
            <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
              Editing atmosphere into every frame.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3d1f35]/70">
              I build elegant edits with rhythm, restraint, and a polished finish. From trailer-style storytelling to
              fast-moving branded campaigns, every cut is shaped to feel immersive, emotional, and distinctly premium.
            </p>
          </div>

          <div data-reveal className="glass-panel rounded-[30px] p-7 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#89D4FF]">Approach</p>
                <p className="mt-3 text-sm leading-7 text-[#3d1f35]/66">
                  Tight pacing, luminous color, and motion that supports the story instead of overpowering it.
                </p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#FE9EC7]">Focus</p>
                <p className="mt-3 text-sm leading-7 text-[#3d1f35]/66">
                  Music videos, social campaigns, beauty reels, live openers, and brand-led visual narratives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
