// "use client";

// import { useInterviewStore } from "@/store/interviewStore";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useVad } from '../../../../hooks/useVad";

// type InterviewRoomProps = {
//   lang: string;
//   sessionId: string;
//   onPhaseChange?: (phase: Phase) => void;
//   onAvatarTextChange?: (text: string) => void;
// };

// type Phase =
//   | "idle"
//   | "fetching"
//   | "playing"
//   | "listening"
//   | "submitting"
//   | "done";

// export type { Phase };

// export const InterviewRoom = ({
//   lang,
//   sessionId,
//   onPhaseChange,
//   onAvatarTextChange,
// }: InterviewRoomProps) => {
//   const router = useRouter();

//   const code = useInterviewStore((s) => s.codeByLanguage[s.language]);
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const [phase, setPhase] = useState<Phase>("idle");
//   const [statusText, setStatusText] = useState("");
//   const [liveTranscript, setLiveTranscript] = useState("");
//   const [showTranscript, setShowTranscript] = useState(false);
//   const [history, setHistory] = useState<
//     { role: "ai" | "user"; text: string }[]
//   >([]);
//   const [vadEnabled, setVadEnabled] = useState(false);
//   const [isCodeQuestion, setIsCodeQuestion] = useState(false);
//   const [showSubmitButton, setShowSubmitButton] = useState(false);

//   const pendingAnswer = useRef("");
//   const submitting = useRef(false);
//   const prevListening = useRef(false);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const historyRef = useRef<HTMLDivElement>(null);
//   const lastFinal = useRef("");

//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_AI_URL ?? "";
//   const speechLang = lang === "english" ? "en-US" : "ar-EG";

//   const {
//     transcript,
//     isListening,
//     finalTranscript,
//     clearTranscript,
//     isMicAvailable,
//     isBrowserSupported,
//   } = useVad({
//     enabled: vadEnabled,
//     silenceTimeout_ms: 4000,
//     language: speechLang,
//   });

//   // Notify parent of phase changes (for robot animation)
//   useEffect(() => {
//     onPhaseChange?.(phase);
//   }, [phase, onPhaseChange]);

//   useEffect(() => {
//     setLiveTranscript(transcript);
//   }, [transcript]);

//   useEffect(() => {
//     if (historyRef.current)
//       historyRef.current.scrollTop = historyRef.current.scrollHeight;
//   }, [history, liveTranscript]);

//   const playAudio = useCallback((b64: string): Promise<void> => {
//     return new Promise((resolve) => {
//       audioRef.current?.pause();
//       const audio = new Audio(`data:audio/mp3;base64,${b64}`);
//       audioRef.current = audio;
//       audio.onended = () => resolve();
//       audio.onerror = () => resolve();
//       audio.play().catch(() => resolve());
//     });
//   }, []);

//   const submitAnswer = useCallback(
//     async (answer: string, options?: { includeCode?: boolean }) => {
//       if (submitting.current) return;
//       submitting.current = true;

//       const includeCode = options?.includeCode ?? true;

//       setVadEnabled(false);
//       setShowSubmitButton(false);
//       setPhase("submitting");
//       setStatusText("Sending your answer…");
//       setLiveTranscript("");

//       pendingAnswer.current = "";
//       lastFinal.current = "";

//       setHistory((h) => [...h, { role: "user", text: answer }]);

//       try {
//         const fd = new FormData();
//         fd.append("answer", answer);
//         //! add code to the fd
//         if (includeCode) {
//           fd.append("code", code);
//         }
//         console.log("formData ==> ", fd);
//         const res = await fetch(
//           `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
//           { method: "POST", body: fd },
//         );

//         if (!res.ok) {
//           const detail = await res.text().catch(() => res.statusText);
//           throw new Error(`API ${res.status}: ${detail}`);
//         }

//         const data = await res.json();
//         const structured = data.structured_response;
//         const audio64: string = data.audio_base64;
//         const questionType = structured?.question_type ?? "other";
//         setIsCodeQuestion(questionType === "code");

//         const feedback = structured?.feedback;
//         const hasFeedback =
//           feedback != null &&
//           !(typeof feedback === "object" && Object.keys(feedback).length === 0);

//         const aiText: string =
//           structured?.content ??
//           (hasFeedback ? String(feedback?.summary ?? "") : "");

//         // Update avatar text before adding to history
//         onAvatarTextChange?.(aiText);
//         setHistory((h) => [...h, { role: "ai", text: aiText }]);

