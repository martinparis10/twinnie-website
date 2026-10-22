"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Hero from "@/components/Hero";
import DemoForm from "@/components/DemoForm";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <Scene />
      <Hero onGetDemo={() => setShowDemo(true)} />
      <footer className="absolute bottom-6 inset-x-0 z-10 text-center text-sm">
        <Link href="/privacy" className="text-dark/70 underline underline-offset-4 hover:text-dark">
          Privacy Policy
        </Link>
      </footer>
      <DemoForm open={showDemo} onClose={() => setShowDemo(false)} />
    </main>
  );
}
