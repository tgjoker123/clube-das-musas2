# API

## OBJETIVO

A API será o coração da plataforma.

Ela deverá ser RESTful, organizada, segura, escalável e documentada automaticamente.

Toda comunicação entre Frontend e Backend deverá ocorrer através da API.

Nunca acessar diretamente o banco de dados pelo frontend.

---

# PADRÃO

Utilizar NestJS.

Todas as rotas deverão seguir um padrão consistente.

Exemplo:

GET

POST

PUT

PATCH

DELETE

Utilizar sempre códigos HTTP corretos.

Nunca retornar erros genéricos.

---

# DOCUMENTAÇÃO

Gerar documentação automática utilizando Swagger.

Toda rota deverá possuir:

- descrição
- parâmetros
- respostas
- exemplos
- autenticação necessária

---

# VALIDAÇÃO

Toda entrada de dados deverá ser validada.

Nunca confiar em dados enviados pelo frontend.

Utilizar DTOs e validações automáticas.

Sempre retornar mensagens de erro claras.

---

# AUTENTICAÇÃO

Todas as rotas protegidas deverão exigir autenticação.

Utilizar JWT.

Validar permissões antes de executar qualquer ação.

Nunca permitir acesso apenas escondendo botões no frontend.

A proteção deve existir obrigatoriamente no backend.

---

# LOGS

Registrar chamadas importantes da API.

Registrar:

- usuário
- horário
- ação
- resultado
- erro quando existir

---

# PERFORMANCE

Sempre utilizar paginação.

Nunca retornar milhares de registros em uma única consulta.

Sempre permitir filtros.

Sempre permitir ordenação.

Sempre permitir pesquisa.

---

# VERSIONAMENTO

Utilizar versionamento da API.

Exemplo:

/api/v1/

Isso facilitará futuras atualizações sem quebrar versões antigas.
