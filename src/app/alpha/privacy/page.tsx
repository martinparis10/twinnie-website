import type { Metadata } from "next";
import LegalDocument from "@/components/alpha/LegalDocument";
import BrandMark from "@/components/alpha/BrandMark";
import "../alpha.css";
export const metadata: Metadata = {
  title: "Twinnie · Twinnie Alpha Privacy Policy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="alpha-app">
      <header className="alpha-header">
        <a href="/alpha" aria-label="Twinnie home">
          <BrandMark kind="wordmark" />
        </a>
      </header>
      <main className="legal-page">
        <a className="back" href="/alpha">
          ← Back to Twinnie
        </a>
        <LegalDocument kind="privacy" />
      </main>
    </div>
  );
}