//         if (hasFeedback) {
//           setPhase("done");
//           setStatusText("Interview complete! Redirecting…");
//           await playAudio(audio64);

//           const resultsPayload = {
//             content: structured.content ?? null,
//             question_type: structured.question_type ?? "other",
//             rewritten_code: structured.rewritten_code ?? null,
//             feedback: {
//               strengths: Array.isArray(feedback.strengths)
//                 ? feedback.strengths
//                 : [],
//               weaknesses: Array.isArray(feedback.weaknesses)
//                 ? feedback.weaknesses
//                 : [],
//               suggestions: Array.isArray(feedback.suggestions)
//                 ? feedback.suggestions
//                 : [],
//               score: typeof feedback.score === "number" ? feedback.score : 0,
//               summary: feedback.summary ?? "",
//             },
//           };

//           router.push(
//             `/interviewResult?sessionId=${encodeURIComponent(sessionId)}&data=${encodeURIComponent(JSON.stringify(resultsPayload))}`,
//           );
//           return;
//         }

//         setPhase("playing");
//         setStatusText("Interviewer is speaking…");
//         await playAudio(audio64);

//         pendingAnswer.current = "";
//         lastFinal.current = "";
//         submitting.current = false;
//         setLiveTranscript("");
//         clearTranscript();
//         setPhase("listening");

//         if (questionType === "code") {
//           setStatusText("Write your code and click Submit");
//           setShowSubmitButton(true);
//           setVadEnabled(false);
//         } else {
//           setStatusText("Your turn — speak now");
//           setShowSubmitButton(false);
//           setVadEnabled(true);
//         }
//       } catch (err) {
//         console.error("[submitAnswer]", err);
//         setStatusText("Something went wrong — please try again.");
//         pendingAnswer.current = "";
//         lastFinal.current = "";
//         submitting.current = false;
//         setLiveTranscript("");
//         clearTranscript();
//         setPhase("listening");
//         setVadEnabled(true);
//       }
//     },
//     [sessionId, BASE_URL, playAudio, onAvatarTextChange],
//   );

//   useEffect(() => {
//     if (phase !== "listening") return;
//     if (isCodeQuestion) return;
//     if (!finalTranscript || finalTranscript === lastFinal.current) return;

//     const newChunk = finalTranscript.startsWith(lastFinal.current)
//       ? finalTranscript.slice(lastFinal.current.length).trim()
//       : finalTranscript;

//     lastFinal.current = finalTranscript;

//     if (!newChunk) return;
//     pendingAnswer.current = (pendingAnswer.current + " " + newChunk).trim();
//   }, [finalTranscript, phase, isCodeQuestion]);

//   useEffect(() => {
//     if (phase !== "listening") {
//       prevListening.current = isListening;
//       return;
//     }
//     const wentQuiet = prevListening.current && !isListening;
//     prevListening.current = isListening;

//     if (wentQuiet && pendingAnswer.current.trim() && !isCodeQuestion) {
//       submitAnswer(pendingAnswer.current.trim(), { includeCode: false });
//     }
//   }, [isListening, phase, submitAnswer, isCodeQuestion]);

//   const startInterview = useCallback(async () => {
//     setPhase("fetching");
//     setStatusText("Preparing your interview…");
//     setLiveTranscript("");
//     pendingAnswer.current = "";
//     lastFinal.current = "";
//     submitting.current = false;
//     setShowSubmitButton(false);

//     try {
//       const res = await fetch(
//         `${BASE_URL}/interview/next_question?session_id=${encodeURIComponent(sessionId)}`,
//       );
//       if (!res.ok) throw new Error(`API ${res.status}`);

//       const data = await res.json();
//       const structured = data.structured_response;
//       const audio64: string = data.audio_base64;
//       const questionType = structured?.question_type ?? "other";
//       setIsCodeQuestion(questionType === "code");

//       const aiText = structured?.content ?? "";

//       // Update avatar text before adding to history
//       onAvatarTextChange?.(aiText);
//       setHistory([{ role: "ai", text: aiText }]);

//       setPhase("playing");
//       setStatusText("Interviewer is speaking…");
//       await playAudio(audio64);

//       pendingAnswer.current = "";
//       lastFinal.current = "";
//       submitting.current = false;
//       setLiveTranscript("");
//       clearTranscript();
//       setPhase("listening");

