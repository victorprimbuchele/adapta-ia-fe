import { Brain, LayoutDashboard, LogOut, Plus, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../features/auth/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, target: "/dashboard" },
  { label: "Turmas", Icon: Users, target: "/turmas" },
  { label: "Nova Atividade", Icon: Plus, target: "/atividades/nova" },
];

// Navegação persistente do app do professor (protótipo Figma Make). Alguns
// destinos (Turmas, Nova Atividade) ainda não têm rota real — o catch-all em
// app/App.tsx redireciona para /dashboard até os épicos FE-3/FE-5 chegarem.
export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  const initials = (user?.name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <aside className="w-[220px] flex-shrink-0 bg-sidebar flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white font-heading">Adapta.ia</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 pt-4">
        {NAV_ITEMS.map(({ label, Icon, target }) => {
          const active = location.pathname.startsWith(target);
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigate(target)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active ? "bg-brand text-white shadow-sm" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="px-3 py-2.5 mb-1 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name ?? "Professor"}</p>
            <p className="text-xs text-white/35 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
