import { Suspense } from "react";
import { Robot } from "./Robot";

export default function Model() {
  return (
    <Suspense fallback={null}>
      <Robot />
    </Suspense>
  );
}