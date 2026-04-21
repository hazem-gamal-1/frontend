import Link from "next/link";
import { ThemeSwitch } from "../components/ThemeSwitch";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-4 z-50 mb-8">
      <div className="mx-auto max-w-7xl bg-card/80 backdrop-blur-md flex items-center justify-between px-6 py-3 border border-border rounded-xl">
        <Link href="/" className="text-xl font-bold text-primary shrink-0">
          Brova
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            className="text-sm text-muted-foreground hover:text-foreground transition"
            href="/candidates"
          >
            Candidates
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground transition"
            href="/companies"
          >
            Companies
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground transition"
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground transition"
            href="/resources"
          >
            Resources
          </Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeSwitch />
          <Link
            href="/auth/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
