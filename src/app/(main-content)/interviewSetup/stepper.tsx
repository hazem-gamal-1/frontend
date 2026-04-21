import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { STEPS } from "./contents";

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="max-w-142 px-8 sm:px-0 mx-auto relative flex flex-col items-center ">
      <div className="flex items-center w-full">
        {STEPS.map((step, idx) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="relative pb-6 ">
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full text-xs font-bold border transition-all duration-300",
                    active && "ring-4 ring-primary/15",
                    done
                      ? "bg-primary border-primary text-white"
                      : active
                        ? "bg-card border-primary text-primary"
                        : "bg-card border-border text-muted-foreground",
                  )}
                >
                  {done ? <CheckCircle2 className="size-4" /> : step.id}
                </div>
                <p
                  className={cn(
                    "absolute text-nowrap text-xs sm:text-sm -bottom-2 left-1/2 -translate-x-1/2",
                  )}
                >
                  {step.label}
                </p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="relative -translate-y-2 flex-1 h-px mx-1 overflow-hidden bg-border">
                  <div
                    className={cn(
                      "absolute inset-0 origin-left bg-primary transition-transform duration-500",
                      step.id == currentStep - 1 ? "scale-x-100" : "scale-x-0",
                      step.id < currentStep - 1 && "scale-x-100 duration-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
