import { legalDocuments } from "./legal-content";
export default function LegalDocument({ kind }: { kind: "terms" | "privacy" }) {
  const doc = legalDocuments[kind];
  return (
    <article className="legal-document">
      <h2>{doc.title}</h2>
      <p className="legal-meta">{doc.subtitle}</p>
      <p>
        <a href={`/alpha/legal/${kind}.md`} download>
          Download document
        </a>{" "}
        ·{" "}
        <a href={`/alpha/${kind}`} target="_blank" rel="noreferrer">
          Open full page ↗
        </a>
      </p>
      {doc.sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
