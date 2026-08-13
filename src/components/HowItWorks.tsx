"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      const steps = stepsRef.current?.querySelectorAll(".step-card");
      if (steps) {
        gsap.fromTo(
          steps,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 70%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Embed the Widget",
      desc: 'Add Twinnie\'s "Try This On" button to your product pages with one line of code.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none">
          <rect
            x="4"
            y="8"
            width="40"
            height="32"
            rx="4"
            stroke="#C08B7E"
            strokeWidth="1.5"
          />
          <path
            d="M16 22l-4 4 4 4M32 22l4 4-4 4M22 30l4-12"
            stroke="#C08B7E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Customer Scans",
      desc: "Your customer takes two photos from their phone. We generate a photorealistic digital twin.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none">
          <rect
            x="12"
            y="4"
            width="24"
            height="40"
            rx="4"
            stroke="#C08B7E"
            strokeWidth="1.5"
          />
          <circle cx="24" cy="20" r="6" stroke="#C08B7E" strokeWidth="1.5" />
          <path
            d="M18 34h12"
            stroke="#C08B7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      num: "03",
      title: "They Shop",
      desc: "Customers see how garments look on their own body. Returns drop. Conversion rises.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none">
          <path
            d="M14 16l10-8 10 8v18a2 2 0 01-2 2H16a2 2 0 01-2-2V16z"
            stroke="#C08B7E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M20 36V26h8v10"
            stroke="#C08B7E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-cream"
    >
      <h2
        ref={headingRef}
        className="text-3xl md:text-5xl text-dark text-center mb-4"
        style={{ fontFamily: "var(--font-libre)" }}
      >
        How It Works
      </h2>
      <p
        className="text-dark/50 text-center mb-16 text-lg"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        For brands ready to transform online shopping
      </p>

      <div
        ref={stepsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="step-card relative flex flex-col items-center text-center p-10 rounded-2xl bg-white/60 backdrop-blur-sm border border-dark/5 hover:border-rose/30 hover:shadow-lg transition-all"
          >
            <span
              className="absolute top-6 left-6 text-5xl font-bold text-rose/15"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              {step.num}
            </span>
            <div className="mb-6 mt-2">{step.icon}</div>
            <h3
              className="text-xl text-dark mb-3"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              {step.title}
            </h3>
            <p
              className="text-dark/60 leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
