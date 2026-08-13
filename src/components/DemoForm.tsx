"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function DemoForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  // Animate in after mount
  useEffect(() => {
    if (!mounted) return;

    if (open) {
      const ctx = gsap.context(() => {
        // Backdrop fades in
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        );

        // Panel slides up from bottom with a slight scale
        gsap.fromTo(
          panelRef.current,
          { y: "100%", scale: 0.95, opacity: 0 },
          {
            y: "0%",
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.1,
          }
        );

        // Form fields stagger in
        const fields = formRef.current?.querySelectorAll(".form-field");
        if (fields) {
          gsap.fromTo(
            fields,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: "power2.out",
              delay: 0.4,
            }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [mounted, open]);

  const animateOut = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setMounted(false);
        onClose();
      },
    });

    tl.to(panelRef.current, {
      y: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });
    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.3, ease: "power2.in" },
      "-=0.2"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => {
          setStatus("idle");
          animateOut();
        }, 2500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        onClick={animateOut}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg mx-6 bg-cream rounded-3xl shadow-2xl p-10 md:p-12"
        style={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={animateOut}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-dark/30 hover:text-dark transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 4L16 16M16 4L4 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          className="text-3xl md:text-4xl text-dark text-center mb-3"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          Get a Demo
        </h2>
        <p
          className="text-dark/40 text-center mb-10 text-base"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Let&apos;s build the future of online shopping.
        </p>

        <div ref={formRef}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-field">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-5 py-4 rounded-xl bg-white border border-dark/10 text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>
            <div className="form-field">
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-4 rounded-xl bg-white border border-dark/10 text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="Company"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-5 py-4 rounded-xl bg-white border border-dark/10 text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>
            <div className="form-field">
              <textarea
                placeholder="Message (optional)"
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-5 py-4 rounded-xl bg-white border border-dark/10 text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors resize-none"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>

            <div className="form-field pt-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 rounded-xl bg-dark text-cream font-semibold text-lg tracking-wide hover:bg-dark/80 disabled:opacity-60 transition-all cursor-pointer"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {status === "sending" ? "Sending..." : "Request Demo"}
              </button>
            </div>
          </form>

          {status === "success" && (
            <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-center toast-enter text-sm">
              Thanks! We&apos;ll be in touch soon.
            </div>
          )}

          {status === "error" && (
            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-center toast-enter text-sm">
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
