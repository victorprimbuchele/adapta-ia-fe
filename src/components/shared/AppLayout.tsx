import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

// Casca compartilhada do app autenticado (sidebar + área de conteúdo
// rolável) — extraído depois que Dashboard e Turmas passaram a precisar do
// mesmo wrapper (Épico FE-8, tarefa 3: reduzir duplicação entre telas).
// Em telas pequenas a sidebar vira um drawer aberto por um botão de menu.
export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-soft overflow-hidden font-sans">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border-soft bg-white flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Abrir menu"
            className="text-muted hover:text-ink transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-ink font-heading">Adapta.ai</span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
