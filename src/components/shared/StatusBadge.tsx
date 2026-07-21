import { CheckCheck, Clock } from "lucide-react";

// Componente compartilhado (Épico FE-8, tarefa 3 — candidato já identificado
// no protótipo Figma Make). `isDraft` é a única sinalização disponível na API
// para diferenciar rascunho de atividade finalizada (ver useDashboardSummary).
export function StatusBadge({ isDraft }: { isDraft: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isDraft
          ? "bg-slate-100 text-slate-500 border border-slate-200"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      {isDraft ? <Clock className="w-3 h-3" /> : <CheckCheck className="w-3 h-3" />}
      {isDraft ? "Rascunho" : "Enviada"}
    </span>
  );
}
