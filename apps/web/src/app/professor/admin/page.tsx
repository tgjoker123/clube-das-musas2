import Link from "next/link";

const SECOES = [
  {
    href: "/professor/admin/professores",
    titulo: "Professores",
    descricao: "Cadastrar personal trainers na plataforma e definir a comissão de cada um.",
  },
  {
    href: "/professor/admin/parceiros",
    titulo: "Parceiros",
    descricao: "Empresas e profissionais parceiros do marketplace.",
  },
  {
    href: "/professor/admin/marketplace",
    titulo: "Marketplace",
    descricao: "Itens e serviços oferecidos pelos parceiros.",
  },
  {
    href: "/professor/admin/planos",
    titulo: "Preços e assinaturas",
    descricao: "Planos de assinatura disponíveis para as alunas.",
  },
  {
    href: "/professor/admin/faturamento",
    titulo: "Faturamento",
    descricao: "Visão geral do faturamento da plataforma e percentuais de comissão.",
  },
];

export default function AjustesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Ajustes</h1>
        <p className="text-sm text-neutral-500">Painel do Administrador do SaaS.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECOES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="app-card block transition-shadow hover:shadow-md"
          >
            <h2 className="app-h2">{s.titulo}</h2>
            <p className="mt-1 text-sm text-neutral-500">{s.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
