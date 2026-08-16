"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Preloader } from "@/components/preloader";
import { ProjectModal } from "@/components/project-modal";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { navItems, projects, skills, socialLinks, type Project } from "@/lib/content";
import Image from "next/image";
import leftWisteria from "@/pinsnap-211174979083582.jpg";

gsap.registerPlugin(ScrollTrigger);

export function PortfolioShell({ dbProjects }: { dbProjects?: any[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline
        .from(".hero-badge", { opacity: 0, y: 30, duration: 0.7 })
        .from(".hero-kicker", { opacity: 0, y: 28, duration: 0.7 }, "-=0.45")
        .from(".hero-title-line", { opacity: 0, y: 82, duration: 1, stagger: 0.12 }, "-=0.42")
        .from(".hero-subtitle", { opacity: 0, y: 26, duration: 0.75 }, "-=0.55")
        .from(".hero-cta", { opacity: 0, y: 24, duration: 0.7 }, "-=0.45");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 52 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

    }, rootRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <>
      <Preloader isLoading={isLoading} />

      <div ref={rootRef} className="relative min-h-screen">
        <Image
          src={leftWisteria}
          alt=""
          priority
          className="pointer-events-none absolute left-[-8px] top-[-8px] z-20 h-auto w-[280px] opacity-95 md:left-[-24px] md:top-[-18px] md:w-[430px]"
        />
        <Navbar items={navItems} />
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ProjectsSection projects={dbProjects || projects} onSelectProject={setActiveProject} />
          <SkillsSection skills={skills} />
          <ContactSection socialLinks={socialLinks} />
        </main>
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
