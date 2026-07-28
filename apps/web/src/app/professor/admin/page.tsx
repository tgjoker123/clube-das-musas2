import Link from "next/link";
import { IconBadge, Icon, ICONS } from "@/components/empty-state";

const SECOES = [
  {
    href: "/professor/admin/professores",
    titulo: "Professores",
    descricao: "Cadastrar personal trainers na plataforma e definir a comissão de cada um.",
    icone: ICONS.pessoa,
  },
  {
    href: "/professor/admin/parceiros",
    titulo: "Parceiros",
    descricao: "Empresas e profissionais parceiros do marketplace.",
    icone: ICONS.loja,
  },
  {
    href: "/professor/admin/marketplace",
    titulo: "Marketplace",
    descricao: "Itens e serviços oferecidos pelos parceiros.",
    icone: ICONS.estrela,
  },
  {
    href: "/professor/admin/planos",
    titulo: "Preços e assinaturas",
    descricao: "Planos de assinatura disponíveis para as alunas.",
    icone: ICONS.moeda,
  },
  {
    href: "/professor/admin/faturamento",
    titulo: "Faturamento",
    descricao: "Visão geral do faturamento da plataforma e percentuais de comissão.",
    icone: ICONS.evolucao,
  },
];

export default function AjustesPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Ajustes</h1>
        <p className="page-subtitle">Painel do Administrador do SaaS.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECOES.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className={`app-card animate-fade-in-up stagger-${Math.min(i + 1, 4)} flex items-start gap-3 transition-shadow hover:shadow-md`}
          >
            <IconBadge>
              <Icon path={s.icone} />
            </IconBadge>
            <div>
              <h2 className="app-h2">{s.titulo}</h2>
              <p className="mt-1 text-sm text-neutral-500">{s.descricao}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
