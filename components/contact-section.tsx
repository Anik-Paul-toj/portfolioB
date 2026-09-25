"use client";

import { useState, useRef, type FormEvent } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import type { SocialLink } from "@/lib/content";
import contactBg from "@/assets/contact.png";

type ContactSectionProps = {
  socialLinks: SocialLink[];
};

export function ContactSection({ socialLinks }: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setFeedback(null);

    const form = new FormData(formRef.current);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: name,
            from_name: name,
            email: email,
            from_email: email,
            reply_to: email,
            message: message,
          },
          publicKey
        );

        setFeedback({
          type: "success",
          message: "Thank you! Your inquiry has been sent successfully. I will get back to you soon.",
        });
        formRef.current.reset();
      } catch (error: any) {
        console.error("EmailJS send failed:", error);
        setFeedback({
          type: "error",
          message: "Unable to send through EmailJS. Opening your email app instead...",
        });
        setTimeout(() => {
          const subject = encodeURIComponent(`New editing inquiry from ${name || "portfolio visitor"}`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
          window.location.href = `mailto:dasampita2@gmail.com?subject=${subject}&body=${body}`;
        }, 1200);
      } finally {
        setIsSending(false);
      }
    } else {
      // Fallback if environment variables are not set
      const subject = encodeURIComponent(`New editing inquiry from ${name || "portfolio visitor"}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:dasampita2@gmail.com?subject=${subject}&body=${body}`;
      setIsSending(false);
      setFeedback({
        type: "success",
        message: "Opening your email app to send your inquiry...",
      });
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-28 py-16 pb-14 md:py-32 md:pb-24 overflow-hidden">
      {/* Decorative Atmosphere Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-80px),transparent_100%)] [webkit-mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-80px),transparent_100%)]"
        aria-hidden="true"
      >
        <Image
          src={contactBg}
          alt=""
          fill
          className="object-cover object-center opacity-65 md:opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Soft pastel and ambient glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f9]/50 via-transparent to-[#fff5f9]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,158,199,0.08),transparent_75%)]" />
      </div>

      {/* Dedicated seamless top transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-36 md:h-52 z-[1] bg-gradient-to-b from-[#fff5f9] via-[#fff5f9]/60 to-transparent"
        aria-hidden="true"
      />

      <div className="section-shell relative z-[2] overflow-visible">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white/45 via-[#fff0f6]/35 to-[#fdf2f8]/40 backdrop-blur-md border border-white/55 shadow-[0_24px_70px_rgba(254,158,199,0.16),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
          <div className="grid gap-10 lg:gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal className="max-w-xl">
              <span className="section-label">Contact</span>
              <h2 className="mt-6 md:mt-7 font-display text-[clamp(2.1rem,6vw,4.8rem)] leading-[1.02] md:leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
                Let&apos;s cut something unforgettable.
              </h2>
              <p className="mt-5 md:mt-6 text-base leading-7 md:leading-8 text-[#3d1f35]/68 md:text-lg">
                New campaigns, reels, launch visuals, and branded stories are all welcome. Keep it simple and I will
                take it from there.
              </p>

              <div className="mt-6 md:mt-8 flex flex-wrap gap-2.5 sm:gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/60 bg-white/60 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#3d1f35]/75 transition hover:border-[#FE9EC7]/55 hover:bg-white/85 hover:text-[#FE9EC7]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <form ref={formRef} onSubmit={onSubmit} data-reveal className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-[22px] border border-white/60 bg-white/55 backdrop-blur-sm px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/40 focus:border-[#FE9EC7]/60 focus:bg-white/80 focus:shadow-[0_0_15px_rgba(254,158,199,0.18)]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-[22px] border border-white/60 bg-white/55 backdrop-blur-sm px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/40 focus:border-[#89D4FF]/60 focus:bg-white/80 focus:shadow-[0_0_15px_rgba(137,212,255,0.18)]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[#3d1f35]/50">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Project scope, timeline, and the vibe you are after."
                  className="w-full resize-none rounded-[22px] border border-white/60 bg-white/55 backdrop-blur-sm px-5 py-4 text-[#3d1f35] outline-none transition placeholder:text-[#3d1f35]/40 focus:border-[#FE9EC7]/60 focus:bg-white/80 focus:shadow-[0_0_15px_rgba(254,158,199,0.18)]"
                />
              </label>

              {feedback && (
                <div
                  className={`rounded-[18px] p-4 text-sm font-medium transition ${
                    feedback.type === "success"
                      ? "border border-emerald-400/30 bg-emerald-50 text-emerald-800"
                      : "border border-red-400/30 bg-red-50 text-red-800"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="button-glow button-bloom mt-2 inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-sm uppercase tracking-[0.24em] text-[#3d1f35] disabled:opacity-60"
              >
                <span className="button-bloom__label">
                  {isSending ? "Sending Inquiry..." : "Send Inquiry"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
