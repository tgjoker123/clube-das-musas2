# DESIGN SYSTEM — CLUBE DAS MUSAS

## 0. Papel deste documento

Este documento define a identidade visual, os tokens de design (cores, tipografia, espaçamento) e os componentes principais que compõem o `packages/ui` descrito em [01_ESTRUTURA_DO_PROJETO.md](01_ESTRUTURA_DO_PROJETO.md). Nenhuma tela deve ser implementada usando cor, fonte ou espaçamento fora do que está definido aqui.

Este documento contém **valores de especificação** (cores, escalas, tipografia) — não é código de implementação. A tradução destes tokens para Tailwind config/CSS variables ocorre na Fase 0 de implementação.

---

## 1. Princípios de Design

Herdados de [PROMPT_MESTRE.md](PROMPT_MESTRE.md), traduzidos em regras verificáveis:

| Princípio                | Regra prática                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Luxo e exclusividade     | Uso generoso de espaço em branco/negativo; nunca lotar uma tela com informação                                                             |
| Elegância e sofisticação | Paleta restrita (preto/dourado + neutros); nenhuma cor saturada "chamativa" fora do necessário para estados (erro/sucesso)                 |
| Feminilidade             | Expressa por curvas suaves nos componentes e tipografia com contraste sutil entre título e corpo — nunca por cor rosa/estereótipo genérico |
| Modernidade              | Componentes flat, sem texturas ou gradientes pesados; ícones de linha fina                                                                 |
| Simplicidade             | Teste dos 30 segundos: qualquer tela nova deve ser compreendida sem explicação                                                             |

---

## 2. Temas: Luxo e Elegance

A plataforma possui dois temas completos, alternáveis a qualquer momento pelo usuário (`theme_preferences`, ver [04_MODELO_DE_DADOS.md](04_MODELO_DE_DADOS.md)).

### 2.1 Tema Luxo (escuro)

| Token                  | Valor     | Uso                                                                                            |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `background-base`      | `#0D0D0F` | Fundo principal                                                                                |
| `background-elevated`  | `#18181B` | Cards, modais                                                                                  |
| `background-sunken`    | `#000000` | Áreas de destaque profundo (ex.: hero da tela inicial)                                         |
| `foreground-primary`   | `#F5F1E8` | Texto principal (branco levemente quente, não branco puro — evita contraste agressivo)         |
| `foreground-secondary` | `#A8A29A` | Texto secundário/legendas                                                                      |
| `accent-gold`          | `#D4AF37` | Cor de destaque — títulos importantes, ícones ativos, bordas de foco, elementos de gamificação |
| `accent-gold-muted`    | `#8C7530` | Variante de dourado para uso em áreas grandes (evita fadiga visual do dourado puro)            |
| `border`               | `#2A2A2E` | Divisores, bordas de card                                                                      |

### 2.2 Tema Elegance (claro)

| Token                  | Valor     | Uso                                                                                                                                             |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `background-base`      | `#FAFAF7` | Fundo principal                                                                                                                                 |
| `background-elevated`  | `#FFFFFF` | Cards, modais                                                                                                                                   |
| `background-sunken`    | `#F0EFE9` | Áreas de destaque suave                                                                                                                         |
| `foreground-primary`   | `#1A1A1C` | Texto principal                                                                                                                                 |
| `foreground-secondary` | `#5C5A54` | Texto secundário/legendas                                                                                                                       |
| `accent-gold`          | `#A9791F` | Dourado escurecido — necessário para manter contraste AA sobre fundo claro (o dourado `#D4AF37` do tema escuro falha em contraste sobre branco) |
| `accent-gold-muted`    | `#C9A227` | Variante para áreas grandes/ilustrações                                                                                                         |
| `border`               | `#E4E2DA` | Divisores, bordas de card                                                                                                                       |

