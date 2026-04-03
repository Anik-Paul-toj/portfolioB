"use client";

import { type FormEvent } from "react";
import type { SocialLink } from "@/lib/content";
import { BloomButtonOrnaments } from "@/components/bloom-button-ornaments";

type ContactSectionProps = {
  socialLinks: SocialLink[];
};

export function ContactSection({ socialLinks }: ContactSectionProps) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");

    const subject = encodeURIComponent(`New editing inquiry from ${name || "portfolio visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@ariavale.studio?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="scroll-mt-28 py-24 pb-16 md:py-32 md:pb-24">
      <div className="section-shell">
        <div className="glass-panel glow-border overflow-hidden rounded-[34px] p-7 md:p-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal className="max-w-xl">
              <span className="section-label">Contact</span>
              <h2 className="mt-7 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
                Let&apos;s cut something unforgettable.
              </h2>
              <p className="mt-6 text-base leading-8 text-[#3d1f35]/68 md:text-lg">
                New campaigns, reels, launch visuals, and branded stories are all welcome. Keep it simple and I will
                take it from there.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#FE9EC7]/28 bg-white/80 px-4 py-2 text-sm uppercase tracking-[0.2em] text-[#3d1f35]/72 transition hover:border-[#FE9EC7]/55 hover:text-[#FE9EC7]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} data-reveal className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-[22px] border border-[#FE9EC7]/20 bg-white/84 px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/35 focus:border-[#FE9EC7]/50 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-[22px] border border-[#FE9EC7]/20 bg-white/84 px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/35 focus:border-[#89D4FF]/50 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Project scope, timeline, and the vibe you are after."
                  className="w-full resize-none rounded-[22px] border border-[#FE9EC7]/20 bg-white/84 px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/35 focus:border-[#FE9EC7]/50 focus:bg-white"
                />
              </label>
              <button
                type="submit"
                className="button-glow button-bloom mt-2 inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35]"
              >
                <span className="button-bloom__label">Send Inquiry</span>
                <BloomButtonOrnaments />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
