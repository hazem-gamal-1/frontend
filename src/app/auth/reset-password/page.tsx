"use client";

import { ArrowLeft, CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputPassword_showToggle } from "../InputPassword";
import Link from "next/link";
import { resetPassword_Schema } from "../schemas/resetPassword-Schema";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const [isTransition, startTransition] = useTransition();

  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsPending(true);

    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirm = (
      form.elements.namedItem("confirm-password") as HTMLInputElement
    ).value;

    const zodResult = resetPassword_Schema.safeParse({ password, confirm });
    if (!zodResult.success) {
      zodResult.error.issues.forEach((err) => toast.error(err.message));
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_BACKEND_URL + "/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code,
            password: zodResult.data.password,
          }),
        },
      );
      console.log(res);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      startTransition(() => router.push("/auth/sign-in"));
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted">
              <KeyRound className="h-5 w-5 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create new password
            </CardTitle>
            <CardDescription>
              Your new password must be different from any previously used
              passwords.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <InputPassword_showToggle id="password" name="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <InputPassword_showToggle
                  id="confirm"
                  name="confirm-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full overflow-hidden"
                disabled={isPending || isTransition}
              >
                {isPending ? (
                  "Resetting..."
                ) : isTransition ? (
                  <div className="animate-in flex justify-center items-center gap-1.5 slide-in-from-bottom-[30px] animation-duration-[1000ms]">
                    <span className="overflow-hidden inline-flex delay-300 fill-mode-both animate-in fade-in-0 animation-duration-initial-[100ms]">
                      <CheckCircle className="size-4.5 delay-300 fill-mode-forwards text-green-400 animate-in slide-in-from-right-[40px] animation-duration-[1000ms]" />
                    </span>
                    Reset successful
                  </div>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
