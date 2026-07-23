# BANCO DE DADOS

## OBJETIVO

O banco de dados deverá ser desenvolvido para suportar milhares de professores, centenas de milhares de alunas e milhões de registros sem necessidade de grandes alterações estruturais.

Utilizar PostgreSQL através do Supabase.

Seguir obrigatoriamente as melhores práticas de modelagem relacional.

---

# REGRAS

Nunca duplicar informações.

Sempre utilizar relacionamentos.

Criar índices para campos frequentemente pesquisados.

Nunca utilizar nomes confusos.

Todos os nomes devem estar em inglês.

Utilizar UUID como chave primária em todas as tabelas.

Toda tabela deverá possuir obrigatoriamente:

- id
- created_at
- updated_at

Sempre utilizar Soft Delete quando fizer sentido.

Nunca excluir informações importantes definitivamente.

---

# SEGURANÇA

O banco armazenará dados extremamente sensíveis.

Exemplos:

- Dados pessoais
- Telefones
- Endereços
- Exames
- Anamnese
- Fotos
- Evolução física
- Pagamentos

Implementar Row Level Security (RLS) em todas as tabelas.

Nenhum usuário poderá visualizar registros de outro professor.

Uma aluna nunca poderá acessar dados de outra aluna.

Todo acesso deverá ser validado utilizando políticas do Supabase.

Nunca confiar apenas na aplicação.

---

# AUDITORIA

Criar logs para ações importantes.

Registrar:

- Login
- Logout
- Alteração de senha
- Cadastro
- Exclusão
- Alteração de pagamentos
- Alteração de pontuação
- Alteração de campanhas
- Alteração de fichas

Sempre registrar:

- usuário
- data
- IP quando possível
- ação realizada

---

# PERFORMANCE

O banco deverá ser preparado para consultas rápidas.

Evitar consultas N+1.

Utilizar índices.

Criar relacionamentos corretos.

Evitar redundância.

Sempre pensar na escalabilidade.

---

# BACKUP

O sistema deverá permitir recuperação em caso de falhas.

Nunca correr risco de perda de informações.

Dados importantes nunca poderão ser perdidos.

---

# LGPD

Os dados sensíveis deverão receber tratamento especial.

O sistema deverá permitir:

- consentimento do usuário;
- exportação dos próprios dados;
- anonimização quando necessário;
- exclusão conforme legislação, quando aplicável.

Sempre proteger dados médicos e pessoais.

# ENTIDADES PRINCIPAIS

O banco deverá ser organizado por módulos.

## Autenticação

- users
- roles
- permissions
- user_roles
- sessions
- audit_logs

## Professores

- professors
- licenses
- plans

## Alunas

- students
- student_status
- student_notes
- student_documents
- student_anamnesis
- student_progress
- student_measurements
- student_blood_exams

## Exercícios

- exercises
- exercise_categories
- exercise_videos

## Treinos

- workout_templates
- workout_template_items
- student_workouts
- workout_history

## Check-ins

- checkins
- checkin_photos

## Gamificação

- campaigns
- campaign_rules
- campaign_registrations
- points_history
- achievements
- student_achievements
- rewards
- reward_redemptions
- rankings

## Feed

- posts
- post_images
- comments
- reactions

## Marketplace

- partners
- partner_categories
- products
- product_images
- orders
- order_items
- order_status
- reviews

## Pagamentos

- subscriptions
- payments
- payment_history
- invoices
- coupons

## Notificações

- notifications
- notification_history

## Configurações

- settings
- theme_preferences

Cada tabela deverá possuir relacionamentos bem definidos.

Nunca criar tabelas sem necessidade.

Sempre pensar em escalabilidade.
