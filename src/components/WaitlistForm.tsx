"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nameError, phoneError } from "@/lib/waitlist-fields";

export default function WaitlistForm({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === "success") return;
    const validationError = nameError(name) || phoneError(phone);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }
    submitting.current = true;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, website }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "We couldn’t save your signup. Please try again.");
      }
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "Error"
        ? cause.message
        : "We couldn’t confirm your signup. Please try again; repeat submissions are protected.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="waitlist-dialog"
      aria-labelledby="waitlist-title"
      aria-describedby="waitlist-description"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="waitlist-panel">
        <button className="waitlist-close" type="button" onClick={onClose} aria-label="Close waitlist form">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="waitlist-accent" aria-hidden="true"><span /><span /><span /></div>
        <p className="waitlist-eyebrow">A little closer to Twinnie</p>
        <h2 id="waitlist-title">{status === "success" ? "You’re on the list." : "Join the waitlist."}</h2>
        <p id="waitlist-description" className="waitlist-description">
          {status === "success" ? "Thanks for joining. We’ll email you when you can get started." : "Be the first to know when you can get started."}
        </p>

        {status === "success" ? (
          <div className="waitlist-success" role="status">
            <span className="waitlist-check" aria-hidden="true">✓</span>
            <p>Your signup has been received.</p>
            <button type="button" className="waitlist-submit" onClick={onClose}>Back to Twinnie</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="waitlist-form" aria-busy={status === "sending"}>
            <div className="waitlist-field">
              <label htmlFor="waitlist-email">Email address <span>(required)</span></label>
              <input id="waitlist-email" name="email" type="email" autoComplete="email" autoFocus required maxLength={254}
                placeholder="you@example.com" value={email} disabled={status === "sending"}
                onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="waitlist-field">
              <label htmlFor="waitlist-name">Name <span>(required)</span></label>
              <input id="waitlist-name" name="name" type="text" autoComplete="name" required maxLength={100}
                placeholder="What should we call you?" value={name} disabled={status === "sending"}
                onChange={(event) => {
                  setName(event.target.value);
                  event.target.setCustomValidity(nameError(event.target.value));
                }} />
            </div>
            <div className="waitlist-field">
              <label htmlFor="waitlist-phone">Phone number <span>(required)</span></label>
              <input id="waitlist-phone" name="phone" type="tel" autoComplete="tel" required maxLength={40}
                placeholder="+44 20 7946 0958" value={phone} disabled={status === "sending"}
                onChange={(event) => {
                  setPhone(event.target.value);
                  event.target.setCustomValidity(phoneError(event.target.value));
                }} />
            </div>
            <div className="waitlist-honeypot" aria-hidden="true">
              <label htmlFor="waitlist-website">Leave this field empty</label>
              <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={website} onChange={(event) => setWebsite(event.target.value)} />
            </div>
            {status === "error" && <p className="waitlist-error" role="alert">{error}</p>}
            <button type="submit" className="waitlist-submit" disabled={status === "sending"}>
              <span>{status === "sending" ? "Joining…" : "Join waitlist"}</span>
              {status !== "sending" && <span aria-hidden="true">↗</span>}
            </button>
            <p className="waitlist-privacy">We’ll email you about access to Twinnie.<br />
              Read our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
