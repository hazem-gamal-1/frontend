import LandingNavbar from "@/app/LandingNavbar";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Globe,
  Sparkles,
  Video,
  Earth,
} from "lucide-react";

const stats = [
  { value: "500K+", label: "interviews", icon: Video },
  { value: "94%", label: "success rate", icon: BadgeCheck },
  { value: "60%", label: "time saved", icon: Clock3 },
  { value: "120", label: "countries", icon: Globe },
] as const;

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Candidate Prep", href: "#" },
      { label: "Enterprise Hiring", href: "#" },
      { label: "Mock Interviews", href: "#" },
      { label: "AI Feedback", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
] as const;

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-secondary/80 blur-3xl" />
      </div>

      <LandingNavbar />

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>New: AI Video Analysis 2.0</span>
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Master Your
                <br />
                <span className="text-primary">Next Interview</span>
                <br />
                with AI
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Experience the future of hiring. Personalized realistic practice
                for candidates and lightning-fast automated screening for modern
                companies.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
<<<<<<< HEAD
                  href="/interviewSetup"
=======
                  href="/auth/sign-up"
>>>>>>> d0a831756d196fa618c9648c7b1249d9f73ce17a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Start Practicing
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/signup?role=company"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Hire with AI
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />

                <div className="relative aspect-4/3 rounded-2xl border border-dashed border-border bg-muted/30">
                  <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Product Preview
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Image placeholder
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-6 top-6 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="text-xs text-muted-foreground">
                    AI interview score
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    94% ready
                  </p>
                </div>

                <div className="absolute bottom-6 right-6 max-w-56 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="text-xs text-muted-foreground">Live feedback</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Body language • Tone • Content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-12 lg:pb-24">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-4 text-3xl font-bold tracking-tight">
                  {value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-2 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary">
                Brova
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Building the bridge between talent and opportunity through
                advanced artificial intelligence.
              </p>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 Brova Inc. All rights reserved.
            </p>

            <div className="inline-flex w-fit items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Earth size={16} />
              English (US)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
