"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );

      gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out",
        }
      );

      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
        delay: 2.3,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center"
    >
      <div ref={logoRef} className="text-center">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl tracking-tight"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          <span className="text-dark">twinn</span>
          <span className="relative inline-block text-dark">
            i
            <span
              className="absolute top-[0.05em] left-1/2 -translate-x-1/2 w-[0.22em] h-[0.22em] rounded-full bg-rose"
              style={{ marginTop: "-0.08em" }}
            />
          </span>
          <span className="text-dark">e</span>
        </h1>
        <p
          className="mt-6 text-lg md:text-xl text-dark/60 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Virtual Try-On for Every Brand
        </p>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-dark/40"
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Scroll
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-dark/40"
        >
          <path
            d="M10 4 L10 16 M4 10 L10 16 L16 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
