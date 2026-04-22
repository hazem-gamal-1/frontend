"use client";
import { useInterviewStore } from "@/store/interviewStore";
import { BadgeCheck, Download, FileText, Share2, Zap } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// Matches Python Feedback model
type Feedback = {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number; // 0–10 float from Python
  summary: string;
};

// Matches Python Response model
type StructuredResponse = {
  content: string | null;
  question_type: "code" | "other";
  rewritten_code: string | null;
  feedback: Feedback | null;
};

function InterviewResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "N/A";

  const [structured, setStructured] = useState<StructuredResponse | null>(null);
  const setCode = useInterviewStore((s) => s.setCode);
  const language = useInterviewStore((s) => s.language);
  const rewrittenApplied = useRef(false);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (!raw) return;
    try {
      setStructured(JSON.parse(decodeURIComponent(raw)) as StructuredResponse);
    } catch {
      console.error("Failed to parse interview result data");
    }
  }, [searchParams]);

  useEffect(() => {
    if (rewrittenApplied.current) return;
    const rewritten = structured?.rewritten_code;
    if (typeof rewritten === "string" && rewritten.trim().length > 0) {
      setCode(language, rewritten);
      rewrittenApplied.current = true;
    }
  }, [structured, language, setCode]);

  const feedback = structured?.feedback;
  // Python score is 0–10 float; scale to 0–100 int for display
  const compositeScore = feedback ? Math.round(feedback.score * 10) : 0;
  const recommendation =
    compositeScore >= 70
      ? "Recommended"
      : compositeScore >= 50
        ? "Maybe"
        : "Not Recommended";

  const [activeTab, setActiveTab] = useState<"summary" | "feedback">("summary");

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Interview ID
            </h3>
            <p className="text-xl font-bold text-foreground break-all">
              #{sessionId}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{today}</p>
          </div>
          <nav className="space-y-1 border-t border-border pt-6">
            {(["summary", "feedback"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab === "summary" ? (
                  <FileText className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Zap className="w-4 h-4 flex-shrink-0" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1">
        <div className="border-b border-border px-8 py-6 bg-card">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <div className="space-y-1">
              <p className="uppercase text-xs tracking-wider text-muted-foreground">
                Session ID: <span className="ml-2">#{sessionId}</span>
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Interview Result
              </h1>
              <p className="text-muted-foreground text-sm">{today}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition text-foreground">
                <Share2 className="w-4 h-4" /> Share Result
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition text-foreground">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {!feedback ? (
            <p className="text-muted-foreground text-sm">
              No result data found.
            </p>
          ) : activeTab === "summary" ? (
            <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl overflow-hidden w-full h-80 border border-primary/20">
                <Image
                  src="/fluid background.png"
                  width={358}
                  height={204}
                  alt="score-bg"
                  className="inset-0 absolute object-cover object-center w-full h-full rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-transparent rounded-2xl" />
                <div className="relative h-full flex flex-col justify-center items-center gap-4 z-10">
                  <p className="uppercase font-bold text-sm tracking-wider text-foreground">
                    Composite Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-7xl font-bold text-foreground">
                      {compositeScore}
                    </p>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <div className="rounded-full flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-primary/10 border border-primary/30">
                    <BadgeCheck className="w-4 h-4 text-chart-3" />
                    <span className="font-semibold text-sm text-foreground">
                      {recommendation}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-xl h-80 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  Summary
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {feedback.summary || "No summary available."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Feedback
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Strengths",
                    items: feedback.strengths,
                    color: "text-chart-3",
                  },
                  {
                    label: "Weaknesses",
                    items: feedback.weaknesses,
                    color: "text-chart-4",
                  },
                  {
                    label: "Suggestions",
                    items: feedback.suggestions,
                    color: "text-chart-2",
                  },
                ].map(({ label, items, color }) => (
                  <div
                    key={label}
                    className="p-6 bg-card border border-border rounded-lg"
                  >
                    <h3 className={`font-semibold ${color} mb-3`}>{label}</h3>
                    <ul className="space-y-2">
                      {(items ?? []).map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className={color}>•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading result...
      </div>
    }>
      <InterviewResultContent />
    </Suspense>
  );
}
