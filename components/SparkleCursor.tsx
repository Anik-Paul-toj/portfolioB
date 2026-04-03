"use client";

import { useEffect, useRef } from "react";

type Sparkle = {
  active: boolean;
  x: number;
  y: number;
  ticksLeft: number;
  color: string;
};

const MAX_SPARKLES = 400;
const SPARKLE_LIFETIME = 22;
const SPARKLE_DISTANCE = 12;
const TRAIL_COLORS = [
  "rgba(255, 235, 140, 0.95)",
  "rgba(255, 223, 117, 0.92)",
  "rgba(237, 196, 104, 0.9)",
  "rgba(255, 244, 200, 0.9)",
];

export default function SparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: Sparkle[] = Array.from({ length: MAX_SPARKLES }, () => ({
      active: false,
      x: 0,
      y: 0,
      ticksLeft: 0,
      color: "",
    }));
    const dots: Sparkle[] = Array.from({ length: MAX_SPARKLES }, () => ({
      active: false,
      x: 0,
      y: 0,
      ticksLeft: 0,
      color: "",
    }));

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let lastSpawnTime = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const spawnStar = (x: number, y: number) => {
      if (x < -5 || y < -5 || x > width + 5 || y > height + 5) return;

      let chosen = -1;
      let minTicks = SPARKLE_LIFETIME * 2 + 1;

      for (let i = 0; i < MAX_SPARKLES; i++) {
        const star = stars[i];
        if (!star.active) {
          chosen = i;
          minTicks = -1;
          break;
        }
        if (star.ticksLeft < minTicks) {
          minTicks = star.ticksLeft;
          chosen = i;
        }
      }

      if (chosen === -1) return;

      if (minTicks !== -1) {
        const old = stars[chosen];
        dots[chosen].active = true;
        dots[chosen].x = old.x;
        dots[chosen].y = old.y;
        dots[chosen].ticksLeft = SPARKLE_LIFETIME * 2;
        dots[chosen].color = old.color;
      }

      const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      stars[chosen].active = true;
      stars[chosen].x = x;
      stars[chosen].y = y;
      stars[chosen].ticksLeft = SPARKLE_LIFETIME * 2;
      stars[chosen].color = color;
    };

    const drawStar = (x: number, y: number, size: number, color: string) => {
      const cx = x + size / 2;
      const cy = y + size / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + size, cy);
      ctx.moveTo(cx, y);
      ctx.lineTo(cx, y + size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - size * 0.35, cy - size * 0.35);
      ctx.lineTo(cx + size * 0.35, cy + size * 0.35);
      ctx.moveTo(cx + size * 0.35, cy - size * 0.35);
      ctx.lineTo(cx - size * 0.35, cy + size * 0.35);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let anyAlive = false;

      for (let i = 0; i < MAX_SPARKLES; i++) {
        const star = stars[i];
        if (!star.active) continue;

        star.ticksLeft--;
        if (star.ticksLeft <= 0) {
          dots[i].active = true;
          dots[i].x = star.x;
          dots[i].y = star.y;
          dots[i].ticksLeft = SPARKLE_LIFETIME * 2;
          dots[i].color = star.color;
          star.active = false;
          anyAlive = true;
          continue;
        }

        star.y += 0.65 + Math.random() * 1.75;
        star.x += (i % 5 - 2) * 0.16;

        if (star.x > -8 && star.y > -8 && star.x < width + 8 && star.y < height + 8) {
          drawStar(star.x, star.y, star.ticksLeft > SPARKLE_LIFETIME ? 16 : 11, star.color);
          anyAlive = true;
        } else {
          star.active = false;
        }
      }

      for (let i = 0; i < MAX_SPARKLES; i++) {
        const dot = dots[i];
        if (!dot.active) continue;

        dot.ticksLeft--;
        if (dot.ticksLeft <= 0) {
          dot.active = false;
          continue;
        }

        dot.y += 0.5 + Math.random() * 1.4;
        dot.x += (i % 4 - 2) * 0.14;

        if (dot.x > -4 && dot.y > -4 && dot.x < width + 4 && dot.y < height + 4) {
          ctx.fillStyle = dot.color;
          if (dot.ticksLeft > SPARKLE_LIFETIME) {
            ctx.fillRect(dot.x, dot.y, 4.8, 4.8);
          } else {
            ctx.fillRect(dot.x + 0.25, dot.y + 0.25, 2.8, 2.8);
          }
          anyAlive = true;
        } else {
          dot.active = false;
        }
      }

      if (anyAlive) {
        running = true;
        raf = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawnTime < 16) return;
      lastSpawnTime = now;

      const dx = event.movementX;
      const dy = event.movementY;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.35) return;

      let x = event.clientX;
      let y = event.clientY;
      const probability = dist / SPARKLE_DISTANCE;
      const stepX = (dx * SPARKLE_DISTANCE * 2) / Math.max(dist, 1);
      const stepY = (dy * SPARKLE_DISTANCE * 2) / Math.max(dist, 1);

      let traveled = 0;
      while (traveled < dist) {
        if (Math.random() < probability) {
          spawnStar(x, y);
        }

        const fraction = Math.random();
        x -= stepX * fraction;
        y -= stepY * fraction;
        traveled += Math.abs(stepX * fraction) + Math.abs(stepY * fraction);
      }

      if (!running) {
        running = true;
        raf = requestAnimationFrame(animate);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      ctx.clearRect(0, 0, width, height);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[70] h-full w-full" aria-hidden="true" />;
}
