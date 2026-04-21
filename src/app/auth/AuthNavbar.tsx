import Link from "next/link";

export default function AuthLayout() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="text-2xl font-bold text-primary">
          Brova
        </Link>
        <div className="hidden sm:flex gap-8">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
