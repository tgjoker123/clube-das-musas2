CLUBE DAS MUSAS - PROMPT MESTRE
OBJETIVO

Você será responsável por desenvolver completamente a plataforma Clube das Musas.

Você NÃO é apenas um programador.

Você deve agir como uma equipe completa composta por:

Arquiteto de Software Sênior
Desenvolvedor Full Stack Sênior
UX Designer
UI Designer
Product Designer
Product Manager
Especialista em Segurança
QA Engineer
DevOps Engineer

Seu objetivo é criar uma plataforma premium, moderna, segura, escalável e intuitiva.

A qualidade do projeto é mais importante do que a velocidade.

Nunca implemente funcionalidades de forma apressada.

Antes de escrever qualquer código, analise toda a documentação e proponha melhorias caso encontre oportunidades.

Nunca remova funcionalidades solicitadas.

Caso encontre uma forma melhor de implementar alguma funcionalidade, explique o motivo e utilize a solução mais profissional.

# REGRAS OBRIGATÓRIAS

Este projeto deve ter qualidade de software comercial.

Nunca desenvolva algo apenas para funcionar.

Tudo deve ser:

- Seguro
- Escalável
- Bonito
- Intuitivo
- Performático
- Fácil de manter

Antes de criar qualquer funcionalidade, analise se existe uma forma mais elegante e profissional de implementá-la.

Caso exista, utilize essa solução sem remover os requisitos originais.

## Segurança (Prioridade Máxima)

A segurança é obrigatória em todo o projeto.

Nunca confiar em validações feitas apenas no frontend.

Toda validação deve existir também no backend.

Implementar obrigatoriamente:

- Proteção contra SQL Injection
- Proteção contra XSS
- Proteção contra CSRF
- Proteção contra ataques de força bruta
- Rate Limiting
- Validação de uploads
- Criptografia de dados sensíveis
- Controle de permissões (RBAC)
- Auditoria de ações importantes
- Logs de segurança
- Tokens seguros
- Sessões seguras
- Boas práticas da LGPD

Os dados de saúde (anamnese, exames e evolução física) são extremamente sensíveis e devem receber proteção especial.

Nenhuma informação privada pode ser exposta para outro usuário.

Nenhum usuário pode acessar informações que não pertencem ao seu perfil.

Sempre seguir as melhores práticas de segurança do OWASP.

## Qualidade do Código

Nunca gerar:

- código duplicado
- funções gigantes
- arquivos desorganizados
- comentários desnecessários
- código temporário
- TODO
- FIXME
- gambiarras

O código deve ser limpo, organizado e pronto para produção.

Sempre utilizar boas práticas de arquitetura e desenvolvimento.

# IDENTIDADE VISUAL E EXPERIÊNCIA

A identidade visual da plataforma deve ser inspirada na marca "Clube das Musas".

O sistema deve transmitir:

- Luxo
- Elegância
- Exclusividade
- Feminilidade
- Modernidade
- Sofisticação
- Simplicidade

Nunca criar uma interface genérica de painel administrativo.

## Paleta de cores

Cores principais:

- Preto
- Dourado

Cores de apoio:

- Branco
- Cinza escuro
- Cinza claro

Evitar cores chamativas sem necessidade.

## Temas

O sistema deve possuir dois temas oficiais:

- Tema Luxo (preto + dourado)
- Tema Elegance (branco + dourado)

O usuário poderá trocar entre eles a qualquer momento.

## Experiência do usuário

A interface deve ser extremamente simples.

Qualquer pessoa, mesmo sem experiência com tecnologia, deve conseguir utilizar o sistema.

Sempre priorizar:

- poucos cliques
- telas organizadas
- botões claros
- textos fáceis de entender
- navegação intuitiva

Sempre que existir uma forma mais simples de apresentar uma funcionalidade, utilize essa forma.

Antes de finalizar qualquer tela, pergunte:

"Um usuário que nunca entrou no sistema conseguiria entender esta tela em menos de 30 segundos?"

Se a resposta for não, redesenhe a interface.

## Componentes

Todos os componentes devem seguir o mesmo padrão visual.

Botões, formulários, tabelas, gráficos, cards e modais devem ser consistentes em todo o sistema.

## Animações

Utilizar animações suaves e elegantes.

Nunca exagerar.

Toda ação importante deve possuir feedback visual.

## Responsividade

Todo o sistema deve funcionar perfeitamente em:

- Computadores
- Tablets
- Celulares

O design mobile deve receber a mesma atenção que o desktop.

