"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronUp, ChevronDown, AppWindow, Code } from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";
import type { SupportedLanguage } from "@/store/interviewStore";
import { TabsDisplay } from "../../components/tabsDisplay";
import { cn } from "@/lib/utils";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "@/components/ui/button";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

type AdditionalInputsProps = {
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onSubmitCanvas?: (blob: Blob) => void;
  onSubmitCode?: () => void;
  activeTab?: string;
  onTabChange?: (val: string) => void;
};

export default function AdditionalInputs({ 
  className,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  onSubmitCanvas,
  onSubmitCode,
  activeTab,
  onTabChange,
}: AdditionalInputsProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 z-60 rounded-full border border-border bg-primary w-fit px-4 py-2 text-primary-foreground shadow-lg transition-all duration-300 ${
          isOpen ? "bottom-[calc(75vh+12px)]" : "bottom-3"
        }`}
        aria-label={isOpen ? "Close code canvas" : "Open code canvas"}
      >
        <span className="inline-flex items-center gap-2">
          {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          Canvas
        </span>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 h-[75vh] rounded-t-2xl border border-border bg-card shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${className ?? ""}`}
      >
        <TabsDisplay
          activeTab={activeTab}
          onTabChange={onTabChange}
          tabListStyle="absolute z-99 top-2.5 left-3"
          tabs={[
            {
              value: "Draw",
              icon: <AppWindow />,
              tabContent: <DrawTab onSubmitCanvas={onSubmitCanvas} />,
            },
            { value: "Code", icon: <Code />, tabContent: <CodeTab onSubmitCode={onSubmitCode} /> },
          ]}
        />
      </div>
    </>
  );
}

const DrawTab = ({ onSubmitCanvas }: { onSubmitCanvas?: (blob: Blob) => void }) => {
  return (
    <div className="relative h-full w-full">
      <Tldraw
        components={{ SharePanel: () => <SubmitCanvas_PNG onSubmitCanvas={onSubmitCanvas} /> }}
        className="mt-14 h-[calc(100%-50px)]!"
      />
    </div>
  );
};

function SubmitCanvas_PNG({ onSubmitCanvas }: { onSubmitCanvas?: (blob: Blob) => void }) {
  const editor = useEditor();

  const handleSubmit = async () => {
    const shapeIds = editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) {
      alert("canvas is empty");
      return;
    }

    const { blob } = await editor.toImage([...shapeIds], {
      format: "png",
      background: true,
    });
    
    if (onSubmitCanvas && blob) {
      onSubmitCanvas(blob);
    }
  };

  return (
    <Button
      className="pointer-events-auto cursor-pointer"
      onClick={handleSubmit}
    >
      Submit Image
    </Button>
  );
}

const CodeTab = ({ onSubmitCode }: { onSubmitCode?: () => void }) => {
  const language = useInterviewStore((s) => s.language);
  const codeByLanguage = useInterviewStore((s) => s.codeByLanguage);
  const setLanguage = useInterviewStore((s) => s.setLanguage);
  const setCode = useInterviewStore((s) => s.setCode);
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-end gap-3 border-b border-border px-4 py-2 min-h-[50px]">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select language"
          >
            {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map(
              (lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ),
            )}
          </select>
        </div>
        {onSubmitCode && (
          <Button onClick={onSubmitCode} className="h-8">
            Submit Code
          </Button>
        )}
      </div>

      <div className="flex-1">
        <Editor
          loading={<BarLoader />}
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          value={codeByLanguage[language]}
          // onChange + Debounce for the websocket
          onChange={(value) => setCode(language, value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

const BarLoader = ({ className }: { className?: string }) => {
  const delays = ["delay-0!", "delay-[-150ms]!", "delay-[-0.3s]!"];
  return (
    <div className="size-full flex justify-center items-center pointer-events-none">
      <div className={cn("flex items-center gap-0.75")}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              `w-1.5 rounded-sm bg-current animate-bar-pulse`,
              delays[i],
              className,
            )}
          />
        ))}
        <style>{`
          @keyframes bar-pulse {
            0%   { height: 22px; opacity: 1; }
            50%  { height: 10px; opacity: 0.3; }
            100% { height: 22px; opacity: 1; }
          }
          .animate-bar-pulse {
            animation: bar-pulse 0.8s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};