**Motivo técnico:** o tom de dourado **não é o mesmo** nos dois temas — é uma decisão deliberada, não uma inconsistência. Um dourado calibrado para contraste sobre preto (`#D4AF37`) não atinge a razão de contraste mínima de 4.5:1 exigida pelo WCAG AA quando usado como texto sobre fundo branco; por isso o tema Elegance usa uma variante mais escura e saturada do dourado, preservando a identidade visual sem sacrificar acessibilidade.

### 2.3 Cores Semânticas (compartilhadas entre os dois temas, com ajuste de luminosidade)

| Token     | Luxo      | Elegance  | Uso                                                         |
| --------- | --------- | --------- | ----------------------------------------------------------- |
| `success` | `#4F7A5C` | `#3D6047` | Confirmações, pagamento aprovado                            |
| `warning` | `#B8894A` | `#96692F` | Pendências, avisos (ex.: mensalidade próxima do vencimento) |
| `error`   | `#A34C4C` | `#8A3A3A` | Erros, exercício rejeitado, pagamento recusado              |
| `info`    | `#5B7A96` | `#3F5F7A` | Informações neutras                                         |

**Motivo técnico:** as cores semânticas são intencionalmente **dessaturadas** (tons "esmaecidos", não vermelho/verde puros de sistemas genéricos) para não quebrar a sofisticação da paleta preto/dourado — mantém o princípio "evitar cores chamativas sem necessidade" de [PROMPT_MESTRE.md](PROMPT_MESTRE.md) mesmo em estados de erro/sucesso.

---

## 3. Tipografia

| Papel                         | Família                                   | Peso                                          | Uso                                                                |
| ----------------------------- | ----------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| Display / Títulos de destaque | Serifada elegante (ex.: Playfair Display) | 600                                           | Título da tela inicial, telas de marketing/login, nome da campanha |
| Títulos de interface (H1–H4)  | Sans-serif humanista (ex.: Inter)         | 600                                           | Cabeçalhos de tela, títulos de card                                |
| Corpo de texto                | Sans-serif humanista (ex.: Inter)         | 400                                           | Todo o texto de interface, formulários, tabelas                    |
| Rótulos/legendas              | Sans-serif humanista (ex.: Inter)         | 500, caixa alta opcional com leve espaçamento | Labels de formulário, tags de status                               |

**Motivo técnico:** a fonte serifada é reservada a **momentos de impacto emocional** (tela inicial, marca, títulos de campanha) e nunca usada em texto denso de interface (tabelas, formulários) — fontes serifadas decorativas reduzem legibilidade em tamanhos pequenos e telas de alta densidade de informação, o que violaria diretamente o princípio de simplicidade e o "teste dos 30 segundos".

### 3.1 Escala Tipográfica

| Nível   | Tamanho                      | Uso                 |
| ------- | ---------------------------- | ------------------- |
| Display | 40px / 48px (mobile/desktop) | Títulos de impacto  |
| H1      | 28px / 32px                  | Título de tela      |
| H2      | 22px / 24px                  | Título de seção     |
| H3      | 18px                         | Título de card      |
| Body    | 15px / 16px                  | Texto padrão        |
| Small   | 13px                         | Legendas, metadados |
| Caption | 11px                         | Tags, timestamps    |

Altura de linha padrão: 1.5 para corpo de texto, 1.2 para títulos.

---

## 4. Espaçamento e Grid

Escala base de 8px: `4, 8, 12, 16, 24, 32, 48, 64`.

**Motivo técnico:** uma escala única de espaçamento (em vez de valores arbitrários por tela) é o que garante consistência visual entre módulos desenvolvidos em momentos diferentes do projeto — qualquer margem, padding ou gap deve ser um múltiplo desta escala, sem exceção.

- **Grid desktop:** 12 colunas, margem lateral de 32px, gutter de 24px.
- **Grid mobile:** 4 colunas, margem lateral de 16px, gutter de 16px.

---

## 5. Elevação e Bordas

