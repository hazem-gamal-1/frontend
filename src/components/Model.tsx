import { Suspense } from "react";
import { Robot, RobotPhase } from "./Robot";

type ModelProps = {
  phase?: RobotPhase;
  avatarText?: string;
};

export default function Model({ phase, avatarText }: ModelProps) {
  return (
    <Suspense fallback={null}>
      <Robot phase={phase} avatarText={avatarText} />
    </Suspense>
  );
}