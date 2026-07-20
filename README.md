# adapta-ia-fe

Frontend do Adapta.ia — professores criam atividades escolares que a IA adapta automaticamente para diferentes perfis de aprendizagem.

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
    dashboard/    # placeholder do Épico FE-2
  infra/http/     # cliente Axios (baseURL, interceptors de token/erro)
  routes/         # ProtectedRoute
  store/          # Zustand (estado de auth)
  types/          # tipos espelhando docs/api.md
```

Componentes React contêm só JSX + chamadas a hooks (`useX`); estado e efeitos vivem nos hooks, que consomem a camada de `services`.

## Status

- ✅ Épico FE-1 (Autenticação): login, cadastro, rota protegida, validação Zod, testes Jest.
- ⏳ Épicos FE-2 a FE-8: ainda não implementados (dashboard é um placeholder).
