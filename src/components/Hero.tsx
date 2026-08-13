"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero({ onGetDemo }: { onGetDemo: () => void }) {
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        subtitleRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.2,
        }
      );

      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.6,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 h-screen flex flex-col items-center justify-center gap-10">
      <div ref={logoRef} className="text-center">
        {/*
          "twinnie" wordmark — both i's use a dotless ı (U+0131) so we can
          place identically-sized custom dots above each one.  The second
          dot is rose-colored; the first matches the text color.
        */}
        <h1
          className="text-6xl md:text-8xl lg:text-9xl tracking-tight"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          <span className="text-dark">tw</span>
          <span className="relative inline-block text-dark">
            ı
            <span
              className="absolute left-1/2 -translate-x-1/2 w-[0.13em] h-[0.13em] rounded-full bg-dark"
              style={{ top: "-0.05em" }}
            />
          </span>
          <span className="text-dark">nn</span>
          <span className="relative inline-block text-dark">
            ı
            <span
              className="absolute left-1/2 -translate-x-1/2 w-[0.13em] h-[0.13em] rounded-full bg-rose"
              style={{ top: "-0.05em" }}
            />
          </span>
          <span className="text-dark">e</span>
        </h1>
      </div>

      <p
        ref={subtitleRef}
        className="text-lg md:text-xl text-dark/50 tracking-[0.25em] uppercase opacity-0"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Virtual Try-On
      </p>

      <button
        ref={buttonRef}
        onClick={onGetDemo}
        className="mt-4 px-10 py-4 bg-rose text-white text-sm md:text-base tracking-[0.2em] uppercase rounded-full hover:bg-rose-light transition-colors cursor-pointer opacity-0"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
      >
        GET DEMO
      </button>
    </section>
  );
}