# PERFIS DE USUÁRIO

O sistema será SaaS Multi-Tenant.

Cada professor possui suas próprias alunas, campanhas, marketplace e dados.

Nenhum professor poderá visualizar informações de outro professor.

Existem 4 perfis principais.

## 1. Admin SaaS

É o proprietário da plataforma.

Possui acesso total ao sistema.

Pode:

- gerenciar professores;
- gerenciar planos;
- aprovar parceiros;
- visualizar estatísticas gerais;
- bloquear e desbloquear contas;
- gerenciar licenças;
- acompanhar pagamentos;
- visualizar logs do sistema;
- acessar dashboards administrativos.

## 2. Professor

É o cliente da plataforma.

Pode:

- cadastrar alunas;
- criar fichas de treino;
- cadastrar exercícios;
- criar campanhas;
- conceder prêmios;
- acompanhar evolução física;
- visualizar rankings;
- gerenciar marketplace;
- acompanhar pagamentos das alunas;
- visualizar dashboards.

Nunca poderá acessar informações de outro professor.

## 3. Aluna

É a cliente do professor.

Pode:

- visualizar seus treinos;
- concluir exercícios;
- enviar fotos obrigatórias;
- participar de campanhas;
- ganhar pontos;
- resgatar prêmios;
- acompanhar sua evolução;
- visualizar o ranking;
- acessar o marketplace;
- realizar pagamentos;
- conversar com a IA assistente.

Nunca poderá visualizar informações privadas de outras alunas.

## 4. Parceiro

É responsável pelos produtos e serviços do marketplace.

Pode:

- cadastrar produtos;
- cadastrar serviços;
- atualizar estoque;
- acompanhar pedidos;
- visualizar avaliações;
- acompanhar repasses financeiros.

Nunca poderá acessar informações das alunas além do necessário para concluir um pedido.

## Controle de Permissões

Toda rota da API deve possuir validação de permissões.

Nenhuma permissão deve depender apenas do frontend.

O backend deve validar obrigatoriamente:

- identidade do usuário;
- perfil do usuário;
- permissões;
- vínculo com professor;
- acesso aos recursos.

# ARQUITETURA DO PROJETO

Este projeto deve ser desenvolvido utilizando uma arquitetura moderna, escalável e preparada para crescimento.

O objetivo é que a plataforma suporte milhares de professores, dezenas de milhares de alunas e continue organizada conforme novas funcionalidades forem adicionadas.

## Estrutura

Utilizar Monorepo.

Estrutura mínima:

apps/
web/
api/

packages/
ui/
types/
utils/
config/

docs/

## Frontend

Utilizar:

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- Zod
- TanStack Query
- Zustand

O frontend deve possuir:

- Componentes reutilizáveis
- Código organizado
- Separação por módulos
- Lazy Loading quando necessário
- SEO otimizado
- Alta performance

## Backend

Utilizar:

- NestJS
- TypeScript

Arquitetura modular.

Separar corretamente:

- Controllers
- Services
- Repositories
- DTOs
- Guards
- Middlewares
- Interceptors
- Providers

Nunca colocar regras de negócio dentro dos Controllers.

Toda regra de negócio deve ficar nos Services.

## Banco de Dados

Utilizar:

- Supabase PostgreSQL

O banco deve ser totalmente normalizado.

Criar relacionamentos seguros.

Utilizar índices quando necessário.

Evitar consultas desnecessárias.

## Storage

Utilizar Supabase Storage para:

- fotos de exercícios
- fotos de evolução
- fotos de check-in
- imagens do marketplace
- PDFs de exames

Nunca armazenar arquivos diretamente no banco de dados.

## Autenticação

Utilizar Supabase Auth.

Login seguro.

Sessões seguras.

Recuperação de senha.

Confirmação de e-mail.

Tokens protegidos.

## Organização

Cada módulo do sistema deve ser independente.

Exemplo:

Professor

Aluna

Marketplace

Gamificação

Pagamentos

Admin

Parceiros

Cada módulo deve possuir seus próprios componentes, páginas, serviços e regras.

## Escalabilidade

O projeto deve ser preparado para futuras funcionalidades sem necessidade de grandes refatorações.

Sempre pensar no crescimento da plataforma.

Nunca criar código difícil de expandir.

## Qualidade

Sempre preferir soluções profissionais.

Nunca sacrificar organização por velocidade.

Todo código deve ser escrito pensando em manutenção a longo prazo.

# MÓDULO DO PROFESSOR

O Professor é o principal cliente da plataforma.

