"use client";

import { Button } from "@/components/ui/button";
import { CircleQuestionMarkIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const duration = useMemo(
    () => formatDuration(elapsedSeconds),
    [elapsedSeconds],
  );

  return (
    <>
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="text-2xl font-bold text-primary">
            Brova
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm mr-2 text-foreground">
              Duration: {duration}
            </span>

            <button
              type="button"
              aria-label="Settings"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <SettingsIcon />
            </button>

            <button
              type="button"
              aria-label="Help"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <CircleQuestionMarkIcon />
            </button>

            <Button
              variant={"destructive"}
              type="button"
              aria-label="end interview"
              className="rounded-md bg-destructive/10! border-destructive/40 px-3 py-2 text-sm font-medium text-destructive! hover:opacity-70 transition"
            >
              End Interview
            </Button>
          </div>
        </div>
      </nav>

      <div>{children}</div>
    </>
  );
}
