import { Suspense } from "react";
import { CadastroContent } from "./cadastro-content";

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroContent />
    </Suspense>
  );
}
