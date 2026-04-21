import { create } from "zustand";

export type SupportedLanguage =
  | "cpp"
  | "java"
  | "javascript"
  | "typescript"
  | "python";

const STARTER_CODE: Record<SupportedLanguage, string> = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}\n`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}\n`,
  javascript: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("JavaScript"));\n`,
  typescript: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("TypeScript"));\n`,
  python: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Python"))\n`,
};

type InterviewStore = {
  language: SupportedLanguage;
  codeByLanguage: Record<SupportedLanguage, string>;
  drawCanvas: string | null; // The getter is just the property itself
  setLanguage: (lang: SupportedLanguage) => void;
  setCode: (lang: SupportedLanguage, code: string) => void;
  setDrawCanvas: (image: string | null) => void; // The setter
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  language: "javascript",
  codeByLanguage: STARTER_CODE,
  drawCanvas: null,

  setLanguage: (lang) => set({ language: lang }),

  setCode: (lang, code) =>
    set((state) => ({
      codeByLanguage: { ...state.codeByLanguage, [lang]: code },
    })),

  setDrawCanvas: (image) => set({ drawCanvas: image }),
}));