A plataforma evita sombras pesadas (não é uma estética "material design" tradicional). Elevação é comunicada por:

1. Diferença sutil de `background` (`base` → `elevated`), não por sombra projetada forte.
2. Uma borda fina de 1px (`border` token) delimitando cards.
3. Em estados de destaque (ex.: card selecionado, prêmio disponível), uma borda dourada de 1px substitui a sombra como indicador de ênfase.

**Border radius:** escala única — `8px` (inputs, botões pequenos), `12px` (cards, botões padrão), `20px` (modais, elementos de grande destaque). Nunca `border-radius: 0` (quebraria a suavidade exigida pelo princípio de feminilidade/elegância) nem totalmente arredondado tipo pílula em componentes densos (reservado a badges/tags).

---

## 6. Iconografia

- Estilo: linha fina (_outline_), peso de traço consistente (1.5px), nunca ícones sólidos/preenchidos exceto para indicar estado ativo/selecionado.
- Cor padrão: `foreground-secondary`; ícones ativos ou de ação principal usam `accent-gold`.
- Tamanho padrão: 20px (interface densa), 24px (navegação principal).

---

## 7. Componentes Principais

Cada componente abaixo é especificado no nível de **comportamento e regras visuais** — o desenho pixel-a-pixel é produzido durante a implementação em `packages/ui`, seguindo estes tokens.

| Componente                      | Regras principais                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**                      | Variantes: `primary` (fundo dourado, texto escuro), `secondary` (borda dourada, fundo transparente), `ghost` (sem borda, usado em ações terciárias), `destructive` (tom de `error`). Altura mínima de toque: 44px. Sempre com estado de loading (spinner substitui o label, nunca desabilita sem feedback). |
| **Input / Form Field**          | Label sempre visível acima do campo (nunca apenas placeholder). Estado de erro exibido abaixo do campo com ícone + `error` token. Validação client-side é sempre espelhada pela mensagem que o backend retornaria, para consistência.                                                                       |
| **Card**                        | Base do sistema para exibir alunas, exercícios, campanhas, produtos. Sempre com padding de 16–24px, título em H3, borda de 1px.                                                                                                                                                                             |
| **Modal**                       | Reservado a ações que exigem confirmação ou formulários curtos. Nunca usado para navegação (isso é papel de rota). Fecha com `Esc` e clique fora, exceto ações destrutivas (exige clique explícito em "Cancelar").                                                                                          |
| **Table**                       | Usada nas telas do professor (lista de alunas, pedidos, relatórios). Sempre paginada (nunca renderiza centenas de linhas de uma vez, conforme [09_API.md](09_API.md)). Linhas com hover sutil, nunca listras zebradas fortes (mantém sofisticação).                                                         |
| **Badge / Status Pill**         | Formato de pílula (`border-radius` total), cor de fundo dessaturada correspondente ao token semântico (`success`, `warning`, `error`, `info`), usada para status de aluna, pedido, pagamento.                                                                                                               |
| **Avatar**                      | Circular, com fallback de iniciais sobre `background-elevated` quando não há foto.                                                                                                                                                                                                                          |
| **Navegação (Professor/Admin)** | Sidebar fixa em desktop, colapsável; bottom navigation em mobile para as seções mais usadas.                                                                                                                                                                                                                |
| **Navegação (Aluna)**           | Bottom navigation mobile-first (Início, Treino, Gamificação, Marketplace*, Perfil) — a aluna acessa majoritariamente pelo celular. *Marketplace oculto até a funcionalidade existir (pós-MVP).                                                                                                              |
| **Tabs**                        | Usadas para alternar contextos dentro de uma mesma tela (ex.: aba "Evolução" vs. "Anamnese" no perfil da aluna).                                                                                                                                                                                            |
| **Toast / Feedback**            | Toda ação importante gera feedback visual imediato (exigência de [PROMPT_MESTRE.md](PROMPT_MESTRE.md)) — toast discreto no canto, nunca bloqueante.                                                                                                                                                         |
| **Progress / Streak Indicator** | Barra ou anel de progresso em `accent-gold` para exibir progresso de nível/streak — elemento central da experiência de gamificação.                                                                                                                                                                         |
| **Empty State**                 | Ilustração simples em linha fina + mensagem curta + ação sugerida (ex.: "Nenhuma aluna cadastrada ainda — Cadastrar primeira aluna"). Nunca uma tela em branco sem orientação.                                                                                                                              |
| **Skeleton Loading**            | Usado em qualquer carregamento acima de ~300ms, no lugar de spinners genéricos, para reduzir percepção de espera.                                                                                                                                                                                           |
| **Theme Switcher**              | Alternância Luxo/Elegance acessível a partir do Perfil, com transição suave (não um "flash" abrupto de cores).                                                                                                                                                                                              |