//       if (questionType === "code") {
//         setStatusText("Write your code and click Submit");
//         setShowSubmitButton(true);
//         setVadEnabled(false);
//       } else {
//         setStatusText("Your turn — speak now");
//         setShowSubmitButton(false);
//         setVadEnabled(true);
//       }
//     } catch (err) {
//       console.error("[startInterview]", err);
//       setPhase("idle");
//       setStatusText("Failed to start. Please try again.");
//     }
//   }, [sessionId, BASE_URL, playAudio, onAvatarTextChange]);

//   if (!mounted) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
//         <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
//           <MicIcon className="size-6 text-primary" />
//         </div>
//         <p className="text-sm text-muted-foreground max-w-[200px]">
//           Click below and your AI interviewer will greet you instantly.
//         </p>
//         <button
//           disabled
//           className="mt-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold opacity-60 cursor-not-allowed"
//         >
//           Start Interview
//         </button>
//       </div>
//     );
//   }

//   if (!isBrowserSupported) {
//     return (
//       <div className="p-4 text-sm text-destructive">
//         Please use Chrome or Edge to start the interview.
//       </div>
//     );
//   }

//   if (phase === "idle") {
//     return (
//       <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
//         <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
//           <MicIcon className="size-6 text-primary" />
//         </div>
//         <p className="text-sm text-muted-foreground max-w-[200px]">
//           Click below and your AI interviewer will greet you instantly.
//         </p>
//         {!isMicAvailable && (
//           <p className="text-xs text-amber-500">
//             Microphone access is required — please allow it in your browser.
//           </p>
//         )}
//         {statusText && <p className="text-xs text-destructive">{statusText}</p>}
//         <button
//           onClick={startInterview}
//           className="mt-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
//         >
//           Start Interview
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-3 h-full w-full">
//       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card w-fit shrink-0">
//         <StatusDot phase={phase} isListening={isListening} />
//         <span className="text-xs font-medium text-muted-foreground">
//           {statusText}
//         </span>
//       </div>

//       <div
//         ref={historyRef}
//         className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 min-h-0"
//       >
//         {history.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
//                 msg.role === "ai"
//                   ? "bg-muted text-foreground"
//                   : "bg-primary/10 text-primary"
//               }`}
//             >
//               {msg.text || <span className="opacity-40 italic">…</span>}
//             </div>
//           </div>
//         ))}

//         {phase === "listening" && showTranscript && liveTranscript && (
//           <div className="flex justify-end">
//             <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-primary/5 text-primary/60 italic border border-primary/20">
//               {liveTranscript}
//             </div>
//           </div>
//         )}

//         {phase === "listening" && !liveTranscript && (
//           <div className="flex justify-end">
//             <div className="px-3 py-2 rounded-xl border border-primary/20 bg-primary/5">
//               <div className="flex gap-1 items-center h-4">
//                 {[0, 1, 2].map((i) => (
//                   <span
//                     key={i}
//                     className="size-1.5 rounded-full bg-primary animate-bounce"
//                     style={{ animationDelay: `${i * 0.15}s` }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {phase === "listening" && !showSubmitButton && (
//         <div className="flex flex-col gap-2 shrink-0">
//           <button
//             onClick={() => setShowTranscript(!showTranscript)}
//             className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition"
//           >
//             {showTranscript ? "Hide" : "Show"} transcription
//           </button>
//           <p className="text-[10px] text-muted-foreground/50 text-center">
//             Pause for 4 s to send your answer automatically
//           </p>
//         </div>
//       )}

//       {phase === "listening" && showSubmitButton && (
//         <button
//           onClick={() => {
//             if (pendingAnswer.current.trim()) {
//               submitAnswer(pendingAnswer.current.trim());
//             }
//           }}
//           className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
//         >
//           Submit Code
//         </button>
//       )}
//     </div>
//   );
// };

// function StatusDot({
//   phase,
//   isListening,
// }: {
//   phase: Phase;
//   isListening: boolean;
// }) {
//   if (phase === "listening" && isListening)
//     return <span className="size-2 rounded-full bg-red-500 animate-pulse" />;
//   if (phase === "playing")
//     return <span className="size-2 rounded-full bg-blue-500 animate-pulse" />;
//   if (phase === "fetching" || phase === "submitting")
//     return (
//       <svg
//         className="size-3 animate-spin text-primary"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth={2}
//       >
//         <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
//       </svg>
//     );
//   if (phase === "done")
//     return <span className="size-2 rounded-full bg-green-500" />;
//   return <span className="size-2 rounded-full bg-muted-foreground/30" />;
// }

// function MicIcon({ className }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.8}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect x="9" y="2" width="6" height="11" rx="3" />
//       <path d="M19 10a7 7 0 0 1-14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }
