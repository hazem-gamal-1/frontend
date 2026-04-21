import MaxContainerWrapper_Section from "@/components/maxContainerWrapper_Section";
import { FadeIn } from "../../../../motion-Wrappers/fade-in";
import { Sparkles } from "lucide-react";
import { BRAND_STATS } from "./contents";
import { StaggerItem } from "../../../../motion-Wrappers/stagger-items";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Ambient background glow */}
      <div className="absolute -z-10 right-0 top-0 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[500px] blur-[80px] lg:blur-[130px] bg-gradient-to-tr from-[#D7BAFF]/10 to-transparent pointer-events-none" />
      <div className="absolute -z-10 left-0 bottom-0 w-[250px] sm:w-[300px] lg:w-[400px] h-[250px] sm:h-[300px] lg:h-[400px] blur-[70px] lg:blur-[120px] bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <MaxContainerWrapper_Section className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12 xl:gap-20 mt-10 lg:mt-0 pb-12 lg:pb-0">
        <FadeIn
          direction="up"
          className="flex flex-col  gap-6 sm:gap-8 shrink lg:pt-4 lg:sticky lg:top-24 self-start"
        >
          <div className="inline-flex">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 uppercase text-[10px] sm:text-xs font-semibold tracking-wider border rounded-full text-orange-600 border-orange-300 bg-orange-50 dark:text-[#ffb784] dark:border-[#593f3c] dark:bg-[#2f202a]">
              <Sparkles className="size-3" />
              Configuration Phase
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl w-fit sm:text-3xl md:text-4xl lg:text-[56px] xl:text-[68px] leading-tight lg:leading-[0.92] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-primary">
              Refine Your
              <br />
              Experience.
            </h2>

            <p className="text-sm sm:text-base text-secondary-foreground/70 leading-relaxed max-w-md">
              Tailor the AI to mirror your industry&apos;s standards. Each
              selection recalibrates the analytical engine for high-stakes
              evaluation.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {BRAND_STATS.map(({ value, label }, i) => (
              <StaggerItem
                key={i}
                index={i}
                className="flex items-center gap-3"
              >
                <span className="flex items-center justify-center size-1.5 rounded-full bg-primary/60 shrink-0" />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </FadeIn>

        <div className="flex-1 w-full ">{children}</div>
      </MaxContainerWrapper_Section>
    </div>
  );
}
