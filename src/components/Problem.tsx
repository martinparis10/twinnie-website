"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current?.querySelectorAll(".word");
      if (!words) return;

      gsap.set(words, { opacity: 0.15 });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "center center",
          scrub: 1,
        },
      });

      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: "#FAF7F2" },
        {
          backgroundColor: "#1C1917",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const sentence = "Your Customers should enjoy shopping online.";
  const words = sentence.split(" ");

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="min-h-screen flex items-center justify-center px-6 transition-colors"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div ref={wordsRef} className="max-w-4xl text-center">
        <h2
          className="text-4xl md:text-6xl lg:text-7xl leading-tight"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em] text-cream">
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
