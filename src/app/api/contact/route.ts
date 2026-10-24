import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { nameError, phoneError } from "@/lib/waitlist-fields";

// Preserve the existing website's delivery destination and configured sender.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "martin@trytwinnie.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Twinnie Website <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      // Next.js may use an internal hostname in req.url behind a proxy.
      const requestHost = req.headers.get("host") || new URL(req.url).host;
      if (new URL(origin).host !== requestHost) throw new Error("Different origin");
    } catch {
      return NextResponse.json({ error: "Please submit the form from the Twinnie website." }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 4096) {
      return NextResponse.json({ error: "Your submission is too long." }, { status: 413 });
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.email !== "string") {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (typeof body.name !== "string" || typeof body.phone !== "string") {
    return NextResponse.json({ error: "Name and phone number are required." }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  const name = body.name.trim();
  const phone = body.phone.trim();

  if (email.length > 254 || !/^[^\s@<>"(),;:\\]+@[^\s@<>"(),;:\\]+\.[^\s@<>"(),;:\\]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const validationError = nameError(name) || phoneError(phone);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  if (body.website) {
    return NextResponse.json({ error: "We couldn’t accept this submission. Please try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Waitlist delivery is not configured.");
    return NextResponse.json({ error: "Signups are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    // Resend deduplicates this normalized email for 24 hours, including across instances.
    // This is delivery protection; the existing inbox remains the signup destination.
    const idempotencyKey = `waitlist/${createHash("sha256").update(email).digest("hex")}`;
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: "New Twinnie waitlist signup",
      text: [`New Twinnie waitlist signup`, `Email: ${email}`, `Name: ${name}`, `Phone: ${phone}`, "Source: trytwinnie.com waitlist"].join("\n"),
      html: `<h2>New Twinnie waitlist signup</h2><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p>Source: trytwinnie.com waitlist</p>`,
    }, { idempotencyKey });

    if (error?.name === "invalid_idempotent_request") {
      return NextResponse.json({ error: "This email was submitted recently with different details. If you already joined, there’s no need to submit again." }, { status: 409 });
    }
    if (error?.name === "concurrent_idempotent_requests") {
      return NextResponse.json({ error: "Your signup is still processing. Please wait a moment and try again." }, { status: 409 });
    }
    if (error || !data?.id) {
      console.error("Waitlist delivery failed:", error?.name || "missing_confirmation");
      return NextResponse.json({ error: "We couldn’t save your signup. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    console.error("Waitlist delivery could not be confirmed.");
    return NextResponse.json({ error: "We couldn’t confirm your signup. Please try again." }, { status: 502 });
  }
}
