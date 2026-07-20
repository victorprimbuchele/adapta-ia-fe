import axios, { type AxiosError } from "axios";
import { useAuthStore } from "../../store/authStore";
import type { ApiErrorBody } from "../../types/user";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const apiClient = axios.create({ baseURL });

// Interceptor de token JWT: anexa Authorization: Bearer <token> em toda
// requisição, lido do estado global (Zustand), nunca de forma acoplada a
// componentes de UI (ADR 015).
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const SESSION_INVALIDATING_CODES = new Set([
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "MISSING_TOKEN",
]);

// Interceptor de erro: qualquer resposta que indique sessão inválida/expirada
// limpa o estado de auth. Sem refresh token no MVP (ver docs/api.md §2/§9),
// o professor precisa logar novamente.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const code = error.response?.data?.error?.code;
    if (code && SESSION_INVALIDATING_CODES.has(code)) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

const DEFAULT_ERROR_MESSAGE = "Ocorreu um erro inesperado. Tente novamente.";

export function getApiErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.code;
  }
  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }
  return fallback;
}
