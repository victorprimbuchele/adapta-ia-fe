import { Navigate, Route, Routes } from "react-router-dom";
import { AlunoEditarScreen } from "../features/alunos/components/AlunoEditarScreen";
import { AlunoNovoScreen } from "../features/alunos/components/AlunoNovoScreen";
import { AtividadeEnvioScreen } from "../features/atividades/components/AtividadeEnvioScreen";
import { AtividadeNovaScreen } from "../features/atividades/components/AtividadeNovaScreen";
import { AtividadeProcessandoScreen } from "../features/atividades/components/AtividadeProcessandoScreen";
import { AtividadeRevisaoScreen } from "../features/atividades/components/AtividadeRevisaoScreen";
import { LoginScreen } from "../features/auth/components/LoginScreen";
import { RegisterScreen } from "../features/auth/components/RegisterScreen";
import { DashboardScreen } from "../features/dashboard/components/DashboardScreen";
import { TurmaDetalheScreen } from "../features/turmas/components/TurmaDetalheScreen";
import { TurmaNovaScreen } from "../features/turmas/components/TurmaNovaScreen";
import { TurmasScreen } from "../features/turmas/components/TurmasScreen";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/turmas" element={<TurmasScreen />} />
        <Route path="/turmas/nova" element={<TurmaNovaScreen />} />
        <Route path="/turmas/:id" element={<TurmaDetalheScreen />} />
        <Route path="/turmas/:id/alunos/novo" element={<AlunoNovoScreen />} />
        <Route path="/turmas/:id/alunos/:alunoId/editar" element={<AlunoEditarScreen />} />
        <Route path="/atividades/nova" element={<AtividadeNovaScreen />} />
        <Route path="/atividades/:id/processando" element={<AtividadeProcessandoScreen />} />
        <Route path="/atividades/:id/revisao" element={<AtividadeRevisaoScreen />} />
        <Route path="/atividades/:id/envio/:deliveryId" element={<AtividadeEnvioScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
