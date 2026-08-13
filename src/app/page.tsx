"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import ValueProp from "@/components/ValueProp";
import HowItWorks from "@/components/HowItWorks";
import DemoForm from "@/components/DemoForm";
import GetDemoButton from "@/components/GetDemoButton";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <Scene scrollProgress={scrollProgress} />
      <Hero />
      <Problem />
      <ValueProp />
      <HowItWorks />
      <DemoForm />
      <GetDemoButton />
    </main>
  );
}
