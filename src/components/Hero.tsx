"use client";

export default function Hero({ onGetDemo }: { onGetDemo: () => void }) {
  return (
    <section className="relative z-10 h-screen flex flex-col items-center justify-center">
      {/* GET DEMO — top right */}
      <button
        onClick={onGetDemo}
        className="absolute top-8 right-8 md:top-10 md:right-12 px-7 py-3 bg-dark text-cream text-xs tracking-[0.2em] uppercase rounded-full hover:bg-dark/80 transition-all cursor-pointer"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
      >
        GET DEMO
      </button>

      {/* Logo + subtitle — centered */}
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

        <p
          className="mt-8 text-lg md:text-xl text-dark/50 tracking-[0.25em] uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Virtual Try-On
        </p>
      </div>
    </section>
  );
}
