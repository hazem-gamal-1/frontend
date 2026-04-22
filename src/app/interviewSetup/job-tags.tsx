"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { SUGGESTIONS } from "@/interview-configurator";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";

export const JobTags = ({
  value,
  setValue,
}: {
  value: string[];
  setValue: (tags: string[]) => void;
}) => {
  const [tags, setTags] = useState<string[]>(value);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s),
  );

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setValue([...tags, t]);
    setInput("");
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    const t = tags.filter((tg) => tg !== tag);
    setTags(t);
    setValue(t);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <InputGroup className="bg-card! min-h-11.5 h-fit rounded-xl ring-1! ring-muted transition-all duration-400 border-muted px-1">
        <InputGroupAddon className=" flex-1 flex flex-wrap gap-y-1 justify-start pt-2">
          <Search className="size-4 text-muted-foreground shrink-0" />
          {tags.map((t, i) => (
            <p
              key={i}
              className="flex animate-scale-in animation-duration-800 [animation-timing-function:var(--ease-elastic)] justify-center items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-center text-xs font-medium"
            >
              {t}
              <Button
                variant={null}
                aria-label="cancel"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(t);
                }}
                className="py-0.5 px-0 h-fit transition-colors cursor-pointer hover:text-red-500"
              >
                <X className="size-3" />
              </Button>
            </p>
          ))}
          <InputGroupInput
            ref={inputRef}
            onKeyDown={onKey}
            className="font-normal text-foreground placeholder:text-muted-foreground/60 min-w-30"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              tags.length === 0
                ? "e.g. React, System Design, Python…"
                : "Add more…"
            }
          />
        </InputGroupAddon>
        <InputGroupAddon align={"inline-end"}>
          {input.trim() && (
            <button
              aria-label="add"
              type="button"
              onClick={() => addTag(input)}
              className="transition-colors cursor-pointer shrink-0 text-muted-foreground hover:text-primary"
            >
              <Plus className="size-4" />
            </button>
          )}
        </InputGroupAddon>
      </InputGroup>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex flex-wrap gap-2 px-1 pt-1"
        >
          {(input ? filtered : SUGGESTIONS.filter((s) => !tags.includes(s)))
            .slice(0, 7)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between gap-5 mt-5! flex-wrap">
        <p className="p-1 text-sm text-muted-foreground/60 flex items-center gap-1">
          <Kbd className="border border-border bg-muted text-[10px] font-mono">
            <span className="pt-0.5">Enter</span>
          </Kbd>
          or{" "}
          <Kbd className=" border border-border bg-muted text-[10px] font-mono">
            <span className="pt-0.5">,</span>
          </Kbd>
          to add a tag
        </p>
        <p className="px-1 text-sm text-muted-foreground/60 flex items-center gap-1">
          <Kbd className="border border-border bg-muted text-[10px] font-mono">
            <span className="pt-0.5">⌫</span>
          </Kbd>
          to remove a tag
        </p>
      </div>
    </div>
  );
};