Toda a experiência deve ser simples, rápida e intuitiva.

O objetivo é permitir que ele gaste mais tempo acompanhando suas alunas e menos tempo utilizando o sistema.

## Dashboard

Ao entrar no sistema, o professor deve visualizar um painel completo contendo:

- Total de alunas
- Alunas ativas
- Alunas suspensas
- Alunas inadimplentes
- Aniversários próximos
- Últimos check-ins
- Alunas há mais de 7 dias sem treinar
- Ranking da campanha atual
- Próximos vencimentos
- Avisos importantes
- Últimas atividades

Todas essas informações devem aparecer de forma organizada e elegante.

Nunca poluir a tela.

## Cadastro de Alunas

O professor poderá cadastrar uma ou várias alunas.

Cada aluna possuirá:

- Nome
- Foto de perfil
- E-mail
- Telefone
- Data de nascimento
- Data de entrada
- Objetivo
- Status
- Observações

Também deverá possuir:

- Histórico completo
- Linha do tempo
- Evolução física
- Anamnese
- Exames
- Pagamentos
- Campanhas
- Conquistas
- Premiações

## Evolução Física

Cada aluna possuirá uma galeria privada.

Somente a aluna e o professor poderão visualizar essas imagens.

A evolução deverá possuir:

- Fotos
- Peso
- Medidas
- Percentual de gordura (informado pelo professor)
- Observações

Permitir comparar duas datas lado a lado.

As fotos nunca serão analisadas por Inteligência Artificial.

A avaliação sempre será feita pelo professor.

## Exercícios

O professor poderá criar uma biblioteca própria de exercícios.

Cada exercício deverá possuir:

- Nome
- Grupo muscular
- Vídeo demonstrativo
- Instruções
- Séries
- Repetições
- Carga
- Tempo de descanso

Os exercícios poderão ser reutilizados em várias fichas.

## Fichas de Treino

O professor poderá criar modelos de treino.

Depois poderá reutilizar esses modelos para diversas alunas.

Também poderá personalizar cada ficha individualmente sem alterar o modelo original.

## Campanhas

O professor poderá criar campanhas de gamificação.

Cada campanha deverá possuir:

- Nome
- Período
- Regras
- Pontuação
- Premiações
- Ranking

As regras deverão ser totalmente configuráveis.

Nunca deixar regras fixas no código.

## Feed

O professor poderá publicar:

- Avisos
- Desafios
- Mensagens
- Fotos autorizadas de evolução
- Campeãs
- Boas-vindas para novas alunas

As fotos de evolução somente poderão ser publicadas mediante autorização da aluna.

## Relatórios

O professor deverá possuir relatórios completos sobre:

- Frequência
- Evolução
- Pagamentos
- Ranking
- Pontuação
- Check-ins
- Crescimento da carteira de alunas

Todos os relatórios deverão possuir filtros e exportação.

# MÓDULO DA ALUNA

A área da aluna deve parecer um aplicativo moderno e agradável de usar.

O objetivo é incentivar a constância nos treinos e tornar a experiência divertida, sem deixar a interface confusa.

## Tela Inicial

Ao entrar no sistema, a aluna deverá visualizar:

- Saudação personalizada.
- Próximo treino.
- Sequência atual de dias treinando.
- Pontuação total.
- Posição no ranking.
- Próximas campanhas.
- Avisos do professor.
- Últimas conquistas.

As informações devem aparecer em ordem de prioridade.

Nunca poluir a tela.

## Ficha de Treino

A aluna poderá visualizar sua ficha organizada por dia.

Cada exercício deverá possuir:

- Nome
- Vídeo demonstrativo
- Grupo muscular
- Séries
- Repetições
- Carga
- Descanso
- Observações do professor

O botão "Concluir Exercício" somente poderá finalizar o exercício após o envio obrigatório de uma foto.

Sem foto, o exercício permanecerá pendente.

Essa validação deve acontecer obrigatoriamente no backend.

## Check-in

O sistema deverá registrar automaticamente o check-in diário quando pelo menos um exercício for concluído corretamente.

O histórico de check-ins ficará disponível para consulta.

## Minha Evolução

A aluna possuirá uma área exclusiva para acompanhar sua evolução.

Essa área deverá conter:

- Linha do tempo.
- Fotos.
- Peso.
- Medidas.
- Percentual de gordura (informado pelo professor).
- Observações.

Também deverá existir uma opção chamada:

"Comparar Evolução"

A aluna poderá escolher duas datas para visualizar a evolução lado a lado.

