"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Notice } from "@/components/ui";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type RecorderState = "idle" | "recording" | "recorded" | "denied" | "missing" | "unsupported";

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/mpeg",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

function isSafari(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /safari/i.test(ua) && !/chrome|crios|android|edg|fxios/i.test(ua);
}

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function VoiceRecorder({
  disabled,
  sttConfigured,
  onAudio,
  onLiveHint,
  onClear,
}: {
  disabled?: boolean;
  sttConfigured: boolean;
  onAudio: (file: File, speechHint: string | null, durationSeconds: number) => void;
  onLiveHint: (hint: string) => void;
  onClear: () => void;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [safari] = useState(isSafari);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef(0);
  const hintRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const remaining = Math.max(0, site.voiceMaxSeconds - elapsed);
  const remainingWhole = Math.ceil(remaining);

  useEffect(() => {
    return () => {
      stopTracks();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (state !== "recording") {
      return;
    }
    const timer = window.setInterval(() => {
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      setElapsed(seconds);
      if (seconds >= site.voiceMaxSeconds) {
        stopRecording();
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [state]);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    window.cancelAnimationFrame(rafRef.current);
  }

  function drawWave() {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(data);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#1c1916";
    context.lineWidth = 1.5;
    context.beginPath();
    const slice = canvas.width / data.length;
    for (let i = 0; i < data.length; i += 1) {
      const sample = data[i] ?? 128;
      const x = i * slice;
      const y = (sample / 255) * canvas.height;
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
    rafRef.current = window.requestAnimationFrame(drawWave);
  }

  function startLiveCaption() {
    const SpeechApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechApi) {
      return;
    }
    const recognition = new SpeechApi();
    recognition.lang = "en-NG";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result?.[0]) {
          text += `${result[0].transcript} `;
        }
      }
      hintRef.current = text.trim();
      onLiveHint(hintRef.current);
    };
    recognition.start();
    recognitionRef.current = recognition;
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWave();

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      hintRef.current = "";
      recorder.onerror = () => {
        stopTracks();
        void audioContext.close();
        setState("unsupported");
      };
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });
        const extension = blob.type.includes("mp4") || blob.type.includes("aac") ? "m4a" : "webm";
        const file = new File([blob], `note.${extension}`, { type: blob.type });
        const url = URL.createObjectURL(blob);
        setPreviewUrl((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous);
          }
          return url;
        });
        onAudio(file, hintRef.current || null, (Date.now() - startedAtRef.current) / 1000);
        void audioContext.close();
        stopTracks();
        setState("recorded");
      };
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setElapsed(0);
      recorder.start(mimeType?.includes("mp4") ? 1000 : 250);
      startLiveCaption();
      setState("recording");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setState(name === "NotFoundError" ? "missing" : "denied");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  function clear() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setElapsed(0);
    setState("idle");
    onClear();
  }

  if (state === "unsupported") {
    return (
      <div className="space-y-3">
        <Notice>
          This browser cannot record audio. Paste a transcript below.
          {safari
            ? " On Safari, recording needs a recent version, and a secure connection."
            : ""}
        </Notice>
        <Button variant="ghost" onClick={() => setState("idle")}>
          Try again
        </Button>
      </div>
    );
  }

  if (state === "missing") {
    return (
      <div className="space-y-3">
        <Notice>
          No microphone was found. Connect one, or paste a transcript below.
        </Notice>
        <Button variant="ghost" onClick={() => setState("idle")}>
          Try again
        </Button>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="space-y-3">
        <Notice tone="caution">
          The microphone is blocked. Allow access in the browser, then try again.
          {safari
            ? " In Safari: Settings → Safari → Microphone, or the address-bar icon."
            : ""}{" "}
          You can always paste a transcript below.
        </Notice>
        <Button
          variant="ghost"
          aria-label="Try the microphone again"
          onClick={() => void startRecording()}
        >
          Allow the microphone
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        {state === "idle" ? (
          <Button
            variant="outline"
            aria-label="Start recording, forty-five seconds at most"
            onClick={() => void startRecording()}
            disabled={disabled}
          >
            Record
          </Button>
        ) : null}
        {state === "recording" ? (
          <Button
            variant="outline"
            aria-label="Stop recording"
            aria-pressed={true}
            onClick={stopRecording}
          >
            Stop
          </Button>
        ) : null}
        {state === "recorded" ? (
          <Button
            variant="ghost"
            aria-label="Discard the note and record again"
            onClick={clear}
            disabled={disabled}
          >
            Re-record
          </Button>
        ) : null}
        <p className="text-sm text-muted">
          {state === "recorded"
            ? `Recorded ${formatTime(elapsed)}`
            : "Forty-five seconds at most."}
        </p>
      </div>

      {state === "recording" ? (
        <p
          role="timer"
          aria-label={`${remainingWhole} seconds remaining`}
          className="text-sm text-muted"
        >
          {formatTime(elapsed)} · stops at forty-five
          <span className="sr-only">
            {remainingWhole} seconds remaining. Recording will stop at forty-five.
          </span>
        </p>
      ) : null}

      <canvas
        ref={canvasRef}
        width={320}
        height={64}
        className={cn(
          "h-16 w-full max-w-md border border-line bg-paper-2",
          state === "recording" ? "opacity-100" : "opacity-40",
        )}
        aria-hidden="true"
      />
      {safari ? (
        <p className="text-sm leading-6 text-muted">
          Safari: tap Record once, then allow the microphone. Use a secure page.
          If nothing is captured, paste the note.
        </p>
      ) : null}
      <p className="text-sm leading-6 text-muted">
        {sttConfigured
          ? "Edit the transcript if a word is wrong. Underlined words were uncertain. You can also paste."
          : "The studio will write a transcript from the recording. A live caption may appear. You can always edit or paste."}
      </p>
      {previewUrl ? (
        <audio controls src={previewUrl} className="w-full max-w-md">
          Your browser cannot play the note.
        </audio>
      ) : null}
    </div>
  );
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }> | undefined>;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
