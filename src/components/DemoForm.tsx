"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DemoForm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formContainerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

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
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-cream relative"
    >
      <div ref={formContainerRef} className="max-w-lg w-full">
        <h2
          className="text-3xl md:text-5xl text-dark text-center mb-4"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          Get a Demo
        </h2>
        <p
          className="text-dark/50 text-center mb-12 text-lg"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Let&apos;s build the future of online shopping.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
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
          <div>
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
          <div>
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
          <div>
            <textarea
              placeholder="Message (optional)"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-5 py-4 rounded-xl bg-white border border-dark/10 text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors resize-none"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 rounded-xl bg-rose text-white font-semibold text-lg tracking-wide hover:bg-rose-light disabled:opacity-60 transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {status === "sending" ? "Sending..." : "Request Demo"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-center toast-enter">
            Thanks! We&apos;ll be in touch soon.
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-center toast-enter">
            Something went wrong. Please try again.
          </div>
        )}
      </div>

      <footer className="absolute bottom-8 text-dark/30 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
        &copy; {new Date().getFullYear()} Twinnie. All rights reserved.
      </footer>
    </section>
  );
}
