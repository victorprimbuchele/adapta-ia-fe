import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated, useAuthStore } from "../store/authStore";

// Épico FE-1, tarefa 8: redireciona para /login ao acessar qualquer tela
// interna sem sessão válida.
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
