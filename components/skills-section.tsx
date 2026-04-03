type SkillsSectionProps = {
  skills: string[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="scroll-mt-28 py-24 md:py-32">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div data-reveal className="max-w-2xl">
            <span className="section-label">Skills</span>
            <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
              Precision tools. Soft neon finish.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#3d1f35]/68 md:text-lg">
              A toolkit shaped for polished narrative cuts, elevated visuals, and delivery formats that feel ready the
              moment they land.
            </p>
          </div>

          <div className="skills-cloud flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className={`skill-pill rounded-full border px-5 py-3 text-sm tracking-[0.08em] text-[#3d1f35] transition duration-300 hover:-translate-y-1 ${
                  index % 3 === 0
                    ? "border-[#FE9EC7]/45 bg-[#FE9EC7]/12 shadow-[0_0_24px_rgba(254,158,199,0.18)]"
                    : index % 3 === 1
                      ? "border-[#89D4FF]/45 bg-[#89D4FF]/12 shadow-[0_0_24px_rgba(137,212,255,0.16)]"
                      : "border-[#F9F6C4]/60 bg-[#F9F6C4]/25 shadow-[0_0_24px_rgba(249,246,196,0.22)]"
                }`}
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#FE9EC7] shadow-[0_0_12px_rgba(254,158,199,0.85)]" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
