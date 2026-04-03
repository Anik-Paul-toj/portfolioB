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

gsap.registerPlugin(ScrollTrigger);

export function PortfolioShell() {
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

      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".skill-pill",
        { opacity: 0, y: 28, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: ".skills-cloud",
            start: "top 85%",
            once: true,
          },
        }
      );


    }, rootRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <>
      <Preloader isLoading={isLoading} />

      <div ref={rootRef} className="relative min-h-screen">
        <Navbar items={navItems} />
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ProjectsSection projects={projects} onSelectProject={setActiveProject} />
          <SkillsSection skills={skills} />
          <ContactSection socialLinks={socialLinks} />
        </main>
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
