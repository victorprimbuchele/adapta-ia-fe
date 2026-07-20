import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicUser } from "../types/user";

interface AuthSession {
  accessToken: string;
  user: PublicUser;
}

interface AuthState {
  accessToken: string | null;
  user: PublicUser | null;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

/**
 * Estratégia de persistência do token (Épico FE-1, tarefa 4):
 * o backend não tem refresh token e expira o accessToken em 15min (ver
 * docs/api.md §2), então usamos `localStorage` com essa expiração curta como
 * estratégia aceitável para o prazo do MVP. `httpOnly cookie` reduziria a
 * superfície de XSS e é a opção recomendada no documento de tarefas técnicas,
 * mas exigiria mudança no backend (fora do escopo desta entrega) — a
 * confirmar com o time. O interceptor de resposta em infra/http/apiClient.ts
 * já limpa a sessão assim que o backend retorna
 * TOKEN_EXPIRED/INVALID_TOKEN/MISSING_TOKEN.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    { name: "adapta-ia-auth" },
  ),
);

export const selectIsAuthenticated = (state: AuthState): boolean =>
  Boolean(state.accessToken && state.user);