Nenhuma inteligência artificial poderá analisar essas fotos.

## Gamificação

A aluna poderá visualizar:

- Pontuação.
- Histórico de pontos.
- Ranking.
- Campanhas ativas.
- Medalhas.
- Conquistas.
- Sequência de dias.

Tudo deve ser apresentado de forma simples e intuitiva.

## Feed

O feed interno deverá conter:

- Avisos do professor.
- Novas campanhas.
- Boas-vindas às novas integrantes.
- Campeãs da semana.
- Mensagens motivacionais.
- Publicações autorizadas pelo professor.

A aluna nunca poderá publicar diretamente no feed.

## Marketplace

A aluna poderá:

- Comprar produtos.
- Comprar serviços.
- Favoritar itens.
- Avaliar compras.
- Acompanhar pedidos.
- Visualizar promoções.

## Pagamentos

A aluna poderá visualizar:

- Situação da mensalidade.
- Histórico de pagamentos.
- Próximo vencimento.
- Segunda via.
- PIX.
- Cartão.
- Boleto, quando disponível.

## Perfil

O perfil deverá mostrar:

- Foto.
- Nome.
- Tempo treinando.
- Pontuação.
- Medalhas.
- Conquistas.
- Evolução.
- Configurações.
- Preferências.
- Tema (Luxo ou Elegance).

Toda a experiência deve incentivar a motivação e o engajamento, sem transformar a plataforma em uma rede social.

# MÓDULO DE GAMIFICAÇÃO

A gamificação é um dos pilares principais da plataforma.

Ela deve aumentar a motivação das alunas sem causar competitividade negativa.

Toda a experiência deve ser divertida, elegante e fácil de entender.

## Campanhas

O professor poderá criar campanhas totalmente personalizadas.

Cada campanha deverá possuir:

- Nome
- Descrição
- Data de início
- Data de término
- Imagem de capa
- Regras de pontuação
- Prêmios
- Status (Agendada, Ativa, Encerrada)

Nenhuma regra de pontuação deve ficar fixa no código.

Todas devem ser configuráveis.

## Inscrição

A aluna poderá se inscrever em campanhas futuras.

Após a campanha iniciar:

- novas inscrições serão bloqueadas;
- o sistema deverá informar que será possível participar apenas do próximo evento.

## Pontuação

Os pontos poderão ser concedidos por:

- Check-in diário
- Exercício concluído
- Sequência de dias
- Foto de evolução enviada
- Participação em desafios
- Bônus concedido pelo professor
- Aniversário
- Aniversário de treino

Toda movimentação deverá ficar registrada em um histórico.

Nunca alterar pontos sem registrar o motivo.

## Ranking

O ranking deverá atualizar automaticamente.

Exibir:

- posição
- nome
- foto
- pontuação

O professor poderá escolher se o ranking será:

- público para as participantes
- privado

## Medalhas

O sistema deverá possuir conquistas.

Exemplos:

- Primeiro treino
- 7 dias seguidos
- 30 dias seguidos
- 100 exercícios concluídos
- 1 ano treinando
- Campeã da campanha
- Meta alcançada

As medalhas deverão aparecer no perfil da aluna.

## Prêmios

O professor poderá criar prêmios.

Tipos:

- Resgate por pontos
- Concedido manualmente
- Campanhas
- Aniversário
- Evolução física
- Tempo de treino

O histórico de prêmios deverá ficar salvo.

## Feed de Conquistas

O sistema poderá publicar automaticamente:

- Campeãs
- Novas medalhas
- Novas campanhas
- Mensagens motivacionais

Fotos de evolução somente poderão ser publicadas mediante autorização da aluna.

## IA Assistente

A Inteligência Artificial poderá:

- criar mensagens motivacionais;
- gerar resumos semanais;
- sugerir metas de consistência;
- avisar o professor sobre baixa frequência;
- resumir o desempenho da aluna.

A IA nunca poderá:

- avaliar corpo por fotos;
- diagnosticar problemas de saúde;
- recomendar medicamentos;
- substituir o professor;
- calcular percentual de gordura através de imagens.

A IA é apenas uma assistente de produtividade e motivação.

# MÓDULO MARKETPLACE

O Marketplace deverá ser uma área premium da plataforma.

Seu objetivo é conectar alunas a parceiros aprovados pelo Clube das Musas.

A experiência deve ser semelhante à de grandes aplicativos de compras, porém mais simples e intuitiva.

## Parceiros

Somente parceiros aprovados pelo Admin poderão vender.

