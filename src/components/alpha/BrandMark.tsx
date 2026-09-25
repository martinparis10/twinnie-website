export default function BrandMark({
  kind,
  className = "",
}: {
  kind: "wordmark" | "symbol";
  className?: string;
}) {
  return (
    <svg
      className={`brand-${kind} ${className}`}
      viewBox={kind === "wordmark" ? "20 535 1040 260" : "195 480 690 485"}
      role="img"
      aria-label="Twinnie"
    >
      <image href={`/alpha/brand/${kind}.png`} width="1080" height="1350" />
    </svg>
  );
}
