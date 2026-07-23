/**
 * Nomes das variáveis de sessão Postgres usadas pelas políticas de RLS
 * (definidas em prisma/migrations/20260723020000_init_identity_and_auth/
 * migration.sql). Único ponto de verdade para esses nomes — nunca usar a
 * string literal diretamente em `SET LOCAL` fora daqui (ver
 * docs/00_ARQUITETURA.md §6.2 e docs/04_MODELO_DE_DADOS.md §2).
 */
export const RLS_SESSION_VARS = {
  /** sub do JWT do Supabase Auth — disponível assim que o token é validado. */
  authUserId: "app.current_auth_user_id",
  /** users.id interno — nulo até a linha existir (durante o cadastro). */
  userId: "app.current_user_id",
  /** users.role resolvido. */
  role: "app.current_role",
  /** professors.id do professor autenticado, ou dono da aluna autenticada. */
  professorId: "app.current_professor_id",
} as const;
