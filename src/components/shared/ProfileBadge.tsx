import { cn } from "../../lib/utils";

export interface ProfileBadgeProps {
  /** Nome do perfil de aprendizagem; `null`/`undefined` renderiza o estado "sem perfil". */
  name?: string | null;
  /** Prefixo opcional (ex: contagem de alunos por perfil em `TurmasScreen`). */
  count?: number;
  className?: string;
}

// Componente compartilhado (Épico FE-8, tarefa 3): mesma pill de perfil de
// aprendizagem estava duplicada em TurmaDetalheScreen e TurmasScreen, cada
// uma com um estilo levemente diferente.
export function ProfileBadge({ name, count, className }: ProfileBadgeProps) {
  if (!name) {
    return (
      <span
        className={cn(
          "inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600",
          className,
        )}
      >
        Sem perfil definido
      </span>
    );
  }

  return (
    <span
      title={name}
      className={cn(
        "inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand truncate",
        className,
      )}
    >
      {count !== undefined ? `${count}× ` : ""}
      {name}
    </span>
  );
}
