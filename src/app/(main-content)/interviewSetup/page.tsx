"use client";

import { useRouter } from "next/navigation";
import { Stepper } from "./stepper";
import { useState, useTransition } from "react";
import { STEPS } from "./contents";
import { FadeIn } from "../../../../motion-Wrappers/fade-in";
import { AnimatePresence, motion } from "framer-motion";
import ClientDropzone from "@/components/client-dropzone";
import { GenderPicker, LanguagePicker, PersonalityPicker } from "./pickers";
import { JobTags } from "./job-tags";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import {
  INTERVIEW_GENDER,
  INTERVIEW_LANGUAGE,
  INTERVIEW_PERSONALITY,
} from "@/interview-configurator";

export default function InterviewSetup() {
  const router = useRouter();
  const [isLoadingTransition, startTransition] = useTransition();
  const [stepCounter, setStepCounter] = useState(1);
  const [direction, setDir] = useState(1);
  const [formValues, setFormValues] = useState<{
    language: string;
    gender: string;
    personality: string;
    job_description: string[];
    cv: File | null;
  }>({
    cv: null,
    language: INTERVIEW_LANGUAGE[0].value,
    gender: INTERVIEW_GENDER[0].value,
    personality: INTERVIEW_PERSONALITY[0].value,
    job_description: [],
  });

  const goNext = () => {
    setDir(1);
    setStepCounter((s) => s + 1);
  };
  const goBack = () => {
    setDir(-1);
    setStepCounter((s) => s - 1);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_AI_URL}/interview/setup`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        return { data, language: formData.get("language") };
      });
    },
    onSuccess: (data) => {
      startTransition(() =>
        router.push(
          `/interview?sessionId=${data.data.session_id}&lang=${data.language}`,
        ),
      );
    },
    onError: () => toast.error("Something went wrong."),
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (!formValues.cv) {
      toast.error("Please upload your CV first!");
      return;
    }
    formData.append("cv", formValues.cv);
    formData.append("language", formValues.language);
    formData.append("gender", formValues.gender);
    formData.append("interviewer_personality", formValues.personality);
    formData.append("job_description", formValues.job_description.join(","));

    mutate(formData);
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
  };

  const stepDetails = STEPS[stepCounter - 1];

  return (
    <FadeIn direction="up" delay={0.1} className="mt-7">
      <Stepper currentStep={stepCounter} />
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepCounter}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-6 md:p-8 flex flex-col gap-6 min-h-95 w-full"
          >
            <div className="overflow-hidden w-full border shadow-sm rounded-2xl border-border/60 bg-card/40 backdrop-blur-sm">
              <div className="p-6 pb-3 md:pt-8 md:px-8 flex flex-col gap-6 min-h-[380px]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground">
                    <stepDetails.Icon className="size-4" />
                    <span>
                      Step {stepCounter} / {STEPS.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{stepDetails.label}</h3>
                  <p className="text-sm text-secondary-foreground/70">
                    {stepDetails.description}
                  </p>
                </div>

                {stepCounter === 1 && (
                  <div className="flex-1">
                    <ClientDropzone
                      value={formValues.cv}
                      setValue={(file) =>
                        setFormValues({ ...formValues, cv: file })
                      }
                    />
                  </div>
                )}
                {stepCounter === 2 && (
                  <div className="flex flex-col flex-1 gap-7">
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Interview Language
                      </p>
                      <LanguagePicker
                        value={formValues.language}
                        setValue={(val) =>
                          setFormValues({ ...formValues, language: val })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Interviewer Gender
                      </p>
                      <GenderPicker
                        value={formValues.gender}
                        setValue={(val) =>
                          setFormValues({ ...formValues, gender: val })
                        }
                      />
                    </div>
                  </div>
                )}
                {stepCounter === 3 && (
                  <div className="flex flex-col flex-1 gap-7">
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Interviewer Personality
                      </p>
                      <PersonalityPicker
                        value={formValues.personality}
                        setValue={(val) =>
                          setFormValues({ ...formValues, personality: val })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Job / Skills
                      </p>
                      <JobTags
                        value={formValues.job_description}
                        setValue={(val) =>
                          setFormValues({
                            ...formValues,
                            job_description: val,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t md:px-8 border-border/40 bg-card/20">
                {stepCounter > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5 cursor-pointer"
                    onClick={() => goBack()}
                  >
                    <ChevronLeftIcon className="size-4" />
                    Back
                  </Button>
                ) : null}

                {isPending || isLoadingTransition ? (
                  <Button
                    disabled={isPending || isLoadingTransition}
                    type="button"
                    variant={null}
                    className="bg-linear-to-br ml-auto cursor-pointer text-[16px] py-5! from-pink-500/10 dark:from-white/10 via-15% via-pink-500/50 to-80% to-primary dark:to-primary/40 text-white gap-1.5"
                  >
                    {isPending && (
                      <Loader2 className="text-white animate-spin size-4" />
                    )}
                    {isLoadingTransition && <p>Redirecting...</p>}
                  </Button>
                ) : (
                  <Button
                    type={stepCounter < STEPS.length ? "button" : "submit"}
                    variant={null}
                    className="bg-linear-to-br ml-auto cursor-pointer text-[16px] py-5! from-pink-500/10 dark:from-white/10 via-15% via-pink-500/50 to-80% to-primary dark:to-primary/40 text-white gap-1.5"
                    onClick={() =>
                      stepCounter < STEPS.length ? goNext() : null
                    }
                  >
                    {stepCounter < STEPS.length ? (
                      <ChevronRightIcon className="size-4" />
                    ) : (
                      <p>Start Interview</p>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </FadeIn>
  );
}
