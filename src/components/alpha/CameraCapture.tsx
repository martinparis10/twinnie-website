"use client";
import { useEffect, useRef, useState } from "react";

export type CaptureKind = "front" | "side" | "spin";
type Phase =
  | "instructions"
  | "opening"
  | "ready"
  | "countdown"
  | "recording"
  | "saving"
  | "error";
export const captureInstructions: Record<CaptureKind, string> = {
  front:
    "Set up your device on a table, stand, or window. Click on the photo, and the 10 second timer will start. Step away from the device until your full body is in the frame, raise your arms slightly, and hold still while the photo is taken.",
  side: "For this one, you will turn 90 degrees to the side. Set up your device on a table, stand, or window. Click on the photo, and the 10 second timer will start. Step away from the device until your full body is in the frame, turn 90 degrees to the left, keep your arms down, and hold still while the photo is taken.",
  spin: "For this one, you will take a 15 second video. Set up your device on a table, stand, or window. Click on the photo, and the 10 second timer will start. Step away from the device until your full body is in the frame. When the video begins, slowly spin for 15 seconds in a 360 degree circle.",
};
const headings = {
  front: "Take your front photo",
  side: "Take your side photo",
  spin: "Take a spin",
};

export default function CameraCapture({
  kind,
  onClose,
  onCapture,
}: {
  kind: CaptureKind;
  onClose: () => void;
  onCapture: (file: File) => void;
}) {
  const [phase, setPhase] = useState<Phase>("instructions");
  const [seconds, setSeconds] = useState(10);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const operation = useRef(0);
  const alive = useRef(true);
  const busy = useRef(false);

  function stopMedia() {
    if (timer.current) clearInterval(timer.current);
    if (stopTimer.current) clearTimeout(stopTimer.current);
    timer.current = null;
    stopTimer.current = null;
    const r = recorder.current;
    recorder.current = null;
    if (r) {
      r.ondataavailable = null;
      r.onstop = null;
      r.onerror = null;
      if (r.state !== "inactive") r.stop();
    }
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    busy.current = false;
  }
  function close() {
    alive.current = false;
    operation.current += 1;
    stopMedia();
    onClose();
  }
  function fail(message: string) {
    if (!alive.current) return;
    operation.current += 1;
    stopMedia();
    setError(message);
    setPhase("error");
  }
  useEffect(() => {
    alive.current = true;
    dialog.current?.showModal();
    const onHidden = () => {
      if (document.hidden) {
        operation.current += 1;
        stopMedia();
        setError(
          "The camera paused when you left Twinnie. Open it again when you’re ready.",
        );
        setPhase("error");
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", onHidden);
    return () => {
      alive.current = false;
      operation.current += 1;
      stopMedia();
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", onHidden);
    };
  }, []);

  async function openCamera(nextFacing = facing) {
    const id = ++operation.current;
    stopMedia();
    setError("");
    setFacing(nextFacing);
    setPhase("opening");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      return fail(
        "The camera needs a secure connection. Open Twinnie over HTTPS, or choose an existing photo or video instead.",
      );
    }
    if (kind === "spin" && typeof MediaRecorder === "undefined") {
      return fail(
        "This browser cannot record video here. Try Safari or Chrome, or choose an existing video.",
      );
    }
    let nextStream: MediaStream | null = null;
    try {
      nextStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: nextFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      if (!alive.current || id !== operation.current) {
        nextStream.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = nextStream;
      nextStream.getVideoTracks().forEach((track) =>
        track.addEventListener("ended", () => {
          if (alive.current && id === operation.current)
            fail("The camera disconnected. Open it again or choose a file.");
        }),
      );
      const preview = video.current;
      if (!preview) throw new Error("Camera preview unavailable");
      preview.srcObject = nextStream;
      await preview.play();
      if (!alive.current || id !== operation.current) return;
      setPhase("ready");
    } catch (err) {
      nextStream?.getTracks().forEach((t) => t.stop());
      if (!alive.current || id !== operation.current) return;
      const name = err instanceof DOMException ? err.name : "";
      fail(
        name === "NotAllowedError"
          ? "Camera access was denied. Allow camera access in your browser settings, then try again. You can also choose a file."
          : name === "NotFoundError"
            ? "No camera was found. Connect a camera or choose a file."
            : name === "NotReadableError"
              ? "Your camera may be in use by another app. Close that app and try again."
              : "We couldn’t open your camera. Try again or choose a file.",
      );
    }
  }

  function finish(file: File, id: number) {
    if (!alive.current || operation.current !== id) return;
    operation.current += 1;
    stopMedia();
    onCapture(file);
  }
  function takePhoto(id: number) {
    setPhase("saving");
    const preview = video.current;
    if (!preview?.videoWidth || preview.readyState < 2)
      return fail("The camera wasn’t ready. Please try again.");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = preview.videoWidth;
      canvas.height = preview.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return fail("We couldn’t save the photo. Please try again.");
      // Save the original camera orientation; only the selfie preview is mirrored.
      ctx.drawImage(preview, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!alive.current || id !== operation.current) return;
          if (!blob)
            return fail("We couldn’t save the photo. Please try again.");
          finish(
            new File([blob], `twinnie-${kind}.jpg`, { type: "image/jpeg" }),
            id,
          );
        },
        "image/jpeg",
        0.94,
      );
    } catch {
      fail("We couldn’t save the photo. Please try again.");
    }
  }
  function recordVideo(id: number) {
    if (!stream.current)
      return fail("The camera disconnected. Please try again.");
    try {
      const mimeType = [
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const r = new MediaRecorder(
        stream.current,
        mimeType ? { mimeType } : undefined,
      );
      recorder.current = r;
      const chunks: Blob[] = [];
      r.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      r.onerror = () =>
        fail("Recording stopped unexpectedly. Please try again.");
      r.onstop = () => {
        if (!alive.current || id !== operation.current) return;
        const type = r.mimeType || chunks[0]?.type || "video/webm";
        const blob = new Blob(chunks, { type });
        if (!blob.size) return fail("The video was empty. Please try again.");
        finish(
          new File(
            [blob],
            `twinnie-spin.${type.includes("mp4") ? "mp4" : "webm"}`,
            { type },
          ),
          id,
        );
      };
      r.start(1000);
      setPhase("recording");
      setSeconds(15);
      const end = performance.now() + 15000;
      timer.current = setInterval(
        () =>
          setSeconds(Math.max(0, Math.ceil((end - performance.now()) / 1000))),
        100,
      );
      stopTimer.current = setTimeout(() => {
        if (!alive.current || id !== operation.current) return;
        if (timer.current) clearInterval(timer.current);
        setPhase("saving");
        if (r.state !== "inactive") r.stop();
      }, 15000);
    } catch {
      fail(
        "This browser couldn’t start the recording. Try another browser or choose a video.",
      );
    }
  }
  function startCountdown() {
    if (phase !== "ready" || busy.current) return;
    if (!video.current?.videoWidth || video.current.readyState < 2)
      return fail("The camera is still starting. Please try again.");
    busy.current = true;
    const id = operation.current;
    setSeconds(10);
    setPhase("countdown");
    const end = performance.now() + 10000;
    timer.current = setInterval(
      () =>
        setSeconds(Math.max(0, Math.ceil((end - performance.now()) / 1000))),
      100,
    );
    stopTimer.current = setTimeout(() => {
      if (!alive.current || id !== operation.current) return;
      if (timer.current) clearInterval(timer.current);
      if (kind === "spin") recordVideo(id);
      else takePhoto(id);
    }, 10000);
  }

  return (
    <dialog
      ref={dialog}
      className="camera-dialog"
      aria-labelledby="camera-title"
      aria-describedby="camera-instructions"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="camera-heading">
        <h2 id="camera-title">{headings[kind]}</h2>
        <button
          type="button"
          className="back"
          aria-label="Close camera"
          onClick={close}
        >
          ✕
        </button>
      </div>
      <p id="camera-instructions" className="camera-instructions">
        {captureInstructions[kind]}
      </p>
      <div
        className="camera-stage"
        hidden={phase === "instructions" || phase === "error"}
      >
        <button
          type="button"
          className="camera-live"
          aria-label="Start 10-second countdown"
          disabled={phase !== "ready"}
          onClick={startCountdown}
        >
          <video
            ref={video}
            autoPlay
            playsInline
            muted
            className={facing === "user" ? "mirrored" : ""}
          />
          <span className="camera-guide" aria-hidden="true" />
          <span className="camera-overlay" aria-hidden="true">
            {phase === "ready"
              ? "Tap the view to start"
              : phase === "countdown"
                ? seconds
                : phase === "recording"
                  ? `● ${seconds}s · Slowly spin`
                  : phase === "saving"
                    ? "Saving…"
                    : "Opening camera…"}
          </span>
        </button>
      </div>
      <p
        className="camera-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {phase === "countdown"
          ? `Capture starts in ${seconds} seconds.`
          : phase === "recording"
            ? `Recording. Slowly spin. ${seconds} seconds remaining.`
            : phase === "ready"
              ? "Ready. Keep your full body in the frame."
              : phase === "saving"
                ? "Saving your capture…"
                : ""}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="camera-actions">
        {(phase === "instructions" || phase === "error") && (
          <button
            type="button"
            className="primary"
            onClick={() => openCamera()}
          >
            Open camera
          </button>
        )}
        {phase === "ready" && (
          <>
            <button type="button" className="primary" onClick={startCountdown}>
              Start 10-second timer
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() =>
                openCamera(facing === "user" ? "environment" : "user")
              }
            >
              Switch camera
            </button>
          </>
        )}
        <button type="button" className="back" onClick={close}>
          {phase === "recording" || phase === "countdown"
            ? "Cancel capture"
            : "Cancel"}
        </button>
      </div>
    </dialog>
  );
}