Cada parceiro deverá possuir:

- Nome
- Logo
- Descrição
- Categoria
- Região de atuação
- Contatos
- Redes sociais
- Avaliações
- Status (Ativo/Inativo)

## Produtos e Serviços

Cada parceiro poderá cadastrar:

- Produtos
- Serviços

Cada item deverá conter:

- Nome
- Descrição
- Fotos
- Preço
- Estoque (quando produto)
- Agenda (quando serviço)
- Categoria
- Promoções
- Status

## Busca

O Marketplace deverá possuir:

- Busca por nome
- Busca por categoria
- Filtro por preço
- Filtro por região
- Itens em destaque
- Mais vendidos
- Melhor avaliados

A busca deve ser rápida e intuitiva.

## Favoritos

As alunas poderão favoritar produtos e serviços.

## Carrinho

O Marketplace deverá possuir carrinho de compras.

A aluna poderá:

- adicionar itens;
- remover itens;
- alterar quantidade;
- visualizar resumo do pedido.

## Pagamentos

Toda compra deverá utilizar Mercado Pago.

Aceitar:

- PIX
- Cartão de Crédito
- Cartão de Débito (quando disponível)
- Checkout Pro ou Checkout Transparente

Toda integração deverá utilizar as APIs oficiais do Mercado Pago.

## Split de Pagamento

O sistema deverá suportar split de pagamento.

O valor deverá ser distribuído automaticamente entre:

- Plataforma
- Parceiro
- Professor (quando configurado)

Nunca calcular valores apenas no frontend.

Toda lógica financeira deverá ocorrer no backend.

## Pedidos

A aluna poderá acompanhar:

- Pedido recebido
- Em preparação
- Enviado
- Entregue
- Cancelado

## Avaliações

Após a entrega, a aluna poderá avaliar.

Cada avaliação possuirá:

- Nota
- Comentário
- Data

O parceiro poderá responder avaliações.

## Segurança

Todo pagamento deverá ser validado utilizando Webhooks do Mercado Pago.

Nunca confiar apenas no retorno enviado pelo frontend.

O backend deverá confirmar todos os pagamentos antes de liberar pedidos.

## Experiência

O Marketplace deve parecer moderno, rápido e elegante.

Nunca criar uma experiência complicada.

A compra deve exigir o menor número possível de cliques.

# PROCESSO OBRIGATÓRIO DE DESENVOLVIMENTO

Antes de escrever qualquer código, siga obrigatoriamente este processo.

## ETAPA 1 — Análise

Leia toda esta documentação completamente.

Entenda todos os módulos.

Entenda todas as regras.

Entenda todos os fluxos.

Não faça suposições.

Caso alguma informação esteja faltando, pergunte antes de implementar.

---

## ETAPA 2 — Revisão Técnica

Após ler toda a documentação:

Analise o projeto como um Arquiteto de Software Sênior.

Procure:

- problemas de arquitetura;
- problemas de UX;
- riscos de segurança;
- melhorias de performance;
- oportunidades de simplificação;
- possíveis bugs futuros;
- funcionalidades que podem ser melhoradas.

Ao final, apresente um relatório organizado.

Não escreva código ainda.

---

## ETAPA 3 — Planejamento

Monte um plano completo de desenvolvimento.

Divida o projeto em fases.

Cada fase deverá possuir:

- objetivo;
- funcionalidades;
- dependências;
- estimativa de complexidade.

Somente após aprovação inicie o desenvolvimento.

---

## ETAPA 4 — Desenvolvimento

Implemente apenas uma fase por vez.

Nunca tente desenvolver o sistema inteiro de uma única vez.

Ao finalizar cada fase:

- revise o código;
- procure bugs;
- procure melhorias;
- otimize performance;
- valide segurança.

Somente depois avance para a próxima fase.

---

## ETAPA 5 — Revisão Final

Antes de considerar qualquer funcionalidade concluída, valide:

- segurança;
- UX;
- UI;
- performance;
- responsividade;
- acessibilidade;
- organização do código;
- integração com os demais módulos.

Caso encontre qualquer problema, corrija antes de continuar.

Nunca considere um módulo finalizado enquanto existir uma melhoria importante a ser feita.

---

# REGRA PRINCIPAL

Este projeto não deve ser desenvolvido com pressa.

A qualidade é mais importante do que a velocidade.

Sempre pensar como uma empresa que está construindo um software que será utilizado por milhares de pessoas.

Cada decisão deve ser tomada visando qualidade, segurança, escalabilidade e experiência do usuário.
