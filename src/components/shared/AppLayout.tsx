import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

// Casca compartilhada do app autenticado (sidebar + área de conteúdo
// rolável) — extraído depois que Dashboard e Turmas passaram a precisar do
// mesmo wrapper (Épico FE-8, tarefa 3: reduzir duplicação entre telas).
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-soft overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
