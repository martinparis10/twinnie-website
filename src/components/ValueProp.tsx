"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ValueProp() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll(".value-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              end: "top 35%",
              scrub: 1,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-rose" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
          <path
            d="M24 14v10l7 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "One Scan",
      desc: "Two photos from your phone create a photorealistic 3D digital twin in seconds.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-rose" fill="none">
          <rect
            x="6"
            y="10"
            width="36"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M24 22v8M20 26h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Try On Anything",
      desc: "See how clothes actually look on your body — not a mannequin, not a model. You.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-rose" fill="none">
          <path
            d="M12 36 L24 12 L36 36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 28h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Shop Anywhere",
      desc: "Your Twinnie works across every brand that integrates our widget. Create once, use everywhere.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="value"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-dark"
    >
      <h2
        ref={headingRef}
        className="text-3xl md:text-5xl lg:text-6xl text-cream text-center max-w-4xl leading-tight mb-20"
        style={{ fontFamily: "var(--font-libre)" }}
      >
        One scan. A photorealistic digital twin.
        <br />
        <span className="text-rose">Try on anything, anywhere.</span>
      </h2>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        {features.map((feature, i) => (
          <div
            key={i}
            className="value-card flex flex-col items-center text-center p-8 rounded-2xl bg-dark border border-cream/10 hover:border-rose/30 transition-colors"
          >
            <div className="mb-6">{feature.icon}</div>
            <h3
              className="text-xl text-cream mb-3"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              {feature.title}
            </h3>
            <p
              className="text-cream/60 leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
