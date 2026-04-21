import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";
import ClickAnimation from "../../motion-Wrappers/clickAnimation";

export type Cards = {
  value: string;
  title?: string | ReactNode;
  desc?: string | ReactNode;
};

export function RadioCardsGroup({
  radioBtnIcon,
  cardsAttributes: { className: cardClassName, content: cardContent },
  ...containerProps
}: ComponentProps<typeof RadioGroup> & {
  cardsAttributes: {
    className?: string;
    content: Cards[];
  };
  radioBtnIcon?: ReactNode;
}) {
  return (
    <RadioGroup {...containerProps}>
      {cardContent.map((c) => (
        <ClickAnimation key={c.value} className="flex-1">
          <FieldLabel
            htmlFor={c.value}
            className={cn(
              "group h-full rounded-xl text-muted-foreground hover:bg-primary/2 has-data-[state=checked]:text-primary ring-primary has-data-[state=checked]:ring-primary/80 hover:ring-[0.2px] dark:has-data-[state=checked]:ring-primary/40 transition has-data-[state=checked]:scale-100 has-data-[state=checked]:ring-1 has-data-[state=checked]:bg-primary/25 dark:has-data-[state=checked]:bg-primary/5 bg-card",
            )}
          >
            <Field>
              <FieldContent className={cn("gap-2", cardClassName)}>
                <FieldTitle
                  className={cn(
                    "font-semibold w-full tracking-wide capitalize",
                  )}
                >
                  {c.title}
                </FieldTitle>
                {c.desc && <FieldDescription>{c.desc}</FieldDescription>}
                {radioBtnIcon && (
                  <div className="absolute top-3 right-3 opacity-0 scale-75 transition-all duration-300 group-has-data-[state=checked]:opacity-100 group-has-data-[state=checked]:scale-100">
                    {radioBtnIcon}
                  </div>
                )}
              </FieldContent>
              <RadioGroupItem
                value={c.value}
                id={c.value}
                className="hidden peer"
              />
            </Field>
          </FieldLabel>
        </ClickAnimation>
      ))}
    </RadioGroup>
  );
}
