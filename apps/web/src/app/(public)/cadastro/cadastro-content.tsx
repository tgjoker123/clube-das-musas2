"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RoleSelection } from "./role-selection";
import { SignupForm } from "./signup-form";
import { InviteForm } from "./invite-form";

export function CadastroContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("convite");
  const perfil = searchParams.get("perfil");

  if (token) {
    return (
      <AuthShell title="Ativar minha conta">
        <InviteForm token={token} />
      </AuthShell>
    );
  }

  if (perfil === "professor" || perfil === "parceiro") {
    return (
      <AuthShell
        title={perfil === "professor" ? "Cadastro — Professora/Professor" : "Cadastro — Parceiro"}
        footer={
          <>
            Já tem conta?{" "}
            <Link href="/login" className="text-accent-gold hover:underline">
              Entrar
            </Link>
          </>
        }
      >
        <SignupForm role={perfil} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Junte-se ao Clube"
      subtitle="Escolha como você faz parte."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="text-accent-gold hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <RoleSelection />
    </AuthShell>
  );
}
