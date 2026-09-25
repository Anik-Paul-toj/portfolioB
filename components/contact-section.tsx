"use client";

import { useState, useRef, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import type { SocialLink } from "@/lib/content";


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
    <section id="contact" className="scroll-mt-28 py-24 pb-16 md:py-32 md:pb-24">
      <div className="section-shell relative overflow-visible">
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

            <form ref={formRef} onSubmit={onSubmit} data-reveal className="grid gap-4">
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
