# AUTENTICAÇÃO E SEGURANÇA

## OBJETIVO

A segurança é o pilar mais importante da plataforma.

Nenhuma funcionalidade poderá comprometer a privacidade ou integridade dos dados.

Este sistema armazenará dados pessoais, dados de saúde e informações financeiras, portanto todas as decisões devem seguir o princípio de "Security First".

---

# AUTENTICAÇÃO

Utilizar Supabase Auth.

Permitir:

- Login por e-mail e senha.
- Recuperação de senha.
- Confirmação de e-mail.
- Renovação automática de sessão.
- Logout seguro.

Nunca armazenar senhas.

Nunca criar autenticação própria.

Sempre utilizar os mecanismos oficiais do Supabase.

---

# AUTORIZAÇÃO

Todo usuário deverá possuir um perfil.

Perfis:

- Admin
- Professor
- Aluna
- Parceiro

Cada rota deverá validar obrigatoriamente:

- usuário autenticado;
- perfil correto;
- vínculo com os dados acessados.

Nunca confiar apenas no frontend.

---

# ROW LEVEL SECURITY (RLS)

Todas as tabelas do Supabase deverão utilizar políticas RLS.

Objetivos:

- Um professor nunca poderá visualizar dados de outro professor.
- Uma aluna nunca poderá visualizar dados de outra aluna.
- Um parceiro nunca poderá visualizar pedidos de outro parceiro.
- O Admin poderá acessar todas as informações respeitando as regras da plataforma.

Nenhuma tabela deverá ficar sem política de segurança.

---

# PROTEÇÃO CONTRA ATAQUES

Implementar obrigatoriamente proteção contra:

- SQL Injection
- XSS
- CSRF
- Clickjacking
- Força Bruta
- Enumeração de usuários
- Upload malicioso
- Flood de requisições

---

# UPLOAD DE ARQUIVOS

Todo upload deverá validar:

- tipo do arquivo;
- tamanho máximo;
- extensão;
- conteúdo quando possível.

Permitir apenas formatos seguros.

Nunca executar arquivos enviados pelo usuário.

---

# DADOS SENSÍVEIS

São considerados dados sensíveis:

- anamnese;
- exames;
- fotos de evolução;
- documentos;
- informações financeiras.

Esses dados devem possuir proteção reforçada.

---

# AUDITORIA

Registrar automaticamente:

- login;
- logout;
- alteração de senha;
- cadastro;
- exclusão;
- alterações de pagamentos;
- alterações de campanhas;
- alterações de permissões.

Os logs devem permitir rastrear ações importantes do sistema.

---

# LGPD

O sistema deverá respeitar integralmente a LGPD.

Permitir:

- consentimento do usuário;
- exportação dos próprios dados;
- exclusão quando permitida por lei;
- política de privacidade;
- termos de uso.

Nunca compartilhar dados pessoais sem autorização.
