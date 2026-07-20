import { apiClient } from "../../../infra/http/apiClient";
import type { PublicUser } from "../../../types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: PublicUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Camada de services (ADR 014): orquestra chamadas HTTP e formata dados para
// os hooks consumirem. Nenhum componente/hook fala com o Axios diretamente.
export const authService = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload): Promise<PublicUser> =>
    apiClient.post<PublicUser>("/usuarios", payload).then((r) => r.data),

  me: (): Promise<PublicUser> =>
    apiClient.get<PublicUser>("/usuarios/me").then((r) => r.data),
};
