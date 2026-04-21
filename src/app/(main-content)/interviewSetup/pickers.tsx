import { RadioCardsGroup } from "@/components/RadioCardsGroup";
import {
  INTERVIEW_GENDER,
  INTERVIEW_LANGUAGE,
  INTERVIEW_PERSONALITY,
} from "@/interview-configurator";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const GenderPicker = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <RadioCardsGroup
      defaultValue={value}
      name="gender"
      radioBtnIcon={
        <CheckCircle2 className="-mt-1 size-4 text-primary scale-0 group-has-data-[state=checked]:scale-100 transition duration-1000 ease-elastic" />
      }
      onValueChange={setValue}
      className="flex gap-4"
      cardsAttributes={{
        className: "rounded-xl! py-3 px-4",
        content: INTERVIEW_GENDER.map(({ label: title, src, value }) => ({
          value,
          title: (
            <div className="flex flex-col w-full justify-center items-center gap-2">
              <Image
                src={src}
                alt={title}
                className="scale-100  opacity-70 group-has-data-[state=checked]:opacity-100 transition-all pb-1 duration-1000 group-has-data-[state=checked]:scale-108
                ease-elastic"
              />
              {title}
            </div>
          ),
        })),
      }}
    />
  );
};

export const LanguagePicker = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <RadioCardsGroup
      defaultValue={value}
      name="language"
      onValueChange={setValue}
      className="flex gap-3 justify-center "
      cardsAttributes={{
        className: " px-1.5 flex flex-row justify-between",
        content: INTERVIEW_LANGUAGE.map(
          ({ value, label: title, Icon, sub }) => ({
            value,
            title: (
              <div className="flex gap-1 justify-center items-center">
                <Icon className="size-4" />
                {title}
              </div>
            ),
            desc: (
              <p
                className={cn(
                  "ml-auto text-[11px] font-bold tracking-wider px-1.5 py-0.5 rounded-md",
                  "bg-muted text-muted-foreground",
                  "group-has-data-[state=checked]:bg-primary/10! group-has-data-[state=checked]:text-primary",
                )}
              >
                {sub}
              </p>
            ),
          }),
        ),
      }}
    />
  );
};

export const PersonalityPicker = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <RadioCardsGroup
      defaultValue={value}
      name="personality"
      radioBtnIcon={
        <CheckCircle2 className="-mt-1 size-4 text-primary scale-0 group-has-data-[state=checked]:scale-100 transition duration-1000 ease-elastic" />
      }
      onValueChange={setValue}
      className=" flex flex-wrap sm:grid sm:grid-cols-2 "
      cardsAttributes={{
        className: "rounded-xl! px-1.5 flex-row ",
        content: INTERVIEW_PERSONALITY.map(
          ({ value, label: title, Icon, desc }) => ({
            value,
            title: (
              <div
                className={cn(
                  " flex flex-col gap-1 justify-between w-full items-start tracking-wider px-1.5 py-0.5 rounded-md",
                  " text-xs text-muted-foreground leading-tight mt-0.5",
                )}
              >
                <p className="flex items-center gap-1 font-semibold text-sm group-has-data-[state=checked]:text-primary">
                  <Icon className="size-4 shrink-0" />
                  {title}
                </p>
                <p className="font-normal ">{desc}</p>
              </div>
            ),
          }),
        ),
      }}
    />
  );
};
