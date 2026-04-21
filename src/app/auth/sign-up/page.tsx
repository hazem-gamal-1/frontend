"use client";
import { RadioCardsGroup } from "@/components/RadioCardsGroup";
import {
  Building2Icon,
  CheckCircle2,
  User2,
  AlertCircle,
  Loader2,
  GiftIcon,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SignupFormValues, signUp_Schema } from "../schemas/signUp-Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { InputPassword_showToggle } from "../InputPassword";

const USER_TYPE = [
  {
    value: "candidate",
    title: "Candidate",
    Icon: User2,
    desc: "Train smarter with AI interviews",
    heavyDescription:
      "Master your next interview with real-time AI feedback. Practice realistic scenarios, polish your answers, and build the confidence you need to land your dream job faster.",
  },
  {
    value: "company",
    title: "Company",
    Icon: Building2Icon,
    desc: "Hiring made effortless",
    heavyDescription:
      "Stop wasting time on manual screening. Our AI conducts initial interviews at scale, identifying top talent instantly so you can focus on hiring the right people.",
  },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle className="size-3.5 text-red-400 mt-px shrink-0" />
      <p className="text-xs text-red-400 leading-snug">{message}</p>
    </div>
  );
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signUp_Schema),
    defaultValues: {
      userType: "candidate",
      acceptTerms: false,
    },
  });

  const userType = useWatch({ control, name: "userType" });
  const selectedUser = USER_TYPE.find((u) => u.value === userType);

  const [isPendingTransition, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (values: SignupFormValues) => {
    const { acceptTerms, userType, ...data } = values;
    console.log(data);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_BACKEND_URL + "/api/Auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        },
      );
      // note : fetch doesn't throw on error status codes — if your API returns a 400 or 500, the catch block never runs. You need to check response.ok manually
      const result = await response.json();
      if (!response.ok) {
        console.log(response)
        toast.error(result.message ?? "Something went wrong.");
        return;
      } else {
        startTransition(() => router.push("/auth/sign-in"));
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none fixed -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -top-24 -right-24 h-80 w-80 rounded-full bg-secondary/80 blur-3xl" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row"
      >
        <div className="flex flex-col lg:mb-20 justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:py-20 lg:pr-16">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Create Your Account
          </h1>
          <p className="mt-3 text-muted-foreground">
            Join the future of AI-driven interviewing
          </p>

          <fieldset className="mt-10 space-y-3">
            <legend className="text-sm font-medium">
              I&apos;m signing up as
            </legend>
            <RadioCardsGroup
              className="grid grid-cols-2 gap-3"
              radioBtnIcon={<CheckCircle2 />}
              defaultValue={userType}
              onValueChange={(v) =>
                setValue("userType", v as SignupFormValues["userType"], {
                  shouldValidate: true,
                })
              }
              cardsAttributes={{
                className: "flex justify-center py-4 items-center",
                content: USER_TYPE.map(({ value, desc, Icon, title }) => ({
                  value,
                  desc: <div className="text-center">{desc}</div>,
                  title: (
                    <div className="flex flex-col w-full items-center gap-2">
                      <Icon className="size-16 stroke-1" />
                      {title}
                    </div>
                  ),
                })),
              }}
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedUser?.heavyDescription}
            </p>
          </fieldset>
        </div>

        <div className="flex flex-col justify-center px-6 pb-12 sm:px-10 lg:w-1/2 lg:py-10 lg:pl-16 lg:border-l lg:border-border">
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GiftIcon className="size-4" />
              GitHub
            </button>
          </div>

          <span className="flex items-center my-4">
            <span className="h-px flex-1 bg-secondary"></span>
            <span className="shrink-0 text-sm tracking-[0.2em] text-muted-foreground uppercase px-4">
              Or continue with email
            </span>
            <span className="h-px flex-1 bg-secondary"></span>
          </span>

          <div className=" space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  {...register("firstName")}
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="John"
                  aria-invalid={!!errors.firstName}
                  className={cn(
                    `flex h-11 w-full rounded-lg border bg-input px-3 text-sm placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                    errors.firstName
                      ? " ring-1! focus-visible:ring-3! bg-red-500/5!"
                      : "border-border",
                  )}
                />
                <FieldError message={errors.firstName?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  {...register("lastName")}
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  aria-invalid={!!errors.lastName}
                  className={cn(
                    `flex h-11 w-full rounded-lg border bg-input px-3 text-sm placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                    errors.lastName
                      ? " ring-1! focus-visible:ring-3! bg-red-500/5!"
                      : "border-border",
                  )}
                />
                <FieldError message={errors.lastName?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={!!errors.email}
                className={cn(
                  `flex h-11 w-full rounded-lg border bg-input px-3 text-sm placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                  errors.email
                    ? " ring-1! focus-visible:ring-3! bg-red-500/5!"
                    : "border-border",
                )}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <InputPassword_showToggle
                {...register("password")}
                id="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                aria-invalid={!!errors.password}
                className={cn(
                  `flex h-11 w-full rounded-lg border tracking-wider text-sm placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                  errors.password
                    ? " ring-1! focus-within:ring-3! border-destructive/50! bg-red-500/5!"
                    : "border-border!",
                )}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input
                {...register("phone")}
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!errors.phone}
                className={cn(
                  `flex h-11 w-full rounded-lg border bg-input px-3 text-sm placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                  errors.phone
                    ? "border-red-500/60 ring-1! focus-visible:ring-3! focus-visible:ring-red-500/30 bg-red-500/5!"
                    : "border-border",
                )}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <div>
              <Label className="flex items-start gap-3 cursor-pointer group">
                <Input
                  {...register("acceptTerms")}
                  id="acceptTerms"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border bg-input accent-primary cursor-pointer"
                />
                <span className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </Label>
              <FieldError message={errors.acceptTerms?.message} />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isPendingTransition}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating your account…
                </>
              ) : isPendingTransition ? (
                <>Redirecting, please wait...</>
              ) : (
                "Create account"
              )}
            </Button>
          </div>

          <p className="mt-6 ml-auto text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
