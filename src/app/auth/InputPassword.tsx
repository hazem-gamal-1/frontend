"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ComponentPropsWithRef, useState } from "react";
import { cn } from "@/lib/utils";

export function InputPassword_showToggle({
  className,
  ...props
}: { className?: string } & ComponentPropsWithRef<typeof InputGroupInput>) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <InputGroup className={cn(" pl-0.5! overflow-hidden", className)}>
        <InputGroupInput
          placeholder="Enter password"
          {...props}
          type={showPassword ? "text" : "password"}
        />
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
}
