# adapta-ia-fe

Frontend do Adapta.ai — professores criam atividades escolares que a IA adapta automaticamente para diferentes perfis de aprendizagem.

Stack: React + TypeScript + Vite, Tailwind CSS, React Router, Axios (isolado em `src/infra/http`), React Query, Zustand, Zod + react-hook-form, Jest + Testing Library.

Documentação de referência em `docs/`: contrato de API (`api.md`), ADRs (`adr-projeto.md`) e tarefas técnicas de frontend (`tarefas_tecnicas_frontend.md`).

## Setup

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se o backend não estiver em localhost:3000
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — typecheck (`tsc -b`) + build de produção
- `npm test` — testes Jest
- `npm run lint` — oxlint

## Estrutura

```
src/
  app/            # componente raiz e rotas
  components/
    ui/           # primitivos estilo shadcn/ui (button, input, label, card)
    shared/       # componentes reaproveitados entre features (BackBtn, FormAlert...)
  features/
    auth/         # Épico FE-1: login, cadastro, hooks, services, schemas Zod
    dashboard/    # Épico FE-2: resumo do professor (turmas/alunos/atividades)
    classes/      # Épico FE-3: listagem, criação e detalhe de turmas
    students/     # Épico FE-4: cadastro de aluno + vínculo de perfil de aprendizagem
    homeworks/    # Épicos FE-5/FE-6/FE-7: criação, processamento, revisão e envio da atividade
  infra/http/     # cliente Axios (baseURL, interceptors de token/erro)
  routes/         # ProtectedRoute
  store/          # Zustand (estado de auth)
  types/          # tipos espelhando docs/api.md
```

Componentes React contêm só JSX + chamadas a hooks (`useX`); estado e efeitos vivem nos hooks, que consomem a camada de `services`.

## Status

- ✅ Épico FE-1 (Autenticação): login, cadastro, rota protegida, validação Zod, testes Jest.
- ✅ Épico FE-2 (Dashboard): contagens de turmas/alunos/atividades, 3 atividades mais recentes, acesso rápido a turmas, estados de loading/vazio/erro.
- ✅ Épico FE-3 (Turmas): listagem com contagem de alunos/perfis, criação de turma (escola/série via select), detalhe da turma com lista de alunos, estados de loading/vazio/erro.
- ✅ Épico FE-4 (Aluno + Perfil de Aprendizagem): cadastro, edição e remoção de aluno (nome/e-mail/perfil), catálogo real via `GET /perfis-aprendizagem` (endpoint novo, adicionado no backend). Edição via `PATCH /turmas/:id/alunos/:alunoId` (endpoint novo, também adicionado no backend). Remoção com modal de confirmação (`ConfirmDialog`, componente compartilhado).
- ✅ Épico FE-5 (Criação de Atividade): formulário estruturado (título, disciplina, turma, conteúdo, questões), cria a atividade geradora como rascunho via `POST /homeworks`.
- ✅ Épico FE-6 (Processamento e Revisão): dispara `POST /homeworks/:id/adaptar` e faz polling de `GET /homeworks/:id/status-adaptacao` (React Query `refetchInterval`) com progresso por perfil, tratamento de falha parcial e retry por perfil. Revisão mostra conteúdo/glossário/áudio reais por variante, tratamento visual de alto contraste/fonte grande, e destinatários por perfil. Áudio via `GET /arquivos/:id`. Preview de PDF por variante via `GET /homeworks/:id/pdf` (endpoint novo no backend), aberto em nova aba a partir de um Blob autenticado. O `content` retornado pela IA passa por um sanitizador (`stripHtmlTags`) antes de ser exibido: o modelo ocasionalmente devolve HTML literal (ex.: `<h1 style='...'>`) embutido no texto, que nem o backend nem a UI tratavam — descoberto testando o PDF ponta a ponta.
- ✅ Épico FE-7 (Envio, Confirmação e Reenvio): "Confirmar e enviar" dispara `POST /homeworks/:id/enviar` (assíncrono, um e-mail por aluno com perfil vinculado). Tela de acompanhamento com polling (`GET /envios/:id`) mostra status real por aluno (enviado/falhou, com motivo) e conta sucesso vs. falha parcial. Reenvio manual (`POST /envios/:id/reenviar`) afeta só quem falhou. Todo o módulo de envio (fila BullMQ, worker, integração SMTP via nodemailer, rastreio por destinatário) foi construído do zero no backend — não existia nenhuma infraestrutura de e-mail antes. Sem anexo em PDF (mesma lacuna do FE-6): o conteúdo adaptado vai inline no corpo do e-mail.
- ✅ Épico FE-8 (Design System e Acessibilidade, transversal): tokens de cor/tipografia centralizados em `src/index.css`, primitivos estilo shadcn/ui (`Button`, `Input`, `Select`, `Textarea`, `Card`, `Skeleton`), componentes compartilhados (`ProfileBadge`, `StatusBadge`, `BackBtn`, `ConfirmDialog`, `AppLayout`/`Sidebar` responsivos com drawer em telas estreitas). Checklist de acessibilidade do app do professor (contraste AA, `role=alert`/`aria-live` em erros e atualizações por polling, `aria-current` na navegação, semântica `radiogroup`/`radio` no seletor de perfil, foco gerenciado no `ConfirmDialog`). Consolidação de estilo "card" duplicado em 7 telas e de cor de destaque hardcoded (`bg-brand-soft`) para uma única fonte.
- ✅ Padronização de nomenclatura em inglês: pastas de feature (`alunos`→`students`, `turmas`→`classes`, `atividades`→`homeworks`), arquivos, componentes, hooks, services, schemas, chaves de cache do React Query e parâmetros de rota (`:alunoId`→`:studentId`) renomeados. Textos visíveis ao usuário (PT-BR), rotas de API do backend (`/turmas`, `/alunos`, `/atividades`) e nomes de tabela do banco não foram alterados — mudar contrato de API é decisão coordenada com o backend, fora do escopo desta limpeza.

### Rodando a adaptação e o envio por IA de ponta a ponta

O worker do backend (`adapta-ia-be`) precisa de `LLM_API_KEY` (simplificação de texto), `TTS_API_KEY` (áudio) e `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM` (envio de e-mail) configuradas no `.env` — sem isso, o worker crasha e as adaptações/envios ficam presos em "Pendente" indefinidamente (a UI continua funcionando normalmente, só não completa).
