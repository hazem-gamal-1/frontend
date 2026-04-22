import { BookOpen, BriefcaseBusiness, Globe } from "lucide-react";

export const BRAND_STATS = [
  { value: "AI-Powered", label: "Question Engine" },
  { value: "Real-time", label: "Adaptive Feedback" },
  { value: "3 Steps", label: "To Get Started" },
] as const;

export const STEPS = [
  {
    id: 1,
    label: "CV Upload",
    Icon: BookOpen,
    description:
      "Upload your resume so the AI can tailor questions to your background.",
  },
  {
    id: 2,
    label: "Language & Gender",
    Icon: Globe,
    description:
      "Choose the interview language and your preferred interviewer.",
  },
  {
    id: 3,
    label: "Personality & Role",
    Icon: BriefcaseBusiness,
    description:
      "Set the interviewer's personality and define the job you're targeting.",
  },
] as const;
