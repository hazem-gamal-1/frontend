"use client";

import React, { useState } from "react";
import {
  Mic,
  TrendingUp,
  Trophy,
  Clock,
  Eye,
  RotateCcw,
  Plus,
  Award,
  Flame,
  Zap,
  CheckCircle,
} from "lucide-react";

interface Interview {
  id: number;
  date: string;
  title: string;
  company: string;
  description: string;
  score: number;
}

const interviews: Interview[] = [
  {
    id: 1,
    date: "Apr 12, 2026",
    title: "Senior Software Engineer",
    company: "Stripe",
    description:
      "Full-stack interview focusing on system design and React architecture.",
    score: 94,
  },
  {
    id: 2,
    date: "Apr 10, 2026",
    title: "Product Manager",
    company: "Notion",
    description:
      "Behavioral + product sense round. Discussed roadmap prioritization.",
    score: 87,
  },
  {
    id: 3,
    date: "Apr 8, 2026",
    title: "Backend Engineer",
    company: "Vercel",
    description:
      "Deep dive into Node.js, databases, and API scaling strategies.",
    score: 76,
  },
  {
    id: 4,
    date: "Apr 5, 2026",
    title: "Frontend Engineer",
    company: "Linear",
    description: "Live coding + component design with Tailwind and shadcn/ui.",
    score: 91,
  },
];

const achievements = [
  {
    id: 1,
    icon: Award,
    name: "Interview Master",
    color: "text-purple-400",
  },
  {
    id: 2,
    icon: Flame,
    name: "10-Day Streak",
    color: "text-orange-400",
  },
  {
    id: 3,
    icon: Zap,
    name: "Perfect Score",
    color: "text-emerald-400",
  },
  {
    id: 4,
    icon: CheckCircle,
    name: "System Design Pro",
    color: "text-blue-400",
  },
];

export default function InterviewDashboard() {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  const openModal = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  const closeModal = () => {
    setSelectedInterview(null);
  };

  const restartInterview = (id?: number) => {
    closeModal();
    alert(id ? `Restarting interview #${id}...` : "Starting new interview...");
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Your interview journey • Purple Edition
              </p>
            </div>
            <button
              onClick={() => restartInterview()}
              className="mt-6 sm:mt-0 flex items-center gap-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Interview
            </button>
          </div>

          {/* Statistics Cards - Fully responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
            {/* Total Interviews */}
            <div className="bg-card border border-border rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Interviews
                  </p>
                  <p className="text-4xl font-semibold mt-4">47</p>
                </div>
                <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-8 flex items-center text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12 this month
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-card border border-border rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </p>
                  <p className="text-4xl font-semibold mt-4">82.4</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
                <div className="w-11 h-11 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-8 flex items-center text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +4.2 last month
              </div>
            </div>

            {/* Best Score */}
            <div className="bg-card border border-border rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Best Score
                  </p>
                  <p className="text-4xl font-semibold mt-4">96</p>
                </div>
                <div className="w-11 h-11 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="mt-8 text-xs text-muted-foreground">
                Product Manager • Google
              </div>
            </div>

            {/* Hours Practiced */}
            <div className="bg-card border border-border rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Hours Practiced
                  </p>
                  <p className="text-4xl font-semibold mt-4">124</p>
                </div>
                <div className="w-11 h-11 bg-violet-500/10 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-violet-500" />
                </div>
              </div>
              <div className="mt-8 flex items-center text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                18h this month
              </div>
            </div>
          </div>

          {/* Unlocked Achievements - New section between cards and table */}
          <div className="mb-10 md:mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-semibold">Unlocked Achievements</h2>
              <span className="text-sm text-muted-foreground">
                4 new this month
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="bg-card border border-border rounded-3xl px-5 py-4 flex items-center gap-x-4 min-w-[220px] snap-center transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${achievement.color}`} />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned Apr 10
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Interviews Table */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="px-6 md:px-8 py-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Interviews</h2>
              <div className="text-sm bg-secondary text-secondary-foreground px-4 py-1.5 rounded-3xl">
                All Interviews
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-6 md:px-8 py-5 text-left text-sm font-medium text-muted-foreground">
                      Date
                    </th>

                    {/* Title + description hidden on mobile */}
                    <th className="hidden md:table-cell px-6 md:px-8 py-5 text-left text-sm font-medium text-muted-foreground">
                      Interview
                    </th>

                    {/* Only title visible on mobile */}
                    <th className="md:hidden px-6 md:px-8 py-5 text-left text-sm font-medium text-muted-foreground">
                      Role
                    </th>

                    <th className="px-6 md:px-8 py-5 text-left text-sm font-medium text-muted-foreground">
                      Score
                    </th>
                    <th className="px-6 md:px-8 py-5 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {interviews.map((interview) => (
                    <tr
                      key={interview.id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 md:px-8 py-6 text-sm whitespace-nowrap">
                        {interview.date}
                      </td>

                      {/* Full interview column hidden on mobile */}
                      <td className="hidden md:table-cell px-6 md:px-8 py-6">
                        <div className="font-medium">{interview.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {interview.company}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {interview.description}
                        </div>
                      </td>

                      {/* Mobile-only title */}
                      <td className="md:hidden px-6 md:px-8 py-6">
                        <div className="font-medium">{interview.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {interview.company}
                        </div>
                      </td>

                      <td className="px-6 md:px-8 py-6">
                        <div className="inline-flex items-center gap-x-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="font-semibold text-lg">
                            {interview.score}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            /100
                          </span>
                        </div>
                      </td>

                      <td className="px-6 md:px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-x-4 opacity-75 group-hover:opacity-100">
                          <button
                            onClick={() => openModal(interview)}
                            className="flex items-center gap-x-1 text-sm hover:text-primary transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => restartInterview(interview.id)}
                            className="flex items-center gap-x-1 text-sm hover:text-primary transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restart
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 md:px-8 py-5 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <div>Showing 1–4 of 47 interviews</div>
              <div className="flex gap-x-2">
                <button className="px-5 py-2 rounded-2xl hover:bg-secondary transition-colors">
                  Previous
                </button>
                <button className="px-5 py-2 bg-primary text-primary-foreground rounded-2xl">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedInterview && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border w-full max-w-2xl rounded-3xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {selectedInterview.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {selectedInterview.date} • {selectedInterview.company}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-4xl leading-none text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="mt-8 bg-secondary/70 rounded-3xl p-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overall Score
                    </p>
                    <p className="text-6xl font-semibold text-primary">
                      {selectedInterview.score}
                      <span className="text-2xl align-super text-muted-foreground ml-1">
                        /100
                      </span>
                    </p>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-x-2 text-sm font-medium">
                    <CheckCircle className="w-5 h-5" />
                    Strong Performance
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-medium mb-3">Description</p>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedInterview.description}
                </p>
              </div>
            </div>

            <div className="border-t border-border px-8 py-6 flex gap-x-3">
              <button
                onClick={closeModal}
                className="flex-1 py-4 border border-border rounded-3xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => restartInterview(selectedInterview.id)}
                className="flex-1 py-4 bg-primary text-primary-foreground rounded-3xl text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Restart This Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
