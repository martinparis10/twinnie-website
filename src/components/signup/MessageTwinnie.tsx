"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Arrow, SignupShell, useSignupPreview } from "./SignupPreview";

export default function MessageTwinnie() {
  const router = useRouter();
  const { verified } = useSignupPreview();
  const [opened, setOpened] = useState(false);
  // Leave empty until the launch recipient is supplied. Never use a fake number.
  const recipient = process.env.NEXT_PUBLIC_TWINNIE_MESSAGE_NUMBER || "";
  const messageHref = /^\+?[\d-]+$/.test(recipient) ? `sms:${recipient}` : "sms:";

  useEffect(() => {
    if (!verified) router.replace("/sign-in");
  }, [verified, router]);

  if (!verified) return <SignupShell><p role="status">Opening sign in…</p></SignupShell>;

  return (
    <SignupShell>
      <section className="signup-form-panel signup-message" aria-labelledby="message-title">
        <h1 id="message-title">Meet your twinnie</h1>
        <div className="signup-message-icons">
          <Image src="/images/imessage-icon.png" alt="iMessage" width={270} height={270} className="signup-message-imessage" />
          <div className="signup-message-twinnie">
            <span className="signup-message-bubble" aria-hidden="true">hey, i’m twinnie</span>
            <Image src="/images/twinnie-mascot-tile.png" alt="Twinnie" width={540} height={540} />
          </div>
        </div>
        <a className="signup-primary" href={messageHref} onClick={() => setOpened(true)}>Message Twinnie <Arrow /></a>
        <p className="signup-form-note">Opens Messages on your device.</p>
        {opened && <p className="signup-message-help" role="status">If Messages didn’t open, try this page on your iPhone.</p>}
        {!recipient && <p className="signup-recipient-note">Preview: Twinnie’s number will be connected later.</p>}
      </section>
    </SignupShell>
  );
}
