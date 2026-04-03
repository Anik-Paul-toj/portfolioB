"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !glowRef.current || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursorX = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    const cursorY = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.2,
      ease: "power3.out",
    });
    const glowX = gsap.quickTo(glowRef.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const glowY = gsap.quickTo(glowRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      cursorX(x - 9);
      cursorY(y - 9);
      glowX(x - 48);
      glowY(y - 48);
    };

    const interactiveElements = Array.from(
      document.querySelectorAll("a, button, input, textarea, [role='button']")
    );

    const activate = () => {
      cursorRef.current?.classList.add("scale-150", "border-[#F9F6C4]");
      glowRef.current?.classList.add("opacity-100");
    };
    const deactivate = () => {
      cursorRef.current?.classList.remove("scale-150", "border-[#F9F6C4]");
      glowRef.current?.classList.remove("opacity-100");
    };

    window.addEventListener("pointermove", onPointerMove);
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", activate);
      element.addEventListener("mouseleave", deactivate);
    });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", activate);
        element.removeEventListener("mouseleave", deactivate);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[75] hidden h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(68,172,255,0.14),rgba(254,158,199,0.18),rgba(249,246,196,0.16),transparent_72%)] opacity-70 blur-xl md:block"
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-[18px] w-[18px] rounded-full border border-[#44ACFF] bg-white/80 shadow-[0_0_24px_rgba(68,172,255,0.18)] transition md:block"
      />
    </>
  );
}
