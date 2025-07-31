# Comunica API

Esta é uma API RESTful completa construída em Node.js com Fastify e TypeScript, projetada para gerenciar comunicados internos de uma empresa. O projeto segue princípios de arquitetura limpa, é totalmente testado, containerizado com Docker e implementa padrões básicos de resiliência para integrações com serviços externos.

A ideia principal é trazer conceitos de arquitetura limpa de uma forma que podemos desacoplar partes do código de forma simples conforme a necessidade do negócio. Estando mais próximo do primeiro passo para lidar com microsserviços.

## Visão Geral da Arquitetura

A aplicação é estruturada em uma arquitetura de 3 camadas (Controllers, Services, Repositories) para garantir uma clara separação de responsabilidades (SoC).

Controllers: Responsáveis por lidar com o ciclo de vida da requisição HTTP. Eles recebem a requisição, validam a entrada (via schemas) e orquestram a chamada para a camada de serviço.

Services: Contêm a lógica de negócio pura da aplicação. Eles não conhecem o HTTP, apenas executam as regras de negócio e coordenam as operações com a camada de dados.

Repositories: É a única camada que conhece e interage com o banco de dados. Ela abstrai as queries e a lógica de persistência de dados, utilizando o ORM Drizzle.

A comunicação entre as camadas é feita através de Injeção de Dependência e segue o Parameter Object Pattern, garantindo que o código seja desacoplado, testável e explícito.

## Decisões Técnicas Chave

Este projeto foi construído com foco em robustez, manutenibilidade e observabilidade. As seguintes decisões foram tomadas:

1. **Framework e Linguagem:**

   - Fastify: Escolhido por sua alta performancee ecossistema de plugins robusto, que permite uma arquitetura extensível.

   - TypeScript: Para garantir a segurança de tipos em todo o projeto, reduzindo bugs em tempo de desenvolvimento e melhorando a DX.

2. **Acesso a Dados:**

   - PostgreSQL: Um banco de dados relacional robusto e confiável.

   - Drizzle ORM: Um ORM "TS first" que oferece segurança de tipos de ponta a ponta, desde a query até o resultado afim de evitar erros de SQL em tempo de execução.

   - Migrations Automatizadas: O drizzle-kit é utilizado para gerenciar as migrações do banco de dados, garantindo que o schema seja consistente em todos os ambientes.

3. **Observabilidade e Logging:**

   - Pino: Utilizado para logs estruturados em `JSON`, que é o padrão para sistemas de monitoramento modernos.

   - Contexto de Log: Cada requisição recebe um ID único (reqId) que é propagado através de todas as camadas. Isso permite rastrear o ciclo de vida completo de uma operação, desde a entrada no controller até a query no banco de dados, facilitando a depuração em produção.

   - Logs Semânticos: Diferentes níveis de log `(info, warn, error, fatal)` são usados pra facilicar a visibilidade da execução da aplicação, desde a lógica de negócio até as métricas de performance de queries.

4. **Segurança:**

   - Autenticação JWT: A autenticação é gerenciada via JSON Web Tokens. Para aplicações web. A autenticação é aplicada globalmente a todas as rotas por padrão, com uma lista de exceções para endpoints públicos.

   - Validação Robusta com Zod: Todas as entradas da API (body, query, params) são validadas usando Zod através do `fastify-type-provider-zod`, garantindo a integridade dos dados antes que eles atinjam a lógica de negócio.

   - Hashing de Senhas com bcrypt: As senhas dos usuários são armazenadas de forma segura usando o algoritmo bcrypt.

   - Rate Limiting: O plugin `@fastify/rate-limit` foi implementado para proteger a API contra abuso e ataques de força bruta, com regras mais rígidas para endpoints sensíveis como `/auth/login`.

- **Resiliência (Integrações Externas):**

  - Para a integração com serviços externos, foram implementados múltiplos padrões de resiliência:

  - Retry Logic com Backoff Exponencial: A aplicação tenta novamente as chamadas de API falhas, com um tempo de espera crescente entre as tentativas.

  - Cache: Os dados da integração são armazenados em cache para reduzir a latência e manter a aplicação funcional mesmo quando a API externa está indisponível.

  - Fallback: Se a API externa falhar, a aplicação serve os dados "velhos" do cache como um fallback, garantindo a continuidade do serviço.

## Estrutura de Pastas

A estrutura do projeto é organizada por módulos para promover o encapsulamento e a escalabilidade.

```
/
├── drizzle/              # Arquivos de migração do Drizzle
├── src/
│   ├── lib/
│   │   ├── configs/      # Configurações centralizadas (DB, JWT, Swagger)
│   │   └── database/           # Scripts de banco de dados
│   │
│   ├── modules/
│   │   ├── announcements/ # Módulo de Chamados
│   │   │   ├── __tests__/
│   │   │   │   ├── integration/
│   │   │   │   └── unit/
│   │   │   ├── announcements.controller.ts
│   │   │   ├── announcements.service.ts
│   │   │   ├── announcements.repository.ts
│   │   │   ├── announcements.routes.ts
│   │   │   ├── dtos/
│   │   │   └── ...
│   │   │
│   │   ├── auth/         # Módulo de Autenticação
│   │   └── ...           # Outros módulos
│   │
│   ├── shared/           # Código compartilhado entre módulos (erros, helpers, etc.)
│   └── app.ts            # Construção da instância do Fastify (plugins, hooks)
│
├── .env.example          # Template para variáveis de ambiente
├── Dockerfile            # Receita para build de produção
├── docker-compose.yml    # Orquestração de contêineres
└── package.json
```

---

## O que precisa no computador pra conseguir rodar

    Node.js (v20 =< 22.17.1 )

    pnpm

    Docker e Docker Compose

## Como rodar

1. Clone o repositório:

   ```
   git clone git@github.com:aandresantos/comunica-api.git

   cd comunica-api
   ```

2. Verifica o .env:
   Pra facilitar a vida no setup deixei tudo definido pra usar os valores do `.env.test` no ambiente local:
   `    cp .env.test .env`
3. Executa o script:
   ```
    ./init.dev.sh
   ```

A API fica na on em `http://localhost:3000`

---

## Como rodar os testes

O projeto utiliza Jest para os testes, com uma separação clara entre testes unitários e de integração.

- **Rodar todos os testes**:
  ```
  pnpm test
  ```
- **Rodar apenas os testes unitários (rápidos):**
  ```
   pnpm test --testPathPatterns=unit
  ```
- **Rodar apenas os testes de integração (requer um DB de teste):**
  Como não definimos o banco de teste apenas o local, o env de teste ta passando a mesma url do banco de dev.
  ```
  pnpm test --testPathPatterns=integration
  ```
- **Verificar a cobertura de testes:**
  ```
  pnpm test:coverage
  ```

## Documentatação

https://www.postman.com/flight-cosmologist-73669498/workspace/comunica-api-public-env/collection/41855606-d711bc44-eb03-4127-89be-df0c70383f8d?action=share&source=copy-link&creator=41855606
