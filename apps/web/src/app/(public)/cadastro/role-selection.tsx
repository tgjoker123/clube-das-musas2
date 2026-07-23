import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@musas/ui";

const roles = [
  {
    label: "Sou professora ou professor",
    description: "Crie sua conta e comece a gerenciar suas alunas hoje mesmo.",
    href: "/cadastro?perfil=professor",
  },
  {
    label: "Sou parceiro",
    description: "Cadastre sua marca para futuramente vender no Marketplace do Clube.",
    href: "/cadastro?perfil=parceiro",
  },
];

export function RoleSelection() {
  return (
    <div className="flex flex-col gap-4">
      {roles.map((role) => (
        <Link key={role.href} href={role.href}>
          <Card className="hover:border-accent-gold transition-colors">
            <CardTitle>{role.label}</CardTitle>
            <CardDescription className="mt-1">{role.description}</CardDescription>
          </Card>
        </Link>
      ))}

      <Card className="bg-bg-base">
        <CardTitle>Sou aluna</CardTitle>
        <CardDescription className="mt-1">
          O acesso é feito por convite do seu professor — peça a ele(a) o link de ativação da sua
          conta.
        </CardDescription>
      </Card>
    </div>
  );
}