---

## 8. Movimento e Animação

- Duração padrão: 150–250ms para microinterações (hover, toggle), 300–400ms para transições de tela/modal.
- Easing padrão: `ease-out` para elementos entrando, `ease-in` para elementos saindo.
- Nunca usar animações decorativas sem propósito funcional (regra explícita: "nunca exagerar").
- Toda ação de gamificação relevante (pontos ganhos, conquista desbloqueada, subida de nível) tem uma animação de celebração breve e elegante — é o único lugar do sistema onde uma animação mais expressiva é intencionalmente permitida, por ser o momento central da proposta de valor motivacional.

---

## 9. Acessibilidade

1. Contraste mínimo AA (4.5:1 para texto normal, 3:1 para texto grande/ícones) validado para **todas** as combinações de token de cor, nos dois temas — processo de validação obrigatório antes de qualquer componente ser aprovado.
2. Área de toque mínima de 44x44px em qualquer elemento interativo.
3. Todo elemento interativo possui estado de foco visível (contorno dourado de 2px), essencial para navegação por teclado.
4. Textos alternativos obrigatórios em imagens funcionais (não decorativas).
5. Hierarquia semântica de headings (H1–H4) respeitada em todas as telas, para compatibilidade com leitores de tela.

---

## 10. Responsividade

| Breakpoint | Largura    | Uso principal                                    |
| ---------- | ---------- | ------------------------------------------------ |
| `mobile`   | até 640px  | App da Aluna (prioridade), telas de autenticação |
| `tablet`   | 641–1024px | Layouts híbridos, professor em campo             |
| `desktop`  | 1025px+    | Dashboard do Professor, Admin                    |

**Motivo técnico:** a área da Aluna é desenhada **mobile-first** (ela treina com o celular na mão), enquanto a área do Professor e do Admin são desenhadas **desktop-first com adaptação mobile completa** — refletindo o contexto real de uso de cada perfil, sem abrir mão da exigência de responsividade total em todos os dispositivos.

---

## 11. Governança do Design System

1. Nenhuma cor, fonte ou espaçamento é usado como valor literal ("hardcoded") em nenhum componente — sempre referenciando um token deste documento, implementado como variável de tema em `packages/ui`.
2. Qualquer novo componente necessário durante a implementação deve ser adicionado primeiro a este documento (ou a uma revisão dele) antes de ser codificado, mantendo o design system como fonte única da verdade visual.
3. Componentes específicos de um domínio de negócio (ex.: um card de campanha) **não** entram em `packages/ui` — apenas composições reutilizáveis de componentes genéricos definidos aqui, conforme já estabelecido em [01_ESTRUTURA_DO_PROJETO.md](01_ESTRUTURA_DO_PROJETO.md#6-packagesui--design-system).

---

Este documento é a base visual para o mapa de telas detalhado em [11_MAPA_DE_TELAS_E_FLUXOS.md](11_MAPA_DE_TELAS_E_FLUXOS.md).
