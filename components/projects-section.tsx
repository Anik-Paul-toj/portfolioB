import Image from "next/image";
import type { Project } from "@/lib/content";

type ProjectsSectionProps = {
  projects: Project[];
  onSelectProject: (project: Project) => void;
};

export function ProjectsSection({ projects, onSelectProject }: ProjectsSectionProps) {
  return (
    <section id="projects" className="scroll-mt-28 py-24 md:py-32">
      <div className="section-shell">
        <div data-reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Projects</span>
            <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
              A reel built for glow, pace, and impact.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-[#3d1f35]/60 md:text-base">
            Selected edits across music, brand, beauty, and event visuals. Tap any piece to preview the motion.
          </p>
        </div>

        <div className="projects-grid grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              onClick={() => onSelectProject(project)}
              className="project-card project-sheen group glass-panel glow-border relative overflow-hidden rounded-[30px] text-left transition duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,245,249,0.10),rgba(255,240,248,0.88))]" />
              <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-50`} />

              <div className="relative flex min-h-[430px] flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72">
                    0{index + 1}
                  </span>
                  <span className="rounded-full border border-[#FE9EC7]/40 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#3d1f35]/72">
                    {project.year}
                  </span>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-[#3d1f35]/65">{project.category}</p>
                  <h3 className="font-display text-4xl leading-none tracking-[-0.03em] text-[#3d1f35]">{project.title}</h3>
                  <div className="mt-5 inline-flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[#3d1f35]/73">
                    <span>Open Preview</span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/72 text-lg text-[#3d1f35] transition group-hover:border-[#FE9EC7]/60 group-hover:bg-[#FE9EC7]/18">
                      +
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
