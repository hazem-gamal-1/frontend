"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Robot } from "@/components/Robot";
import AdditionalInputs from "@/app/(main-content)/interview/Canvas";
import { useVad } from "@/hooks/useVad";

type Props = {
  sessionId: string;
  lang: string;
};

type Phase =
  | "idle"
  | "fetching"
  | "playing"
  | "listening"
  | "submitting"
  | "done";

export default function InterviewPageClient({ sessionId, lang }: Props) {
  const router = useRouter();
  const [robotPhase, setRobotPhase] = useState<Phase>("idle");

  return (
    <main className="fixed inset-0 bg-background">
      <AdditionalInputs />

      <button
        onClick={() => router.push("/")}
        className="absolute right-4 top-4 z-30 rounded-md bg-red-500/50 px-3 py-2 text-sm font-medium text-foreground shadow-md backdrop-blur duration-100 hover:bg-red-500/75"
      >
        End Interview
      </button>

      <section className="absolute inset-0">
        <Canvas
          className="h-full w-full"
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ display: "block" }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            target={[0, 0, 0]}
            autoRotate={false}
          />
          <Suspense fallback={null}>
            <Robot phase={robotPhase} />
          </Suspense>
        </Canvas>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-lg backdrop-blur-md pointer-events-auto">
          <div className="border-b border-border/70 px-4 py-2">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="truncate">
                Session: {sessionId} · {lang}
              </span>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto px-4 py-3">
            <InterviewRoom
              lang={lang}
              sessionId={sessionId}
              onPhaseChange={setRobotPhase}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function InterviewRoom({
  lang,
  sessionId,
  onPhaseChange,
}: {
  lang: string;
  sessionId: string;
  onPhaseChange?: (phase: Phase) => void;
}) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [statusText, setStatusText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [history, setHistory] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [vadEnabled, setVadEnabled] = useState(false);
  const [isCodeQuestion, setIsCodeQuestion] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const pendingAnswer = useRef("");
  const submitting = useRef(false);
  const prevListening = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastFinal = useRef("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_AI_URL ?? "";
  const speechLang = lang === "english" ? "en-US" : "ar-EG";

  const {
    transcript,
    isListening,
    finalTranscript,
    clearTranscript,
    isMicAvailable,
    isBrowserSupported,
  } = useVad({
    enabled: vadEnabled,
    silenceTimeout_ms: 4000,
    language: speechLang,
  });

  useEffect(() => onPhaseChange?.(phase), [phase, onPhaseChange]);
  useEffect(() => setLiveTranscript(transcript), [transcript]);

  const playAudio = useCallback((b64: string): Promise<void> => {
    return new Promise((resolve) => {
      audioRef.current?.pause();
      const audio = new Audio(`data:audio/mp3;base64,${b64}`);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }, []);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (submitting.current) return;
      submitting.current = true;

      setVadEnabled(false);
      setShowSubmitButton(false);
      setPhase("submitting");
      setStatusText("Sending your answer…");
      setLiveTranscript("");
      pendingAnswer.current = "";
      lastFinal.current = "";

      setHistory((h) => [...h, { role: "user", text: answer }]);

      try {
        const fd = new FormData();
        fd.append("answer", answer);
        fd.append("code", "");

        const res = await fetch(
          `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
          { method: "POST", body: fd },
        );

        if (!res.ok) {
          const detail = await res.text().catch(() => res.statusText);
          throw new Error(`API ${res.status}: ${detail}`);
        }

        const data = await res.json();
        const structured = data.structured_response;
        const audio64: string = data.audio_base64;
        const questionType = structured?.question_type ?? "other";
        setIsCodeQuestion(questionType === "code");

        const feedback = structured?.feedback;
        const hasFeedback =
          feedback != null &&
          !(typeof feedback === "object" && Object.keys(feedback).length === 0);

        const aiText: string =
          structured?.content ?? (hasFeedback ? String(feedback?.summary ?? "") : "");

        setHistory((h) => [...h, { role: "ai", text: aiText }]);

        if (hasFeedback) {
          setPhase("done");
          setStatusText("Interview complete! Redirecting…");
          await playAudio(audio64);

          const resultsPayload = {
            content: structured.content ?? null,
            question_type: structured.question_type ?? "other",
            rewritten_code: structured.rewritten_code ?? null,
            feedback: {
              strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
              weaknesses: Array.isArray(feedback.weaknesses) ? feedback.weaknesses : [],
              suggestions: Array.isArray(feedback.suggestions) ? feedback.suggestions : [],
              score: typeof feedback.score === "number" ? feedback.score : 0,
              summary: feedback.summary ?? "",
            },
          };

          router.push(
            `/interviewResult?sessionId=${encodeURIComponent(sessionId)}&data=${encodeURIComponent(
              JSON.stringify(resultsPayload),
            )}`,
          );
          return;
        }

        setPhase("playing");
        setStatusText("Interviewer is speaking…");
        await playAudio(audio64);

        pendingAnswer.current = "";
        lastFinal.current = "";
        submitting.current = false;
        setLiveTranscript("");
        clearTranscript();
        setPhase("listening");

        if (questionType === "code") {
          setStatusText("Write your code and click Submit");
          setShowSubmitButton(true);
          setVadEnabled(false);
        } else {
          setStatusText("Your turn — speak now");
          setShowSubmitButton(false);
          setVadEnabled(true);
        }
      } catch (err) {
        console.error("[submitAnswer]", err);
        setStatusText("Something went wrong — please try again.");
        pendingAnswer.current = "";
        lastFinal.current = "";
        submitting.current = false;
        setLiveTranscript("");
        clearTranscript();
        setPhase("listening");
        setVadEnabled(true);
      }
    },
    [sessionId, BASE_URL, playAudio, router, clearTranscript],
  );

  useEffect(() => {
    if (phase !== "listening") return;
    if (isCodeQuestion) return;
    if (!finalTranscript || finalTranscript === lastFinal.current) return;

    const newChunk = finalTranscript.startsWith(lastFinal.current)
      ? finalTranscript.slice(lastFinal.current.length).trim()
      : finalTranscript;

    lastFinal.current = finalTranscript;
    if (!newChunk) return;

    pendingAnswer.current = (pendingAnswer.current + " " + newChunk).trim();
  }, [finalTranscript, phase, isCodeQuestion]);

  useEffect(() => {
    if (phase !== "listening") {
      prevListening.current = isListening;
      return;
    }

    const wentQuiet = prevListening.current && !isListening;
    prevListening.current = isListening;

    if (wentQuiet && pendingAnswer.current.trim() && !isCodeQuestion) {
      submitAnswer(pendingAnswer.current.trim());
    }
  }, [isListening, phase, submitAnswer, isCodeQuestion]);

  const startInterview = useCallback(async () => {
    setPhase("fetching");
    setStatusText("Preparing your interview…");
    setLiveTranscript("");
    pendingAnswer.current = "";
    lastFinal.current = "";
    submitting.current = false;
    setShowSubmitButton(false);

    try {
      const res = await fetch(
        `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
      );
      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      const structured = data.structured_response;
      const audio64: string = data.audio_base64;
      const questionType = structured?.question_type ?? "other";
      setIsCodeQuestion(questionType === "code");

      setHistory([{ role: "ai", text: structured?.content ?? "" }]);

      setPhase("playing");
      setStatusText("Interviewer is speaking…");
      await playAudio(audio64);

      pendingAnswer.current = "";
      lastFinal.current = "";
      submitting.current = false;
      setLiveTranscript("");
      clearTranscript();
      setPhase("listening");

      if (questionType === "code") {
        setStatusText("Write your code and click Submit");
        setShowSubmitButton(true);
        setVadEnabled(false);
      } else {
        setStatusText("Your turn — speak now");
        setShowSubmitButton(false);
        setVadEnabled(true);
      }
    } catch (err) {
      console.error("[startInterview]", err);
      setPhase("idle");
      setStatusText("Failed to start. Please try again.");
    }
  }, [sessionId, BASE_URL, playAudio, clearTranscript]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <button
          disabled
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold opacity-60 cursor-not-allowed"
        >
          Start Interview
        </button>
      </div>
    );
  }

  if (!isBrowserSupported) {
    return <div className="p-2 text-sm text-destructive">Please use Chrome or Edge.</div>;
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        {!isMicAvailable && (
          <p className="text-xs text-amber-500">
            Microphone access is required — allow it in your browser.
          </p>
        )}
        {statusText && <p className="text-xs text-destructive">{statusText}</p>}
        <button
          onClick={startInterview}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Start Interview
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full w-full">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card w-fit">
        <StatusDot phase={phase} isListening={isListening} />
        <span className="text-xs font-medium text-muted-foreground">{statusText}</span>
      </div>

      <div className="flex flex-col gap-2">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-muted text-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {msg.text || <span className="opacity-40 italic">…</span>}
            </div>
          </div>
        ))}

        {phase === "listening" && !!liveTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-primary/5 text-primary/60 italic border border-primary/20">
              {liveTranscript}
            </div>
          </div>
        )}
      </div>

      {phase === "listening" && !showSubmitButton && (
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Pause for 4 s to auto-submit
        </p>
      )}

      {phase === "listening" && showSubmitButton && (
        <button
          onClick={() => {
            if (pendingAnswer.current.trim()) {
              submitAnswer(pendingAnswer.current.trim());
            }
          }}
          className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Submit Code
        </button>
      )}
    </div>
  );
}

function StatusDot({ phase, isListening }: { phase: Phase; isListening: boolean }) {
  if (phase === "listening" && isListening) {
    return <span className="size-2 rounded-full bg-red-500 animate-pulse" />;
  }
  if (phase === "playing") {
    return <span className="size-2 rounded-full bg-blue-500 animate-pulse" />;
  }
  if (phase === "fetching" || phase === "submitting") {
    return (
      <svg
        className="size-3 animate-spin text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }
  if (phase === "done") {
    return <span className="size-2 rounded-full bg-green-500" />;
  }
  return <span className="size-2 rounded-full bg-muted-foreground/30" />;
}
