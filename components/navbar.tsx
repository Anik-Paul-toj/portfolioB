"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/content";

type NavbarProps = {
  items: NavItem[];
};

export function Navbar({ items }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseLinkClass =
    "text-sm tracking-[0.24em] uppercase text-[#3d1f35]/70 transition hover:text-[#FE9EC7]";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled ? "backdrop-blur-2xl" : "bg-transparent"}`}>
      <div className="section-shell">
        <nav
          className={`mt-4 flex items-center justify-between rounded-full px-4 py-3 md:mt-6 md:px-6 ${
            isScrolled
              ? "glass-panel border-[#FE9EC7]/20 bg-white/88 shadow-[0_24px_60px_rgba(254,158,199,0.12)]"
              : "border border-[#FE9EC7]/30 bg-white/72 backdrop-blur-xl"
          }`}
        >
          <a href="#hero" className="font-display text-lg tracking-[0.35em] text-[#3d1f35]">
            AMPITA DAS
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {items.map((item) => (
              <a key={item.href} href={item.href} className={baseLinkClass}>
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="button-glow hidden rounded-full border border-[#FE9EC7]/30 bg-[linear-gradient(135deg,#FE9EC7,#F9F6C4,#89D4FF)] px-4 py-2 text-sm tracking-[0.22em] uppercase text-[#3d1f35] md:inline-flex"
          >
            Book Edit
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FE9EC7]/30 bg-white/80 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-[#3d1f35] transition ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-[#3d1f35] transition ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-[#3d1f35] transition ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        <div
          className={`overflow-hidden transition-[max-height,opacity,margin] duration-500 md:hidden ${
            isOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-panel rounded-[28px] px-5 py-5">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={baseLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="button-glow mt-2 inline-flex rounded-full border border-[#FE9EC7]/30 bg-[linear-gradient(135deg,#FE9EC7,#F9F6C4,#89D4FF)] px-4 py-3 text-sm tracking-[0.22em] uppercase text-[#3d1f35]"
                onClick={() => setIsOpen(false)}
              >
                Book Edit
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
