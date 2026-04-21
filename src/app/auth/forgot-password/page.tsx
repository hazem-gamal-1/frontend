"use client";

import { useState, useEffect, SubmitEvent } from "react";
import Link from "next/link";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import { Check, Loader2Icon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn_Schema } from "../schemas/signIn-Schema";
import { toast } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const emailSchema = signIn_Schema.pick({ email: true });

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsPending(true);
      const form = e.currentTarget;

      const emailValue = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const zodEmail = emailSchema.safeParse({ email: emailValue });

      if (!zodEmail.success) {
        zodEmail.error.issues.forEach((err) => toast.error(err.message));
        return;
      }

      setEmail(emailValue);
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_BACKEND_URL + "/api/Auth/forget-password",
        {
          method: "POST",
          body: JSON.stringify({ email: emailValue }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        toast.error(response.statusText);
        return;
      }
      form.reset();
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main
      className={`${cormorant.variable} ${dmMono.variable} min-h-screen bg-background text-foreground flex items-center justify-center p-6`}
    >
      <div className="w-full max-w-md">
        {!submitted ? (
          <div className={`transition-all duration-700 animate-scale-in`}>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="mx-auto mb-6 flex w-fit p-4 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="size-10" />
              </div>

              <h1 className="font-cormorant text-4xl font-light tracking-tight">
                Forgot your{" "}
                <span className="italic text-primary">password?</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We&apos;ll send a password reset link to your inbox
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="py-5! focus-visible:ring-2!"
                />
              </div>

              <Button
                variant={"default"}
                type="submit"
                disabled={isPending}
                className="w-full active:scale-97 flex items-center justify-center gap-2 px-6! py-4! text-primary-foreground transition-all hover:bg-primary/80"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <p className="text-2xl">←</p> Back to login
              </Link>
            </div>
          </div>
        ) : (
          /* Success State */
          <div
            className={`text-center transition-all duration-700 ${
              true ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card">
              <Check className="size-10 opacity-0 stroke-[3px] text-primary animate-scale-in fill-mode-forwards [animation-delay:300ms] animation-duration-[1000ms] ease-elastic!" />
            </div>

            <h2 className="font-cormorant text-3xl font-light tracking-tight">
              Check your <span className="italic text-primary">inbox</span>
            </h2>

            <p className="mt-4 text-sm text-muted-foreground">
              Reset link sent to{" "}
              <span className="font-medium tracking-wider text-foreground/90">
                {email}
              </span>
            </p>

            <Button
              variant={null}
              onClick={() => setSubmitted(false)}
              className="mt-8 text-sm text-primary hover:underline"
            >
              Try a different email
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
