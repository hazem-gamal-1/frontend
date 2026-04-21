import femaleAvatar from "../public/svg/femaleAvatar.svg";
import maleAvatar from "../public/svg/maleAvatar.svg";
import {
  Smile,
  Coffee,
  Scale,
  Handshake,
  Languages,
  FileText,
} from "lucide-react";

export const INTERVIEW_PERSONALITY = [
  {
    value: "friendly",
    Icon: Smile,
    label: "Friendly",
    desc: "Warm & encouraging",
  },
  {
    value: "professional",
    Icon: Handshake,
    label: "Professional",
    desc: "Formal & precise",
  },
  { value: "tough", Icon: Scale, label: "Tough", desc: "Direct & demanding" },
  {
    value: "casual",
    Icon: Coffee,
    label: "Casual",
    desc: "Relaxed & easy-going",
  },
] as const;

export const INTERVIEW_LANGUAGE = [
  { value: "english", Icon: Languages, label: "English", sub: "EN" },
  { value: "arabic", Icon: FileText, label: "Arabic", sub: "AR" },
] as const;

export const INTERVIEW_GENDER = [
  { value: "male", label: "Male", src: maleAvatar },
  { value: "female", label: "Female", src: femaleAvatar },
] as const;

export const SUGGESTIONS = [
  "Frontend",
  "Backend",
  "System Design",
  "Python",
  "React",
  "Node.js",
  "DevOps",
  "ML/AI",
  "Mobile",
  "TypeScript",
] as const;
