"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function GetDemoButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (visible && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [visible]);

  const scrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <button
      ref={buttonRef}
      onClick={scrollToDemo}
      className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-rose text-white rounded-full shadow-lg hover:bg-rose-light hover:shadow-xl transition-all cursor-pointer"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Get Demo
    </button>
  );
}
