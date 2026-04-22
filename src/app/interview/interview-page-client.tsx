"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "@/components/Model";
import AdditionalInputs from "@/app/interview/Canvas";
import { FadeIn } from "../../../motion-Wrappers/fade-in";
import { StaggerItem } from "../../../motion-Wrappers/stagger-items";
import { useSpeech } from "@/hooks/useVad";
import { useInterviewStore } from "@/store/interviewStore";

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

  const [phase, setPhase] = useState<Phase>("idle");
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<
    { role: "ai" | "user"; text: string }[]
  >([]);
  const [vadEnabled, setVadEnabled] = useState(false);
  const [questionType, setQuestionType] = useState<"code" | "image" | "other">(
    "other",
  );
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Code");
  const [todos, setTodos] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const pendingAnswer = useRef("");
  const lastFinal = useRef("");
  const prevListening = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_AI_URL ?? "https://brova-endpoints.vercel.app";
  const speechLang = lang === "english" ? "en-US" : "ar-EG";

  const {
    transcript,
    isListening,
    finalTranscript,
    clearTranscript,
    isMicAvailable,
    isBrowserSupported,
  } = useSpeech({
    enabled: vadEnabled,
    silenceTimeout_ms: 4000,
    language: speechLang,
  });

  const codeByLanguage = useInterviewStore((s) => s.codeByLanguage);
  const language = useInterviewStore((s) => s.language);

  const playAudioBlob = useCallback((blob: Blob): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) return resolve();
      const url = URL.createObjectURL(blob);
      const audio = audioRef.current;
      audio.pause();
      audio.src = url;
      audio.onended = () => resolve();
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        resolve();
      };
      audio.play().catch((e) => {
        console.error("Audio play caught error (Autoplay blocked?):", e);
        resolve();
      });
    });
  }, []);

  const handleAIResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const b64Header = res.headers.get("X-Structured-Response");
    let structured: any = {};
    if (b64Header) {
      const binaryString = atob(b64Header);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      structured = JSON.parse(new TextDecoder("utf-8").decode(bytes));
    }

    const qType = structured.question_type ?? "other";
    setQuestionType(qType);

    const feedback = structured.feedback;
    const hasFeedback = feedback && Object.keys(feedback).length > 0;

    const aiText = structured.content ?? (hasFeedback ? feedback.summary : "");

    setHistory((h) => [...h, { role: "ai", text: aiText }]);

    const audioBlob = await res.blob();

    const todosHeader = res.headers.get("X-Todos");
    if (todosHeader) {
      try {
        const binaryString = atob(todosHeader);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        setTodos(JSON.parse(new TextDecoder("utf-8").decode(bytes)));
      } catch (e) {
        console.error("Error parsing X-Todos", e);
      }
    }

    const stepHeader = res.headers.get("X-Current-Step-Index");
    if (stepHeader) {
      setCurrentStepIndex(parseInt(stepHeader, 10) || 0);
    }

    if (hasFeedback) {
      setPhase("done");
      await playAudioBlob(audioBlob);

      const resultsPayload = {
        content: structured.content ?? null,
        question_type: structured.question_type ?? "other",
        rewritten_code: structured.rewritten_code ?? null,
        feedback: {
          strengths: Array.isArray(feedback.strengths)
            ? feedback.strengths
            : [],
          weaknesses: Array.isArray(feedback.weaknesses)
            ? feedback.weaknesses
            : [],
          suggestions: Array.isArray(feedback.suggestions)
            ? feedback.suggestions
            : [],
          score: typeof feedback.score === "number" ? feedback.score : 0,
          summary: feedback.summary ?? "",
        },
      };

      router.push(
        `/interviewResult?sessionId=${encodeURIComponent(sessionId)}&data=${encodeURIComponent(JSON.stringify(resultsPayload))}`,
      );
      return;
    }

    setPhase("playing");
    setCanvasOpen(false);
    await playAudioBlob(audioBlob);

    setPhase("listening");

    if (qType === "code") {
      setVadEnabled(false);
      setActiveTab("Code");
      setCanvasOpen(true);
    } else if (qType === "image") {
      setVadEnabled(false);
      setActiveTab("Draw");
      setCanvasOpen(true);
    } else {
      setVadEnabled(true);
      setCanvasOpen(false);
    }
  };

  const startInterview = async () => {
    setStarted(true);
    setPhase("fetching");
    pendingAnswer.current = "";
    lastFinal.current = "";
    try {
      const res = await fetch(
        `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
      );
      await handleAIResponse(res);
    } catch (err) {
      console.error(err);
      setPhase("idle");
    }
  };

  const submitAnswer = async (
    answerText: string,
    code?: string,
    imageBlob?: Blob,
  ) => {
    if (phase === "submitting" || phase === "done") return;
    clearTranscript(); // Clear immediately to prevent race conditions
    setVadEnabled(false);
    setPhase("submitting");

    pendingAnswer.current = "";
    lastFinal.current = "";

    setHistory((h) => [
      ...h,
      {
        role: "user",
        text: answerText || (code ? "[Code Submitted]" : "[Image Submitted]"),
      },
    ]);

    try {
      const fd = new FormData();
      if (answerText) fd.append("answer", answerText);
      if (code) fd.append("code", code);
      if (imageBlob) fd.append("image", imageBlob, "canvas.png");

      const res = await fetch(
        `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: "POST",
          body: fd,
        },
      );

      await handleAIResponse(res);
    } catch (err) {
      console.error(err);
      setPhase("listening");
      if (questionType === "other") setVadEnabled(true);
    }
  };

  useEffect(() => {
    if (phase === "listening" && vadEnabled && finalTranscript) {
      submitAnswer(finalTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript, phase, vadEnabled]);

  const handleSubmitCode = () => {
    const currentCode = codeByLanguage[language];
    submitAnswer("", currentCode, undefined);
  };

  const handleSubmitCanvas = (blob: Blob) => {
    submitAnswer("", undefined, blob);
  };

  const handleAskQuestion = () => {
    clearTranscript();
    setCanvasOpen(false);
    setVadEnabled(true);
  };

  return (
    <main className="fixed inset-0 bg-background">
      <audio ref={audioRef} className="hidden" playsInline />
      <AdditionalInputs
        isOpen={canvasOpen}
        setIsOpen={setCanvasOpen}
        onSubmitCode={handleSubmitCode}
        onSubmitCanvas={handleSubmitCanvas}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => router.push("/")}
        className="absolute right-4 top-4 z-30 rounded-md bg-red-500/50 px-3 py-2 text-sm font-medium text-foreground shadow-md backdrop-blur duration-100 hover:bg-red-500/75"
      >
        End Interview
      </motion.button>

      {/* Todos Widget */}
      {started && todos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-4 top-4 z-20 w-72 rounded-xl border border-border/70 bg-card/80 shadow-lg backdrop-blur-md p-4 flex flex-col gap-3 max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <h3 className="font-semibold text-sm border-b border-border/50 pb-2">
            Interview Plan
          </h3>
          <div className="flex flex-col gap-3">
            {todos.map((todo, i) => {
              const isPast = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div
                  key={i}
                  className={`flex gap-2.5 text-sm ${isPast ? "text-muted-foreground line-through opacity-70" : isCurrent ? "text-primary font-medium" : "text-foreground/80"}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <span className="text-green-500 font-bold">✓</span>
                    ) : isCurrent ? (
                      <span className="size-2 mt-1.5 rounded-full bg-primary animate-pulse block" />
                    ) : (
                      <span className="size-2 mt-1.5 rounded-full bg-border block" />
                    )}
                  </div>
                  <span className="leading-snug">{todo}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <section className="absolute inset-0">
        <Canvas
          className="h-full w-full"
          camera={{ position: [2, -0.2, 0], fov: 50 }}
          style={{ display: "block" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[0, -0.3, 0]}
            autoRotate={false}
          />
          <Suspense fallback={null}>
            {/* Provide phase to Model so it triggers appropriate animations */}
            <Model phase={phase} avatarText="" />
          </Suspense>
        </Canvas>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-lg backdrop-blur-md">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="pointer-events-auto flex items-center justify-center px-4 py-3"
              >
                {!isBrowserSupported ? (
                  <p className="text-red-500 text-sm">
                    Browser does not support Speech Recognition.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={startInterview}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Start Interview
                    </button>
                    {!isMicAvailable && (
                      <p className="text-xs text-amber-500">
                        Please allow microphone access.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="panel"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FadeIn direction="up" delay={0.05}>
                  <div className="border-b border-border/70 px-4 py-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${phase === "playing" ? "bg-blue-500 animate-pulse" : phase === "listening" ? "bg-red-500 animate-pulse" : "bg-primary"}`}
                        />
                        <span>
                          {phase === "fetching" && "Connecting..."}
                          {phase === "playing" && "AI is speaking..."}
                          {phase === "listening" &&
                            questionType === "other" &&
                            "Listening to you..."}
                          {phase === "listening" &&
                            (questionType === "code" ||
                              questionType === "image") &&
                            "Waiting for your submission..."}
                          {phase === "submitting" && "Submitting..."}
                        </span>
                      </div>
                      <span className="truncate">Session: {sessionId}</span>
                    </div>
                  </div>
                </FadeIn>

                <div className="max-h-48 overflow-y-auto px-4 py-3 flex flex-col gap-2 pointer-events-auto">
                  {history.map((msg, i) => (
                    <StaggerItem
                      key={i}
                      index={i}
                      className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
                        msg.role === "ai"
                          ? "bg-secondary text-foreground self-start"
                          : "bg-primary/10 text-primary self-end"
                      }`}
                    >
                      {msg.role === "ai" ? "AI: " : "You: "}
                      {msg.text}
                    </StaggerItem>
                  ))}

                  {phase === "listening" && transcript && (
                    <div className="rounded-lg px-3 py-2 text-sm max-w-[85%] bg-primary/5 text-primary/60 italic self-end">
                      You: {transcript}
                    </div>
                  )}

                  {/* Options for code/image questions */}
                  {phase === "listening" &&
                    (questionType === "code" || questionType === "image") &&
                    !canvasOpen &&
                    !vadEnabled && (
                      <div className="pointer-events-auto flex flex-col gap-2 mt-4 items-end">
                        <p className="text-xs text-muted-foreground mb-1">
                          How would you like to respond?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAskQuestion}
                            className="text-sm font-medium border border-primary/50 hover:bg-primary/10 text-primary px-4 py-2 rounded-lg transition-colors"
                          >
                            Ask a question (Voice)
                          </button>
                          <button
                            onClick={() => setCanvasOpen(true)}
                            className="text-sm font-medium bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg transition-opacity shadow-sm"
                          >
                            {questionType === "code"
                              ? "Open Code Editor"
                              : "Open Drawing Canvas"}
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
