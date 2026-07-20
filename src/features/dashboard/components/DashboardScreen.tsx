import { Brain } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useAuthStore } from "../../../store/authStore";
import { useAuth } from "../../auth/hooks/useAuth";

// Placeholder do Épico FE-2 — só o suficiente para o fluxo de login/cadastro
// (Épico FE-1) redirecionar para uma rota protegida real. Dashboard completo
// (cards de estatística, atividades recentes, estados vazio/loading) fica
// para a próxima entrega.
export function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-soft font-sans">
      <header className="border-b border-border-soft bg-white">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-brand" />
            <span className="text-lg font-bold text-ink font-heading">Adapta.ia</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-ink font-heading">Olá, {user?.name ?? "professor"}!</h1>
        <p className="text-muted text-sm mt-2 max-w-md">
          Dashboard em construção. Os próximos épicos entregam turmas, alunos e atividades adaptadas por IA.
        </p>
      </main>
    </div>
  );
}
