import { Brain, LayoutDashboard, LogOut, Plus, Users, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, target: "/dashboard" },
  { label: "Turmas", Icon: Users, target: "/turmas" },
  { label: "Nova Atividade", Icon: Plus, target: "/atividades/nova" },
];

export interface SidebarProps {
  /** Controla a exibição em telas pequenas (drawer); em `md+` a sidebar é sempre visível. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Navegação persistente do app do professor (protótipo Figma Make). Em
// telas pequenas vira um drawer off-canvas controlado por `mobileOpen`,
// já que não cabe fixa ao lado do conteúdo (Épico FE-8: responsividade).
export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
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

  const handleNavigate = (target: string) => {
    navigate(target);
    onMobileClose?.();
  };

  return (
    <>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onMobileClose} aria-hidden="true" />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[220px] flex-shrink-0 bg-sidebar flex flex-col h-full transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white font-heading">Adapta.ai</span>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Fechar menu"
            className="md:hidden text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 pt-4" aria-label="Navegação principal">
          {NAV_ITEMS.map(({ label, Icon, target }) => {
            const active = location.pathname.startsWith(target);
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleNavigate(target)}
                aria-current={active ? "page" : undefined}
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
    </>
  );
}
