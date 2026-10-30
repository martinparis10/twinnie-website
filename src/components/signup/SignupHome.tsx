"use client";

import Link from "next/link";
import Image from "next/image";
import { SignupShell } from "./SignupPreview";

export default function SignupHome() {
  return (
    <SignupShell home>
      <div className="signup-home-layout">
      <section className="signup-home" aria-labelledby="home-title">
        <h1 id="home-title">it starts with a text.<br />it ends with the right product in your hands.</h1>
        <nav className="signup-home-links" aria-label="Get started">
          <Link href="/sign-in">try twinnie</Link>
          <Link href="/sign-in">log in</Link>
        </nav>
      </section>
        <figure className="signup-town">
          <Image
            src="/images/twinnie-shopping-street-v10.png"
            alt="A bold, imperfect ink sketch of small boutiques, books and flower displays rising toward a tall corner building at the far right, with shoppers and a street leading into the distance."
            width={1536}
            height={1024}
            sizes="(max-width: 800px) 100vw, (max-width: 1199px) 52vw, 68vw"
            priority
          />
        </figure>
      </div>
    </SignupShell>
  );
}
