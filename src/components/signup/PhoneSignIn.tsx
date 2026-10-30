"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Arrow, SignupShell, useSignupPreview } from "./SignupPreview";

const PREVIEW_CODE = "123456";

function normalizePhone(input: string) {
  if (!/^[\d\s()+.\-]+$/.test(input)) return null;
  const digits = input.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(national) ? `+1${national}` : null;
}

function displayPhone(phone: string) {
  const digits = phone.slice(2);
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PhoneSignIn() {
  const router = useRouter();
  const session = useSignupPreview();
  const [phone, setPhone] = useState(session.phone ? session.phone.slice(2) : "");
  const [country, setCountry] = useState("US");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const codeInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "code") codeInput.current?.focus();
    else phoneInput.current?.focus();
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function requestCode(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizePhone(phone.trim());
    if (!normalized) {
      setError("Enter a valid 10-digit US or Canadian phone number.");
      phoneInput.current?.focus();
      return;
    }
    session.setPhone(normalized);
    session.setVerified(false);
    setError(""); setCode(""); setCooldown(30); setResent(false); setStep("code");
  }

  function verifyCode(event: FormEvent) {
    event.preventDefault();
    // Local UX preview only. The route is unavailable in a production build.
    if (code !== PREVIEW_CODE) {
      setError(code.length !== 6 ? "Enter all 6 digits." : "That code doesn’t match. Try 123456 for this preview.");
      codeInput.current?.focus();
      return;
    }
    session.setVerified(true);
    router.push("/message");
  }

  function editNumber() {
    session.setVerified(false); setCode(""); setError(""); setStep("phone");
  }

  return (
    <SignupShell>
      <section className="signup-form-panel" aria-labelledby="signin-title">
        {step === "phone" ? (
          <>
            <h1 id="signin-title">Sign in to Twinnie</h1>
            <p className="signup-description">We’ll send you a code to sign in.</p>
            <form className="signup-form" onSubmit={requestCode} noValidate>
              <label className="signup-sr-only" htmlFor="phone">Phone number</label>
              <div className={`signup-phone-field${error ? " signup-field-error" : ""}`}>
                <select className="signup-country" aria-label={`Country: ${country === "US" ? "United States" : "Canada"} (+1)`} value={country} onChange={(event) => setCountry(event.target.value)}>
                  <option value="US" aria-label="United States (+1)">🇺🇸</option>
                  <option value="CA" aria-label="Canada (+1)">🇨🇦</option>
                </select>
                <input ref={phoneInput} id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national"
                  placeholder="+1 (555) 000-0000" value={phone} maxLength={24} required
                  aria-describedby={error ? "phone-help signup-error" : "phone-help"} aria-invalid={!!error}
                  onChange={(event) => { setPhone(event.target.value); setError(""); }} />
              </div>
              <p id="phone-help" className="signup-privacy">A verification code confirms this number is yours. Read how Twinnie handles your information in our <Link href="/privacy">Privacy Policy</Link>.</p>
              {error && <p id="signup-error" className="signup-error" role="alert">{error}</p>}
              <button className="signup-primary" type="submit">Send code <Arrow /></button>
            </form>
          </>
        ) : (
          <>
            <button type="button" className="signup-back" onClick={editNumber}><span aria-hidden="true">←</span> Change number</button>
            <h1 id="signin-title">Check your phone.</h1>
            <p className="signup-description">Enter the 6-digit code for<br /><strong>{displayPhone(session.phone)}</strong>.</p>
            <form className="signup-form" onSubmit={verifyCode} noValidate>
              <label htmlFor="code">Verification code</label>
              <input ref={codeInput} className={`signup-code${error ? " signup-field-error" : ""}`} id="code" name="code"
                type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6}
                value={code} required aria-invalid={!!error} aria-describedby={error ? "preview-code signup-error" : "preview-code"}
                onChange={(event) => { setCode(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} />
              {error && <p id="signup-error" className="signup-error" role="alert">{error}</p>}
              <button className="signup-primary" type="submit">Verify & continue <Arrow /></button>
              <button className="signup-resend" type="button" disabled={cooldown > 0} onClick={() => {
                setCooldown(30); setCode(""); setError(""); setResent(true); codeInput.current?.focus();
              }}>{cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}</button>
              <div id="preview-code" className="signup-demo-code" role="status">
                <span>{resent ? "Preview code reset" : "Preview code"}</span><strong>{PREVIEW_CODE}</strong>
                <small>No text is sent in this preview.</small>
              </div>
            </form>
          </>
        )}
      </section>
    </SignupShell>
  );
}
