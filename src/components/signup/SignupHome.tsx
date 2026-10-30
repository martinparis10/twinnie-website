"use client";

import Link from "next/link";
import Image from "next/image";
import { Arrow, SignupShell } from "./SignupPreview";

export default function SignupHome() {
  return (
    <SignupShell home>
      <div className="signup-home-layout">
      <section className="signup-home" aria-labelledby="home-title">
        <h1 id="home-title">Twinnie is a personal shopper that gets to know your style and helps you find what you’re looking for.</h1>
        <p>It starts with a text. Tell Twinnie what you have in mind, and keep the conversation going right in iMessage.</p>
        <p>A new everyday favorite, an outfit for the weekend, or something you haven’t found yet. Just ask Twinnie.</p>
        <nav className="signup-home-links" aria-label="Get started">
          <Link href="/sign-in">Try Twinnie <Arrow /></Link>
          <Link href="/sign-in">Log in <Arrow /></Link>
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
