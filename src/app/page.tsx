"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import DemoForm from "@/components/DemoForm";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <Scene />
      <Hero onGetDemo={() => setShowDemo(true)} />
      <DemoForm open={showDemo} onClose={() => setShowDemo(false)} />
    </main>
  );
}
