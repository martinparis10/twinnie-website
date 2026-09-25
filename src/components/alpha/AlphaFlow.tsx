/* eslint-disable @next/next/no-img-element -- Local object URLs are previewed without uploading or image optimization. */
"use client";
import { useState, useEffect, useRef, type FormEvent } from "react";
import dynamic from "next/dynamic";
import CameraCapture from "./CameraCapture";
import BrandMark from "./BrandMark";
import LegalDocument from "./LegalDocument";
const PreviewBody = dynamic(() => import("./PreviewBody"), {
  ssr: false,
  loading: () => <p className="viewer-loading">Loading preview…</p>,
});
const garments = [
  { name: "T-shirt", detail: "A simple everyday layer." },
  { name: "Trousers", detail: "An easy, straight silhouette." },
  { name: "Sweater", detail: "A relaxed knit." },
];
type Capture = { name: string; url?: string; sample?: boolean };
export default function AlphaFlow() {
  const [step, setStep] = useState(-1),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [consent, setConsent] = useState(false),
    [marketing, setMarketing] = useState(false);
  const [captures, setCaptures] = useState<Record<number, Capture>>({}),
    [height, setHeight] = useState(""),
    [feet, setFeet] = useState(""),
    [inches, setInches] = useState(""),
    [weight, setWeight] = useState(""),
    [gender, setGender] = useState<"" | "male" | "female">(""),
    [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [error, setError] = useState(""),
    [status, setStatus] = useState<"idle" | "working" | "ready" | "failed">(
      "idle",
    ),
    [garment, setGarment] = useState(0),
    [size, setSize] = useState("M");
  const [shopOpen, setShopOpen] = useState(true);
  const [angle, setAngle] = useState(0),
    [zoom, setZoom] = useState(1),
    [reset, setReset] = useState(0),
    [notice, setNotice] = useState(""),
    [dialog, setDialog] = useState(""),
    [cameraStep, setCameraStep] = useState<number | null>(null),
    [mobileWardrobeOpen, setMobileWardrobeOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null),
    modal = useRef<HTMLDialogElement>(null),
    urls = useRef<Set<string>>(new Set());
  const app = useRef<HTMLDivElement>(null);
  const mobileMenu = useRef<HTMLButtonElement>(null);
  const mobileClose = useRef<HTMLButtonElement>(null);
  const historyId = useRef("");
  const historyIndex = useRef(0);
  useEffect(() => {
    historyId.current = crypto.randomUUID();
    window.history.replaceState(
      {
        ...window.history.state,
        alphaFlow: { id: historyId.current, step: -1, index: 0 },
      },
      "",
    );
    const onPop = (event: PopStateEvent) => {
      const entry = event.state?.alphaFlow;
      if (entry?.id !== historyId.current) return;
      historyIndex.current = entry.index;
      setStep(entry.step);
      setStatus(entry.step === 7 ? "working" : "idle");
      setError("");
      setNotice("");
      setDialog("");
      setCameraStep(null);
      setMobileWardrobeOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    app.current?.scrollTo({ top: 0 });
  }, [step]);
  useEffect(() => {
    const currentUrls = urls.current;
    return () => currentUrls.forEach(URL.revokeObjectURL);
  }, []);
  useEffect(() => {
    if (dialog) modal.current?.showModal();
    else modal.current?.close();
  }, [dialog]);
  useEffect(() => {
    if (mobileWardrobeOpen) mobileClose.current?.focus();
  }, [mobileWardrobeOpen]);
  useEffect(() => {
    if (status !== "working" || step !== 7) return;
    const t = setTimeout(() => {
      setStatus("ready");
      window.history.replaceState(
        {
          ...window.history.state,
          alphaFlow: {
            id: historyId.current,
            step: 8,
            index: historyIndex.current,
          },
        },
        "",
      );
      setStep(8);
    }, 1800);
    return () => clearTimeout(t);
  }, [status, step]);
  function go(n: number) {
    setMobileWardrobeOpen(false);
    historyIndex.current += 1;
    window.history.pushState(
      {
        ...window.history.state,
        alphaFlow: {
          id: historyId.current,
          step: n,
          index: historyIndex.current,
        },
      },
      "",
    );
    setStep(n);
    setError("");
    setNotice("");
  }
  function back() {
    if (historyIndex.current > 0) window.history.back();
    else go(Math.max(-1, step - 1));
  }
  function closeMobileWardrobe() {
    setMobileWardrobeOpen(false);
    requestAnimationFrame(() => mobileMenu.current?.focus());
  }
  function next(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (step === 0 && !name.trim()) return setError("Please enter your name.");
    if (
      step === 1 &&
      (!/^\+?[\d\s().-]{7,20}$/.test(phone.trim()) ||
        phone.replace(/\D/g, "").length < 7 ||
        phone.replace(/\D/g, "").length > 15)
    )
      return setError("Please enter a valid phone number.");
    if (step === 2 && !consent)
      return setError(
        "Please accept the Terms and acknowledge the Privacy Policy to continue.",
      );
    if (step >= 3 && step <= 5 && !captures[step])
      return setError("Take a capture or choose a file to continue.");
    if (step === 6) {
      const h =
          unit === "metric"
            ? Number(height)
            : Number(feet) * 12 + Number(inches),
        w = Number(weight);
      if (
        (unit === "imperial" &&
          (!feet ||
            !Number.isInteger(Number(feet)) ||
            Number(inches) < 0 ||
            Number(inches) >= 12)) ||
        !h ||
        h < (unit === "metric" ? 90 : 36) ||
        h > (unit === "metric" ? 250 : 98)
      )
        return setError("Please check your height and units.");
      if (
        !w ||
        w < (unit === "metric" ? 20 : 44) ||
        w > (unit === "metric" ? 350 : 772)
      )
        return setError("Please check your weight and units.");
      if (!gender) return setError("Please select Male or Female.");
      setStatus("working");
    }
    go(step + 1);
  }
  function changeUnits(next: "metric" | "imperial") {
    if (next === unit) return;
    if (next === "metric") {
      setHeight(
        feet || inches
          ? String(
              Math.round((Number(feet) * 12 + Number(inches)) * 2.54 * 10) / 10,
            )
          : "",
      );
    } else if (height) {
      const total = Math.round((Number(height) / 2.54) * 10) / 10;
      setFeet(String(Math.floor(total / 12)));
      setInches(String(Math.round((total % 12) * 10) / 10));
    } else {
      setFeet("");
      setInches("");
    }
    if (weight)
      setWeight(
        String(
          Math.round(
            Number(weight) * (next === "metric" ? 0.453592 : 1 / 0.453592) * 10,
          ) / 10,
        ),
      );
    setUnit(next);
  }
  function upload(file?: File) {
    if (!file) return;
    const video = step === 5;
    if (!file.type.startsWith(video ? "video/" : "image/"))
      return setError(video ? "Choose a video file." : "Choose an image file.");
    if (file.size > 150 * 1024 * 1024)
      return setError("Choose a file smaller than 150 MB.");
    const url = URL.createObjectURL(file);
    const oldUrl = captures[step]?.url;
    if (oldUrl) {
      URL.revokeObjectURL(oldUrl);
      urls.current.delete(oldUrl);
    }
    urls.current.add(url);
    setCaptures({ ...captures, [step]: { name: file.name, url } });
    setError("");
  }
  const stage = step < 3 ? 0 : step < 7 ? 1 : step < 8 ? 2 : 3;
  return (
    <div className="alpha-app" ref={app}>
      <header className="alpha-header">
        {step === 8 && (
          <button
            ref={mobileMenu}
            type="button"
            className="mobile-wardrobe-toggle"
            aria-label="Open wardrobe"
            aria-expanded={mobileWardrobeOpen}
            aria-controls="alpha-shop"
            onClick={() => setMobileWardrobeOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <a
          className="wordmark"
          href="/alpha"
          aria-label="Twinnie alpha home"
          onClick={(e) => {
            e.preventDefault();
            go(-1);
          }}
        >
          <BrandMark kind="wordmark" />
        </a>
        {step >= 0 && step < 8 && (
          <nav aria-label="Progress">
            {["Welcome", "Your photos", "Your twin", "Try on"].map((s, i) => (
              <span
                key={s}
                aria-current={stage === i ? "step" : undefined}
                className={stage === i ? "current" : ""}
              >
                <span className="step-dot" />
                {s}
              </span>
            ))}
          </nav>
        )}
        <span className="alpha-label">Alpha preview</span>
      </header>
      {step === -1 ? (
        <main className="alpha-home">
          <BrandMark kind="symbol" className="home-mark" />
          <h1 ref={title} tabIndex={-1}>
            Try It On.
          </h1>
          <button className="primary" onClick={() => go(0)}>
            Start Here <span aria-hidden="true">→</span>
          </button>
        </main>
      ) : step < 7 ? (
        <main
          className={
            "onboarding " + (step >= 3 && step <= 5 ? "capture-layout" : "")
          }
        >
          <form onSubmit={next} noValidate>
            <div className="eyebrow">
              {step < 3
                ? "A little about you"
                : step < 6
                  ? "Your photos"
                  : "One last detail"}
              <span>
                {step < 3
                  ? `${step + 1} / 3`
                  : step < 6
                    ? `${step - 2} / 3`
                    : ""}
              </span>
            </div>
            <h1 ref={title} tabIndex={-1}>
              {
                [
                  "What’s your name?",
                  "What’s your number?",
                  "Before we begin.",
                  "Face the camera.",
                  "Turn to the side",
                  "Take a spin",
                  "How tall are you?",
                ][step]
              }
            </h1>
            {step >= 3 && step <= 5 && (
              <p className="intro">
                {
                  [
                    "Keep your whole body in view, with your arms slightly apart.",
                    "For this one, you will turn 90 degrees to the side. Stand comfortably with your whole body in view.",
                    "For this one, you will take a 15 second video. Turn slowly, keeping your whole body in the frame.",
                  ][step - 3]
                }
              </p>
            )}
            {step === 0 && (
              <label className="field">
                <span className="sr-only">Full Name</span>
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  aria-invalid={!!error}
                  aria-describedby={error ? "form-error" : undefined}
                />
              </label>
            )}
            {step === 1 && (
              <>
                <label className="field">
                  <span className="sr-only">Phone number</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    aria-invalid={!!error}
                    aria-describedby={error ? "form-error" : undefined}
                  />
                </label>
              </>
            )}
            {step === 2 && (
              <div className="agreements">
                <label>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    I am 18 or older and agree to the{" "}
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setDialog("Terms")}
                    >
                      Terms
                    </button>{" "}
                    and acknowledge the{" "}
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setDialog("Privacy")}
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                  <span>
                    Keep me updated about Twinnie. <small>Optional</small>
                  </span>
                </label>
              </div>
            )}
            {step >= 3 && step <= 5 && (
              <>
                <div className="capture-frame">
                  {captures[step]?.url ? (
                    step === 5 ? (
                      <video controls src={captures[step].url} />
                    ) : (
                      <img
                        src={captures[step].url}
                        alt={
                          step === 3
                            ? "Your selected front photo"
                            : "Your selected side photo"
                        }
                      />
                    )
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 200 300"
                        role="img"
                        aria-label={
                          step === 4
                            ? "Side pose guide"
                            : "Full body pose guide"
                        }
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <ellipse
                            cx="100"
                            cy="43"
                            rx={step === 4 ? 12 : 17}
                            ry="22"
                          />
                          <path
                            d={
                              step === 4
                                ? "M98 65 Q126 91 111 151 L108 185 L115 267 L95 267 L91 187 L86 148 Q77 98 98 65 M106 84 L116 165"
                                : "M90 65 L70 78 L41 160 L51 166 L79 106 L78 151 L72 268 L88 268 L100 177 L112 268 L128 268 L122 151 L121 106 L149 166 L159 160 L130 78 L110 65"
                            }
                          />
                          <path d="M55 278 H145" strokeDasharray="3 6" />
                          {step === 5 && (
                            <path d="M38 200 C-12 220 204 240 169 200 M169 200 L167 216 M169 200 L185 203" />
                          )}
                        </g>
                      </svg>
                      <span>
                        {captures[step]?.sample
                          ? "Sample selected"
                          : step === 5
                            ? "Turn guide"
                            : "Pose guide"}
                      </span>
                    </>
                  )}
                </div>
                <div className="capture-actions">
                  <button
                    type="button"
                    className="primary"
                    onClick={() => setCameraStep(step)}
                  >
                    {step === 5 ? "Take video" : "Take photo"}
                  </button>
                  <label className="secondary upload">
                    {captures[step]
                      ? "Replace file"
                      : step === 5
                        ? "Choose video"
                        : "Choose photo"}
                    <input
                      type="file"
                      accept={step === 5 ? "video/*" : "image/*"}
                      onChange={(e) => upload(e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      const oldUrl = captures[step]?.url;
                      if (oldUrl) {
                        URL.revokeObjectURL(oldUrl);
                        urls.current.delete(oldUrl);
                      }
                      setCaptures({
                        ...captures,
                        [step]: { name: "Sample", sample: true },
                      });
                      setError("");
                    }}
                  >
                    Use sample
                  </button>
                  {captures[step] && (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        setCaptures((prev) => {
                          const n = { ...prev };
                          const oldUrl = n[step]?.url;
                          if (oldUrl) {
                            URL.revokeObjectURL(oldUrl);
                            urls.current.delete(oldUrl);
                          }
                          delete n[step];
                          return n;
                        })
                      }
                    >
                      Retake
                    </button>
                  )}
                </div>
                {captures[step] && (
                  <p className="small-note">{captures[step].name}</p>
                )}
              </>
            )}
            {step === 6 && (
              <>
                <div className="segmented" aria-label="Measurement units">
                  <button
                    type="button"
                    aria-pressed={unit === "imperial"}
                    onClick={() => changeUnits("imperial")}
                  >
                    Feet / inches / lbs
                  </button>
                  <button
                    type="button"
                    aria-pressed={unit === "metric"}
                    onClick={() => changeUnits("metric")}
                  >
                    cm / kg
                  </button>
                </div>
                {unit === "imperial" ? (
                  <div className="height-fields">
                    <label className="field">
                      Height (feet)
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        placeholder="5"
                        aria-invalid={!!error}
                      />
                    </label>
                    <label className="field">
                      Inches
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="11.9"
                        step="0.1"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        placeholder="10"
                        aria-invalid={!!error}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="field">
                    Height (cm)
                    <input
                      inputMode="decimal"
                      type="number"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="178"
                      aria-invalid={!!error}
                    />
                  </label>
                )}
                <label className="field">
                  Weight ({unit === "metric" ? "kg" : "lbs"})
                  <input
                    inputMode="decimal"
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === "metric" ? "75" : "165"}
                  />
                </label>
                <fieldset className="gender-field">
                  <legend>Gender</legend>
                  <div className="gender-options">
                    {(["male", "female"] as const).map((value) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="gender"
                          value={value}
                          required
                          checked={gender === value}
                          onChange={() => setGender(value)}
                        />
                        {value === "male" ? "Male" : "Female"}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
            {error && (
              <p id="form-error" className="error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              {step >= 0 ? (
                <button type="button" className="back" onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button className="primary" type="submit">
                {step === 6 ? "Create my twin" : "Continue"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </main>
      ) : step === 7 ? (
        <main className="creation">
          <div
            className={
              "creation-symbol " + (status === "working" ? "working" : "")
            }
            aria-hidden="true"
          >
            <BrandMark kind="symbol" />
          </div>
          <p className="eyebrow">Your twin</p>
          <h1 ref={title} tabIndex={-1}>
            {status === "ready"
              ? "Ready to take a look?"
              : status === "failed"
                ? "Let’s try that again."
                : "Creating your twin."}
          </h1>
          <p className="intro" role="status">
            {status === "ready"
              ? "A sample body is ready for you to explore."
              : status === "failed"
                ? "Your details are still here. Try again when you’re ready."
                : "This is a preview of the creation step."}
          </p>
          {status === "working" ? (
            <button
              className="back"
              onClick={() => {
                setStatus("idle");
                go(6);
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              className="primary"
              onClick={() =>
                status === "failed" ? setStatus("working") : go(8)
              }
            >
              {status === "failed" ? "Try again" : "Continue to shopping"} →
            </button>
          )}
        </main>
      ) : (
        <main className={`studio${shopOpen ? "" : " shop-closed"}`}>
          {mobileWardrobeOpen && (
            <button
              className="mobile-wardrobe-backdrop"
              aria-label="Close wardrobe"
              onClick={closeMobileWardrobe}
            />
          )}
          <aside
            id="alpha-shop"
            className={`studio-sidebar${mobileWardrobeOpen ? " mobile-open" : ""}`}
            role={mobileWardrobeOpen ? "dialog" : undefined}
            aria-modal={mobileWardrobeOpen ? true : undefined}
            aria-labelledby="wardrobe-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") closeMobileWardrobe();
            }}
          >
            <div className="mobile-wardrobe-heading">
              <span>Wardrobe</span>
              <button
                ref={mobileClose}
                type="button"
                aria-label="Close wardrobe"
                onClick={closeMobileWardrobe}
              >
                ×
              </button>
            </div>
            <p className="eyebrow">The wardrobe</p>
            <h2 id="wardrobe-title">Choose a piece.</h2>
            <div className="garments">
              {garments.map((g, i) => (
                <button
                  className={garment === i ? "selected" : ""}
                  key={g.name}
                  aria-pressed={garment === i}
                  onClick={() => {
                    setGarment(i);
                    setNotice("");
                    if (mobileWardrobeOpen) closeMobileWardrobe();
                  }}
                >
                  <span className="garment-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 40 44"
                      width="30"
                      height="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path
                        d={
                          i === 1
                            ? "M10 5 H30 L33 39 H23 L20 17 L17 39 H7 Z"
                            : i === 2
                              ? "M13 6 Q20 12 27 6 L33 11 L38 29 L31 32 L27 20 L28 39 H12 L13 20 L9 32 L2 29 L7 11 Z"
                              : "M13 7 Q20 14 27 7 L37 14 L32 23 L27 20 V38 H13 V20 L8 23 L3 14 Z"
                        }
                      />
                    </svg>
                  </span>
                  <span>
                    {g.name}
                    <small>Sample garment</small>
                  </span>
                  <span aria-hidden="true">{garment === i ? "●" : "○"}</span>
                </button>
              ))}
            </div>
            <p>{garments[garment].detail}</p>
            <fieldset>
              <legend>Size</legend>
              <div className="sizes">
                {["XS", "S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    aria-pressed={size === s}
                    onClick={() => {
                      setSize(s);
                      setNotice("");
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              className="primary"
              onClick={() => {
                setMobileWardrobeOpen(false);
                setNotice(
                  `${garments[garment].name}, size ${size} selected. Live try-on is not connected in this demo.`,
                );
              }}
            >
              Try this on →
            </button>
            <p className="selection-status" role="status">
              {notice}
            </p>
            <button className="back" onClick={() => go(6)}>
              ← Edit details
            </button>
          </aside>
          <section className="viewer-panel">
            <button
              className="shop-toggle"
              aria-label={shopOpen ? "Close shop" : "Open shop"}
              title={shopOpen ? "Close shop" : "Open shop"}
              aria-expanded={shopOpen}
              aria-controls="alpha-shop"
              onClick={() => setShopOpen(!shopOpen)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d={shopOpen ? "M14 6 L8 12 L14 18" : "M10 6 L16 12 L10 18"}
                />
              </svg>
            </button>
            <div className="viewer-heading">
              <div>
                <p className="eyebrow">Try on</p>
                <h1 ref={title} tabIndex={-1}>
                  Make it yours.
                </h1>
              </div>
              <div className="viewer-heading-actions">
                <span className="sample-label">Sample body</span>
              </div>
            </div>
            <div className="body-view">
              <PreviewBody angle={angle} zoom={zoom} reset={reset} />
            </div>
            <div className="viewer-controls" aria-label="View controls">
              {[
                ["Front", 0],
                ["Side", Math.PI / 2],
                ["Back", Math.PI],
              ].map(([label, a]) => (
                <button key={label} onClick={() => setAngle(Number(a))}>
                  {label}
                </button>
              ))}
              <span className="control-divider" />
              <button
                aria-label="Zoom in"
                disabled={zoom >= 1.6}
                onClick={() => setZoom(Math.min(1.6, zoom + 0.2))}
              >
                +
              </button>
              <button
                aria-label="Zoom out"
                disabled={zoom <= 0.8}
                onClick={() => setZoom(Math.max(0.8, zoom - 0.2))}
              >
                −
              </button>
              <button
                onClick={() => {
                  setAngle(0);
                  setZoom(1);
                  setReset(reset + 1);
                }}
              >
                Reset
              </button>
            </div>
            <p className="viewer-caption">
              Drag to rotate · Sample only, not your personal body
            </p>
          </section>
        </main>
      )}
      <footer className="alpha-footer">
        <button onClick={() => setDialog("Terms")}>Terms</button>
        <button onClick={() => setDialog("Privacy")}>Privacy Policy</button>
      </footer>
      {cameraStep !== null && (
        <CameraCapture
          key={cameraStep}
          kind={cameraStep === 3 ? "front" : cameraStep === 4 ? "side" : "spin"}
          onClose={() => setCameraStep(null)}
          onCapture={(file) => {
            upload(file);
            setCameraStep(null);
          }}
        />
      )}
      <dialog
        className="legal-dialog"
        aria-label={dialog === "Terms" ? "Terms of Use" : "Privacy Policy"}
        ref={modal}
        onCancel={() => setDialog("")}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialog("");
        }}
      >
        <button
          type="button"
          className="legal-close secondary"
          onClick={() => setDialog("")}
        >
          Close
        </button>
        <LegalDocument kind={dialog === "Terms" ? "terms" : "privacy"} />
        <button className="primary" onClick={() => setDialog("")}>
          Got it
        </button>
      </dialog>
    </div>
  );
}
