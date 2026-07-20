import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { selectIsAuthenticated, useAuthStore } from "../../../store/authStore";
import { authService } from "../services/authService";
import type { LoginFormValues, RegisterFormValues } from "../schemas/authSchemas";

/**
 * Hook de autenticação (ADR 014): concentra estado e efeitos de login,
 * cadastro e logout. Componentes de UI (LoginScreen/RegisterScreen) só
 * chamam essas funções e renderizam o resultado.
 */
export function useAuth() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const storeLogout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (values: LoginFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const { accessToken, user: loggedInUser } = await authService.login(values);
        setSession({ accessToken, user: loggedInUser });
        navigate("/dashboard", { replace: true });
      } catch (err) {
        const code = getApiErrorCode(err);
        setError(
          code === "INVALID_CREDENTIALS"
            ? "E-mail ou senha inválidos."
            : getApiErrorMessage(err),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, setSession],
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await authService.register({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        // Cadastro concluído -> autentica automaticamente (critério de
        // aceite do Épico FE-1: "sou automaticamente autenticado").
        const { accessToken, user: newUser } = await authService.login({
          email: values.email,
          password: values.password,
        });
        setSession({ accessToken, user: newUser });
        navigate("/dashboard", { replace: true });
      } catch (err) {
        const code = getApiErrorCode(err);
        setError(
          code === "EMAIL_ALREADY_IN_USE"
            ? "Este e-mail já está cadastrado."
            : getApiErrorMessage(err),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, setSession],
  );

  const logout = useCallback(() => {
    storeLogout();
    navigate("/login", { replace: true });
  }, [navigate, storeLogout]);

  return { user, isAuthenticated, isSubmitting, error, login, register, logout };
}
