import {
  Award,
  BookOpenText,
  Building2,
  DollarSign,
  Handshake,
  Home,
  LucideBadgeQuestionMark,
  Settings,
  Trophy,
  UserCircle2Icon,
} from "lucide-react";
import { Route } from "./nav-main";

export const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

export const dashboardRoutes: Route[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    Icon: Home,
    link: "/dashboard",
  },
  {
    id: "companies",
    title: "Companies",
    Icon: Building2,
    link: "#",
  },
  {
    id: "finance",
    title: "Finance",
    Icon: DollarSign,
    link: "#",
    subs: [
      { title: "Payout Account", link: "#" },
      { title: "Subscriptions", link: "#" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    Icon: BookOpenText,
    link: "/resources",
    subs: [
      {
        title: "Question Bank",
        Icon: LucideBadgeQuestionMark,
        link: "/resources/questionBank",
      },
    ],
  },
  {
    id: "community",
    title: "Community",
    Icon: Handshake,
    link: "/community",
    subs: [
      {
        title: "Leaderboard",
        Icon: Award,
        link: "/community/leaderboard",
      },
      {
        title: "Challenges",
        Icon: Trophy,
        link: "/community/challenges",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    Icon: Settings,
    link: "/settings",
  },
];

export const accounts = [
  { id: "1", name: "account1", logo: UserCircle2Icon, plan: "Free Plan" },
  { id: "2", name: "account2", logo: UserCircle2Icon, plan: "Free Plan" },
  { id: "3", name: "account3", logo: UserCircle2Icon, plan: "Free Plan" },
];
