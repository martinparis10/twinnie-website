"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

type PreviewSession = {
  phone: string;
  verified: boolean;
  setPhone: (phone: string) => void;
  setVerified: (verified: boolean) => void;
};
const PreviewContext = createContext<PreviewSession | null>(null);

export function SignupPreviewProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  // In memory only. This does not establish a real authenticated session.
  return <PreviewContext.Provider value={{ phone, verified, setPhone, setVerified }}>{children}</PreviewContext.Provider>;
}

export function useSignupPreview() {
  const session = useContext(PreviewContext);
  if (!session) throw new Error("Signup preview provider is missing.");
  return session;
}

export function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function SignupShell({ children, home = false }: { children: ReactNode; home?: boolean }) {
  return (
    <div className={`signup-shell${home ? " signup-shell-home" : ""}`}>
      {home && <header className="signup-header">
        <Link href="/" className="signup-logo" aria-label="Twinnie home"><Image src="/images/twinnie-mascot-tile.png" alt="" width={540} height={540} priority /></Link>
      </header>}
      <main className="signup-main">{children}</main>
      <footer className="signup-footer">
        <Link href={home ? "/privacy" : "/"}>{home ? "Privacy policy" : "Back to home"}</Link>
      </footer>
    </div>
  );
}
