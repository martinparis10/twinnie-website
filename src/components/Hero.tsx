"use client";

export default function Hero({ onJoinWaitlist }: { onJoinWaitlist: () => void }) {
  return (
    <section className="relative z-10 h-screen flex flex-col items-center justify-center">
      {/* Waitlist — top right */}
      <button
        onClick={onJoinWaitlist}
        className="hero-waitlist-button absolute top-8 right-8 md:top-10 md:right-12 bg-dark text-cream text-sm tracking-[0.2em] uppercase rounded-full hover:bg-dark/80 transition-all cursor-pointer"
        aria-haspopup="dialog"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
      >
        Join waitlist
      </button>

      {/* Logo — centered */}
      <div className="text-center">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl tracking-tight"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          <span className="text-dark">tw</span>
          <span className="relative inline-block text-dark">
            ı
            <span
              className="absolute left-1/2 -translate-x-1/2 w-[0.13em] h-[0.13em] rounded-full bg-dark"
              style={{ top: "-0.05em" }}
            />
          </span>
          <span className="text-dark">nn</span>
          <span className="relative inline-block text-dark">
            ı
            <span
              className="absolute left-1/2 -translate-x-1/2 w-[0.13em] h-[0.13em] rounded-full bg-rose"
              style={{ top: "-0.05em" }}
            />
          </span>
          <span className="text-dark">e</span>
        </h1>

      </div>
    </section>
  );
}
