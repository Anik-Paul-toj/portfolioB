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
    "text-xs lg:text-sm tracking-[0.24em] uppercase text-[#3d1f35]/75 font-medium px-3.5 py-1.5 rounded-full transition-all duration-300 hover:text-[#3d1f35] hover:bg-gradient-to-r hover:from-[#FE9EC7]/20 hover:to-[#89D4FF]/20 hover:shadow-[0_0_12px_rgba(254,158,199,0.25)]";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="section-shell relative">
        <nav
          className={`pointer-events-auto relative z-[2] mt-3.5 sm:mt-4 flex items-center justify-between rounded-full px-4 py-2.5 sm:px-6 sm:py-3 transition-all duration-500 md:mt-6 ${
            isScrolled
              ? "border border-[#FE9EC7]/35 bg-gradient-to-r from-white/90 via-[#fff0f6]/88 to-white/90 shadow-[0_16px_50px_rgba(254,158,199,0.20),0_0_20px_rgba(255,255,255,0.7)_inset] backdrop-blur-2xl"
              : "border border-white/70 bg-gradient-to-r from-white/65 via-[#fff3f8]/60 to-white/65 shadow-[0_12px_36px_rgba(254,158,199,0.14),0_0_25px_rgba(255,255,255,0.6)_inset] backdrop-blur-xl"
          }`}
        >
          {/* Brand Logo with Fairytale Sparkles */}
          <a
            href="#hero"
            className="group font-display text-sm sm:text-base md:text-lg tracking-[0.28em] sm:tracking-[0.35em] text-[#3d1f35] flex items-center gap-1.5 transition"
          >
            <span className="text-xs text-[#FE9EC7] transition duration-300 group-hover:scale-125 group-hover:rotate-45">✦</span>
            <span>AMPITA DAS</span>
            <span className="text-xs text-[#FE9EC7] transition duration-300 group-hover:scale-125 group-hover:-rotate-45">✦</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-2 lg:gap-4 md:flex">
            {items.map((item) => (
              <a key={item.href} href={item.href} className={baseLinkClass}>
                {item.label}
              </a>
            ))}
          </div>

          {/* Book Edit CTA Button */}
          <a
            href="#contact"
            className="button-glow button-bloom hidden rounded-full border border-white/60 bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] px-5 py-2 text-xs lg:text-sm tracking-[0.22em] uppercase text-[#3d1f35] font-semibold md:inline-flex shadow-[0_4px_20px_rgba(254,158,199,0.35)] transition duration-300 hover:scale-105"
          >
            <span className="button-bloom__label">Book Edit ✨</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-sm md:hidden transition hover:bg-white active:scale-95"
            aria-label="Toggle menu"
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-[#3d1f35] transition-transform duration-300 ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-[#3d1f35] transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-[#3d1f35] transition-transform duration-300 ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        <div
          className={`pointer-events-auto overflow-hidden transition-[max-height,opacity,margin] duration-500 md:hidden ${
            isOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-[26px] border border-white/70 bg-gradient-to-br from-white/85 via-[#fff2f8]/80 to-white/85 p-5 shadow-[0_20px_60px_rgba(254,158,199,0.22)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#3d1f35]/80 transition hover:bg-gradient-to-r hover:from-[#FE9EC7]/20 hover:to-[#89D4FF]/20 hover:text-[#3d1f35]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="button-glow button-bloom mt-2 inline-flex items-center justify-center rounded-full border border-white/60 bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] px-5 py-3 text-xs font-bold tracking-[0.22em] uppercase text-[#3d1f35] shadow-[0_4px_20px_rgba(254,158,199,0.35)]"
                onClick={() => setIsOpen(false)}
              >
                <span className="button-bloom__label">Book Edit ✨</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
