import { Suspense } from "react";
import { AlunaActivation } from "./activation";

export default function OnboardingAlunaPage() {
  return (
    <Suspense>
      <AlunaActivation />
    </Suspense>
  );
}
