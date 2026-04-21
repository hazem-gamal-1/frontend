import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

export default function MaxContainerWrapper_Section({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      {...props}
      className={cn("max-w-7xl mr-auto px-4 md:px-7 md:mx-auto", className)}
    >
      {children}
    </section>
  );
}
